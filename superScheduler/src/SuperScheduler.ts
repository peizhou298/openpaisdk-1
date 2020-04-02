// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
// to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
// BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import {ISuperJobConfig, ISuperJobInfo } from "./superJob";
import { JobClient, IJobConfig } from "../../src";
import { IPAICluster } from "../../src/models/cluster";
import { SuperJob } from "./SuperSchedulerEntity";

const now = () => new Date().getTime();
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * OpenPAI Super Scheduler.
 */
export class SuperScheduler {
    jobs: ISuperJobInfo[] = [];
    clusters: {[name: string]: {client: JobClient; priority: number}} = {};
    strategy: stragety.IScheduleStrategy;

    constructor(config: any) {
        var strategyName = "LinerScheduleStrategy";
        if (config.strategy && config.strategy.name) {
            strategyName = config.strategy.name;
        }

        try {
            this.strategy = new stragety[strategyName](config.strategy ? config.strategy : null);
        } catch {
            console.log("Stragery %s not supported, use default stragety instead.", strategyName);
            this.strategy = new stragety.LinerScheduleStrategy();
        }
        
        const clusters: any[] = config.clusters;
        clusters.forEach((cluster) => {
            let paiCluster: IPAICluster = {
                info: {name: cluster.name},
                username: cluster.username,
                token: cluster.token,
                web_portal_uri: cluster.web_portal_uri};

            this.addCluster(paiCluster, cluster.priority?cluster.priority:1);
        });
    }

    findJob = (name: string) => this.jobs[this.jobs.findIndex(val => val.name == name)];

    addCluster = (paiCluster: IPAICluster, priority: number)=> {
        let clusterName = paiCluster.username + paiCluster.info.name
        if(clusterName in this.clusters)
        {
            throw new Error( `ClusterAlreadyExists: ${paiCluster}`);
        }

        this.clusters[clusterName] = {client: new JobClient(paiCluster), priority: priority};
        return this.clusters[clusterName];
    };

    submitJob = async (config: ISuperJobConfig, username: string) => {
        if (this.findJob(config.name))
        {
            throw new Error(`JobAlreadyExists: ${name}`);
        }

        let superjob: ISuperJobInfo = {
            name: config.name,
            username: username,
            state: 'WAITING',
            clusters: config.clusters.map((cluster) => username + cluster),
            IPaiJobs: [],
            createdTime: now(),
            scheduleCounter: 0,
            nextScheduleTime: now() + config.scheduleInterval?config.scheduleInterval : 2 * 60,
        };

        SuperJob.create({
            name: config.name,
            username: username,
            state: 'WAITING',
            createdTime: superjob.createdTime,
            clusters: config.clusters.toString(),
            scheduleCounter: 0,
            nextScheduleTime:superjob.nextScheduleTime,
        }).then(superJob => {
            console.log("Create a new superJob:", superJob);
        });

        superjob.clusters.forEach(async (val, idx) => {
            let client = this.clusters[val].client;
            await client.submit(config as IJobConfig);
        });
        
        // sleep 5s to make sure job created in each cluster
        await delay(5000);

        superjob.clusters.forEach(async (val, idx) => {
            superjob.IPaiJobs[idx] = await this.clusters[val].client.get(username, config.name);
            console.log(superjob.IPaiJobs[idx]);
        });

        //TODO: add a new super job entity in database
        this.jobs.push(superjob);
        return superjob;
    };

    scheduleJob = async (job: ISuperJobInfo) => {
        // update status of each sub jobs
        job.clusters.forEach(async (val, idx) => {
            const client = this.clusters[val].client;
            const subJob = job.IPaiJobs[idx];
            if (subJob && ['WAITING', 'RUNNING'].indexOf(subJob.jobStatus.state) > -1) {
                // need to query latest status
                if (subJob.name) {
                    job.IPaiJobs[idx] = await client.get(job.username, subJob.name);
                }
            }
        });

        const currentState = job.state;
        let cluster = this.strategy.scheduleSuperJob(job, this.clusters);
        if (currentState !== job.state) {
            SuperJob.update({ state: job.state }, {
                where: {
                  name: job.name,
                  username: job.username
                }
              }).then(() => {
                console.log("Update user %s job %s status to %s", job.username, job.name, job.state);
              });
        }

        if (job.state === 'SCHEDULED') {
            job.clusters.forEach(async (val, idx) => {
                const client = this.clusters[val].client;
                const subJob = job.IPaiJobs[idx];
                if (val != cluster && ['WAITING', 'RUNNING'].indexOf(subJob.jobStatus.state) > -1 ) {
                    if (subJob.name) {
                        await client.delete(job.username, subJob.name);
                    }
                }
            });
        }
    };

    schedule = async () => {
        let openjobs = this.jobs.filter(val => val.state === 'WAITING' || val.state === 'OBSERVING');
        openjobs.forEach(job => {
            job.scheduleCounter++;
            this.scheduleJob(job);
        });
    };
}


/**
 * here is the schedule strategy 
 */

namespace stragety{
    export interface IScheduleStrategy {
        config?: any
        scheduleSuperJob(job: ISuperJobInfo, priority: any) : string;
    }

    export class LinerScheduleStrategy {
        factor: number = 1;
        observingTime: number = 1 * 60;

        constructor (config?: any) {
            if (config) {
                this.factor = config.factor ? config.factor : 1;
                this.observingTime = config.observingTime ? config.observingTime : 1 * 60;
            }
        }

        scheduleSuperJob (job: ISuperJobInfo, priority: any) : string {
            var scores: number[];
            var maxScore = 0;
            var maxIndex = -1;
            
            job.clusters.forEach((val, index) => {
                const subJob = job.IPaiJobs[index];
                if (subJob.jobStatus.state === 'SUCCEEDED' ) {
                    job.state = 'SCHEDULED';
                    job.nextScheduleTime = -1;
                    return val;
                }
                
                if (subJob.jobStatus.state === 'WAITING') {
                    scores[index] = priority[val].priority;
                }

                if (subJob.jobStatus.state === 'RUNNING') {
                    scores[index] = priority[val].priority + this.factor * (now() - subJob.jobStatus.appLaunchedTime);
                } else {
                    scores[index] = 0;
                }

                if ( maxScore < scores[index] || (!scores[index] && maxScore == scores[index] &&  priority[val].priority >  priority[val].priority)) {
                    maxScore = scores[index];
                    maxIndex = index;
                }
            });

            if ( !maxScore) {
                job.state = 'FAILED';
                return "";
            } else {
                let choosedJob = job.IPaiJobs[maxIndex];
                if ( choosedJob.jobStatus.state === 'RUNNING') {
                    if (now() - choosedJob.jobStatus.appLaunchedTime >= this.observingTime)
                    {
                        job.state = 'SCHEDULED';
                        job.nextScheduleTime = -1;
                    }
                    else
                    {
                        job.state = 'OBSERVING';
                        job.nextScheduleTime = now() + 2 * 60;
                    }
                }
                return job.clusters[maxIndex];
            }
        }
    }
}
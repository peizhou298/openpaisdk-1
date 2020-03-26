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

import { ISuperJobInfo } from "./models/superJob";
import { JobClient, IJobConfig } from ".";
import { IPAIClusterInfo, IPAICluster } from "./models/cluster";

const now = () => new Date().getTime();
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * OpenPAI Super Scheduler.
 */
class SuperScheduler {
    jobs: ISuperJobInfo[] = [];
    clusters: { [name: string]: JobClient; } = {};
    strategy: IScheduleStrategy;

    constructor(strategy : IScheduleStrategy, clusters? : IPAICluster[]) {
       this.strategy = strategy;
       if (clusters) {
           clusters.forEach(cluster => {
               this.addCluster(cluster);
           });
       }
    }

    findJob = (name: string) => this.jobs[this.jobs.findIndex(val => val.name == name)];

    addCluster = (cfg: IPAICluster) => {
        //TODO : use a must existed property, add login auth
        let clusterName = cfg.username + (cfg.info?.name ? cfg.info?.name : "abc");
        if(clusterName in this.clusters)
        {
            throw new Error( `ClusterAlreadyExists: ${cfg}`);
        }

        this.clusters[clusterName] = new JobClient(cfg);
        return cfg;
    };

    submitJob = async (name: string, clusters: string[], priority: number[], paiJob: IJobConfig, username: string, token?: string): Promise<ISuperJobInfo> => {
        if (this.findJob(name))
        {
            throw new Error(`JobAlreadyExists: ${name}`);
        }

        let superjob: ISuperJobInfo = {
            name: name,
            username: username,
            state: 'WAITING',
            clusters: clusters.map((cluster) => username + cluster),
            priority: priority,
            IPaiJobs: [],
            createdTime: now(),
            scheduleCounter: 0,
            nextScheduleTime: now() + 1 * 60,
            token: token,
        };

        let paiJobName = paiJob.name;
        clusters.forEach(async (val, idx) => {
            paiJob.name = paiJobName + val;
            await this.clusters[val].submit(paiJob, token);
        });
        
        // sleep 5s to make sure job created in each cluster
        await delay(5000);

        clusters.forEach(async (val, idx) => {
            superjob.IPaiJobs[idx] = await this.clusters[val].get(username, paiJobName + val);
        });

        //TODO: add a new super job entity in database
        this.jobs.push(superjob);
        return superjob;
    };

    scheduleJob = async (job: ISuperJobInfo) => {
        // update status of each sub jobs
        job.clusters.forEach(async (val, idx) => {
            const client = this.clusters[val];
            const subJob = job.IPaiJobs[idx];
            if (subJob && ['WAITING', 'RUNNING'].indexOf(subJob.jobStatus.state) > -1) {
                // need to query latest status
                if (subJob.name) {
                    job.IPaiJobs[idx] = await client.get(job.username, subJob.name);
                }
            }
        });

        let cluster = this.strategy.scheduleSuperJob(job);
        // TODO: add latest state to database async
        if (job.state === 'SCHEDULED') {
            job.clusters.forEach(async (val, idx) => {
                const client = this.clusters[val];
                const subJob = job.IPaiJobs[idx];
                if (val != cluster && ['WAITING', 'RUNNING'].indexOf(subJob.jobStatus.state) > -1 ) {
                    if (subJob.name) {
                        await client.delete(job.username, subJob.name, job.token);
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

interface  IScheduleStrategy {
    scheduleSuperJob(job: ISuperJobInfo) : string;
}

class LinerScheduleStrategy {
    factor: number;
    observingTime: number;

    constructor (factor : number, observingTime: number) {
        this.factor = factor;
        this.observingTime = observingTime;
    }

    scheduleSuperJob (job: ISuperJobInfo) : string {
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
                scores[index] = job.priority[index];
            }

            if (subJob.jobStatus.state === 'RUNNING') {
                scores[index] = job.priority[index] + this.factor * (now() - subJob.jobStatus.appLaunchedTime);
            } else {
                scores[index] = 0;
            }

            if ( maxScore < scores[index] || (!scores[index] && maxScore == scores[index] && job.priority[index] > job.priority[maxIndex])) {
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
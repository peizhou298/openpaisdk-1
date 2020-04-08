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

import {SuperScheduler, now} from "./SuperScheduler";
import * as restify from 'restify';
import * as Sequelize from 'sequelize';
import { SuperJob } from "./SuperSchedulerEntity";
import { ISuperJobInfo } from "./superJob";
const sqlite3 = require('sqlite3').verbose()
const SuperSchedulerEntity = require('./SuperSchedulerEntity');
let path = process.argv[2] ? process.argv[2] : "./config.json";
const config = require(path)

if (config === undefined) {
    throw new Error( `ConfigFileNotFound : ${path}`);
}

export const sequelize = new Sequelize.Sequelize(
    {
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        dialectModule: sqlite3,
        dialect: 'sqlite',
        storage: config.database ? config.database : './db.sqlite'
    })

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to database has been established successfully.');
  })
  .catch((err: any) => {
    console.error('Unable to connect to the database:', err);
  });


SuperSchedulerEntity.Init(sequelize);
const scheduler = new SuperScheduler(config);

// restore super job from database
SuperJob.findAll().then(jobs => jobs.forEach(job => {
    var superJob: ISuperJobInfo = {
            name: job.name,
            username: job.username,
            state: 'WAITING',
            clusters: job.clusters.toString().split(','),
            IPaiJobs: [],
            createdTime: job.createdTime,
            scheduleCounter: 0,
            nextScheduleTime: Math.max(job.nextScheduleTime, now() + 2 * 60)
        }
    superJob.clusters.forEach(async (cluster, index) => {
        cluster = superJob.username + "@" + cluster; 
        if (scheduler.clusters[cluster] === undefined) {
            console.log("Can't get infromation of cluster ", cluster);
            superJob.IPaiJobs[index] = null
        } else {
            superJob.IPaiJobs[index] = await scheduler.clusters[cluster].client.get(superJob.username, superJob.name)
        }
    });
    scheduler.jobs.push(superJob);
}));

console.log("Restore super jobs %s from database", scheduler.jobs);


// schedule
setInterval(async () => {
    scheduler.schedule();
}, config.scheduleInterval ? config.scheduleInterval : 60000);


/**
 * here is the RESTful server
 */
 
const server = restify.createServer({
    name:'superScheduler',
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.get('/api/:username/jobs', (req, res, next) => {
    // from database
    res.send(scheduler.jobs);
    return next();
});
 
server.get('/api/:username/clusters', (req, res, next) => {
    const keys: string[] = Object.keys(scheduler.clusters)
    console.log(keys)
    res.send(keys.filter(key => key.includes(req.params.username)).map(cluster => cluster.split("@")[1]));
    return next();
});
 
server.post('/api/:username/job', async (req, res, next) => {
    res.send(await scheduler.submitJob(req.body, req.params.username));
    return next();
});

server.listen(8080, function () {
    console.log('Server listening at %s', server.name);
});


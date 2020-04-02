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

import {SuperScheduler} from "./SuperScheduler";
import * as restify from 'restify';
import * as Sequelize from 'sequelize';
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
    console.log('Connection has been established successfully.');
  })
  .catch((err: any) => {
    console.error('Unable to connect to the database:', err);
  });


SuperSchedulerEntity.Init(sequelize);
const scheduler = new SuperScheduler(config);

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
    console.log(req.params)
    res.send(scheduler.jobs);
    return next();
});
 
server.get('/:username/clusters', (req, res, next) => {
    // from database
    res.send(scheduler.clusters);
    return next();
});
 
server.post('/api/:username/job', async (req, res, next) => {
    res.send(await scheduler.submitJob(req.body, req.params.username));
    return next();
});

server.listen(8080, function () {
    console.log('%s listening at %s', server.name);
});


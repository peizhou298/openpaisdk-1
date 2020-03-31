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

import {SuperScheduler, LinerScheduleStrategy} from "./SuperScheduler";
import { IPAICluster } from "../../src";
import * as restify from 'restify';

let clusters: IPAICluster[] = [{username: 'admin', password: 'admin-password', web_portal_uri: 'http://10.151.40.32'}]

const scheduler = new SuperScheduler(new LinerScheduleStrategy(1, 0), clusters);
    setInterval(async () => {
    scheduler.schedule();
}, 10000);
 
/**
 * here is the RESTful server
 */
 
const server = restify.createServer({
    name:'superScheduler',
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.get('/jobs', (req, res, next) => {
    res.send(scheduler.jobs);
    return next();
});
 
server.get('/clusters', (req, res, next) => {
    res.send(scheduler.clusters);
    return next();
});
 
server.post('/job', async (req, res, next) => {
    res.send(await scheduler.submitJob(req.body.name, req.body.clusters, req.body.priority, req.body.paiJob, req.body.username));
    return next();
});

server.post('/test', async (req, res, next) => {
    res.send(await scheduler.test(req.body.name, req.body.clusters, req.body.priority, req.body.paiJob, req.body.username));
    return next();
});

server.listen(8080, function () {
    console.log('%s listening at %s', server.name);
});


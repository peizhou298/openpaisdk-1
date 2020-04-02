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

import * as Sequelize from "sequelize"
import { IJobStatus } from "../../src";

const Model = Sequelize.Model;

export class SuperJob extends Model{
    public id!: number;
    public name!: string;
    public username!: string;
    public state!: 'WAITING' | 'OBSERVING' | 'SCHEDULED' | 'STOPPED' | 'FAILED' | 'UNKNOWN';
    public createdTime!: number;
    public completedTime?: number;
    public scheduleCounter?: number;
    public nextScheduleTime?: number;
    public clusters!: string[];
    public IPaiJobs?: IJobStatus[];

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export function Init(sequelize: Sequelize.Sequelize) {
    SuperJob.init({
        // attributes
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        state: {
            type: Sequelize.ENUM('WAITING', 'OBSERVING', 'SCHEDULED', 'STOPPED', 'FAILED', 'UNKNOWN'),
            allowNull: false
        },
        createdTime: {
            type: Sequelize.BIGINT,
            allowNull: false
        },
        completedTime: {
            type: Sequelize.BIGINT,
            allowNull: true
        },
        scheduleCounter: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        nextScheduleTime: {
            type: Sequelize.BIGINT,
            allowNull: true
        },
        clusters: {
            type: Sequelize.BLOB,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'SuperJob'
        }
    )

    sequelize.sync()
}
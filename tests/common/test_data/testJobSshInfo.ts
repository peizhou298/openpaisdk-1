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

// tslint:disable-next-line:missing-jsdoc
import { IJobSshInfo } from '../../../src/models/job';

export const testJobSshInfo: IJobSshInfo = {
    containers: [
        {
            id: 'container_e34_1565337391589_0002_01_000002',
            sshIp: '0.0.0.38',
            sshPort: '34235'
        }
    ],
    keyPair: {
        folderPath: 'hdfs://0.0.0.34:9000/Container/core/core~tensorflow_serving_mnist_2019_6585ba19/ssh/keyFiles',
        publicKeyFileName: 'core~tensorflow_serving_mnist_2019_6585ba19.pub',
        privateKeyFileName: 'core~tensorflow_serving_mnist_2019_6585ba19',
        // tslint:disable-next-line:max-line-length
        privateKeyDirectDownloadLink: 'http://0.0.0.34/a/0.0.0.34:5070/webhdfs/v1/Container/core/core~tensorflow_serving_mnist_2019_6585ba19/ssh/keyFiles/core~tensorflow_serving_mnist_2019_6585ba19?op=OPEN'
    }
};

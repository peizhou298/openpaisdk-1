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
import * as chai from 'chai';
import { expect } from 'chai';
import * as dirtyChai from 'dirty-chai';
import * as fs from 'fs';
import * as mockFs from 'mock-fs';
import * as nock from 'nock';
import * as os from 'os';
import * as path from 'path';

import { AzureBlobClient, IFileInfo } from '../../src';
import {
    testAzureBlobInfoSasToken,
    testAzureBlobInfoShareKey
} from '../common/test_data/testStorages';

const testUri: string = 'openpai-js-sdk.test/rest-server';
let client: AzureBlobClient;

chai.use(dirtyChai);
beforeEach(() => {
    client = new AzureBlobClient(testAzureBlobInfoShareKey);
});

describe('Get status of a path', () => {
    const filePath: string = '.tests/folder/test_blob.txt';
    const folderPath: string = '.tests/folder';
    const response: string = '<?xml version="1.0" encoding="utf-8"?>' +
        '<EnumerationResults>' +
        '<Blobs><Blob><Name>.tests/folder/test_blob.txt</Name></Blob></Blobs><NextMarker />' +
        '</EnumerationResults>';

    before(() => {
        nock(`http://${testUri}`).get('/api/v1/authn/info').reply(200);
        nock('https://accountname.blob.core.windows.net')
            .head('/containerName/.tests%2Ffolder%2Ftest_blob.txt')
            .reply(200)
            .head('/containerName/.tests%2Ffolder')
            .reply(404, '', { 'x-ms-error-code': 'BlobNotFound' })
            .get('/containerName?prefix=.tests%2Ffolder%2F&delimiter=%2F&maxresults=1&include=metadata&restype=container&comp=list')
            .reply(200, response, { 'Content-Type': 'application/xml' });
    });

    // tslint:disable-next-line:mocha-no-side-effect-code
    it('should be a file', async () => {
        const res: IFileInfo = await client.getinfo(filePath);
        expect(res.type).to.be.equal('file');
    }).timeout(10000);

    // tslint:disable-next-line:mocha-no-side-effect-code
    it('should be a folder', async () => {
        const res: IFileInfo = await client.getinfo(folderPath);
        expect(res.type).to.be.equal('directory');
    }).timeout(10000);
});

describe('List directory of a path', () => {
    const folderPath1: string = '.tests/folder';
    const folderPath2: string = '.tests/test';
    const response: string = '<?xml version="1.0" encoding="utf-8"?>' +
        '<EnumerationResults>' +
        '<Blobs><Blob><Name>.tests/folder/test_blob.txt</Name></Blob></Blobs><NextMarker />' +
        '</EnumerationResults>';
    const empty: string = '<?xml version="1.0" encoding="utf-8"?>' +
        '<EnumerationResults>' +
        '<Blobs /><NextMarker />' +
        '</EnumerationResults>';

    before(() => {
        nock('https://accountname.blob.core.windows.net')
            .get('/containerName?prefix=.tests%2Ffolder%2F&delimiter=%2F&maxresults=20&include=metadata&restype=container&comp=list')
            .reply(200, response, { 'Content-Type': 'application/xml' })
            .get('/containerName?prefix=.tests%2Ftest%2F&delimiter=%2F&maxresults=20&include=metadata&restype=container&comp=list')
            .reply(200, empty, { 'Content-Type': 'application/xml' });
    });

    // tslint:disable-next-line:mocha-no-side-effect-code
    it('should return a list', async () => {
        const res: string[] = await client.listdir(folderPath1);
        expect(res.length).to.be.equal(1);
    }).timeout(10000);

    // tslint:disable-next-line:mocha-no-side-effect-code
    it('should return an empty list', async () => {
        const res: string[] = await client.listdir(folderPath2);
        expect(res).to.be.empty();
    }).timeout(10000);
});

describe('Create folder and delete', () => {
    const response: string = '<?xml version="1.0" encoding="utf-8"?>' +
        '<EnumerationResults>' +
        '<Blobs><Blob><Name>.tests/testFolder</Name></Blob></Blobs><NextMarker />' +
        '</EnumerationResults>';
    const empty: string = '<?xml version="1.0" encoding="utf-8"?>' +
        '<EnumerationResults>' +
        '<Blobs /><NextMarker />' +
        '</EnumerationResults>';

    before(() => {
        nock('https://accountname.blob.core.windows.net')
            .put('/containerName/.tests%2FtestFolder')
            .reply(201)
            .get('/containerName?prefix=.tests%2F&delimiter=%2F&maxresults=20&include=metadata&restype=container&comp=list')
            .reply(200, response, { 'Content-Type': 'application/xml' });
    });

    const folderPath: string = '.tests/testFolder';

    // tslint:disable-next-line:mocha-no-side-effect-code
    it('should makedir and delete it', async () => {
        await client.makedir(folderPath);
        let list: string[] = await client.listdir(path.dirname(folderPath));

        expect(list).contain(path.basename(folderPath));

        nock('https://accountname.blob.core.windows.net')
            .delete('/containerName/.tests%2FtestFolder')
            .reply(202)
            .get('/containerName?prefix=.tests%2F&delimiter=%2F&maxresults=20&include=metadata&restype=container&comp=list')
            .reply(200, empty, { 'Content-Type': 'application/xml' });

        await client.delete(folderPath);
        list = await client.listdir(path.dirname(folderPath));
        expect(list).not.contain(path.basename(folderPath));
    }).timeout(10000);
});

describe('Upload and download', () => {
    let localPath: string;
    let newLocalPath: string;
    const filePath: string = '.tests/test_upload_download.py';

    before(() => {
        localPath = path.join(os.tmpdir(), './.test/test.py');
        newLocalPath = path.join(os.tmpdir(), './.test/new_test.py');
        nock('https://accountname.blob.core.windows.net')
            .put('/containerName/.tests%2Ftest_upload_download.py')
            .reply(201)
            .get('/containerName/.tests%2Ftest_upload_download.py')
            .reply(200, 'test content', {
                'Content-Type': 'application/octet-stream',
                'Content-Length': ['12'],
                ETag: '0x8D7B9FC84AD5D1F'
            });
    });

    // tslint:disable-next-line:mocha-no-side-effect-code
    it('should upload a file and download it', async () => {
        const mockDirectory: any = {};
        mockDirectory[localPath] = 'test content';
        mockFs(mockDirectory);
        const upload: string = fs.readFileSync(localPath, 'utf8');
        await client.upload(localPath, filePath);
        await client.download(filePath, newLocalPath);
        const download: string = fs.readFileSync(newLocalPath, 'utf8');

        expect(download).to.be.eq(upload);
    }).timeout(10000);

    after(() => mockFs.restore());
});

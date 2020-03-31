"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var storage_blob_1 = require("@azure/storage-blob");
var Path = require("path");
/**
 * Azure Blob Storage Client.
 */
var AzureBlobClient = /** @class */ (function () {
    function AzureBlobClient(config) {
        this.mkdirAllowRecursive = true;
        this.config = config;
        var data = config.data;
        if (config.type !== 'azureBlob' ||
            !data ||
            !data.containerName ||
            !(data.accountKey || data.accountSASToken)) {
            throw new Error("WrongStorageDetail: " + JSON.stringify(config));
        }
        if (data.accountKey) { // use the accountKey
            var credential = new storage_blob_1.StorageSharedKeyCredential(data.accountName, data.accountKey);
            var blobClient = new storage_blob_1.BlobServiceClient("https://" + data.accountName + ".blob.core.windows.net", credential);
            this.client = blobClient.getContainerClient(data.containerName);
        }
        else { // SAS token
            var url = data.accountSASToken;
            if (!url.startsWith('https://')) {
                url = "https://" + data.accountName + ".blob.core.windows.net" + data.accountSASToken;
            }
            var blobClient = new storage_blob_1.BlobServiceClient(url);
            this.client = blobClient.getContainerClient(data.containerName);
        }
    }
    /**
     * Get status of a path.
     * @param path The path.
     */
    AzureBlobClient.prototype.getinfo = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var blobClient, properties, err_1, iter, prefixes, blobs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blobClient = this.client.getBlockBlobClient(path);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 6]);
                        return [4 /*yield*/, blobClient.getProperties()];
                    case 2:
                        properties = _a.sent();
                        if (!properties.metadata || !properties.metadata.hdi_isfolder) {
                            return [2 /*return*/, {
                                    size: properties.contentLength,
                                    type: 'file',
                                    mtime: properties.lastModified
                                }];
                        }
                        else {
                            return [2 /*return*/, {
                                    type: 'directory',
                                    mtime: properties.lastModified
                                }];
                        }
                        return [3 /*break*/, 6];
                    case 3:
                        err_1 = _a.sent();
                        if (!(err_1.details && err_1.details.errorCode === 'BlobNotFound')) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.client.listBlobsByHierarchy('/', {
                                prefix: path.endsWith('/') ? path : path + '/',
                                includeMetadata: true
                            }).byPage({
                                continuationToken: undefined,
                                maxPageSize: 1
                            }).next()];
                    case 4:
                        iter = _a.sent();
                        prefixes = iter.value.segment.blobPrefixes;
                        blobs = iter.value.segment.blobItems;
                        if ((prefixes && prefixes.length > 0) || blobs.length > 0) {
                            return [2 /*return*/, {
                                    type: 'directory'
                                }];
                        }
                        _a.label = 5;
                    case 5:
                        console.log(err_1);
                        throw err_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AzureBlobClient.prototype.listdir = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var result_1, currentPrefixes_1, currentContinuationToken, iter, prefixes, blobs, _i, blobs_1, blob, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        result_1 = [];
                        currentPrefixes_1 = new Set();
                        currentContinuationToken = void 0;
                        iter = void 0;
                        _a.label = 1;
                    case 1: return [4 /*yield*/, this.client.listBlobsByHierarchy('/', {
                            prefix: path.endsWith('/') ? path : path + '/',
                            includeMetadata: true
                        }).byPage({
                            continuationToken: currentContinuationToken,
                            maxPageSize: 20
                        }).next()];
                    case 2:
                        iter = _a.sent();
                        currentContinuationToken = iter.value.continuationToken;
                        prefixes = iter.value.segment.blobPrefixes;
                        if (prefixes) {
                            prefixes.forEach(function (item) {
                                result_1.push(Path.basename(item.name));
                                currentPrefixes_1.add(item.name);
                            });
                        }
                        blobs = iter.value.segment.blobItems;
                        for (_i = 0, blobs_1 = blobs; _i < blobs_1.length; _i++) {
                            blob = blobs_1[_i];
                            if (blob.metadata && blob.metadata.hdi_isfolder && blob.metadata.hdi_isfolder === 'true') {
                                if (currentPrefixes_1.has(blob.name + "/")) {
                                    continue;
                                }
                            }
                            result_1.push(Path.basename(blob.name));
                        }
                        _a.label = 3;
                    case 3:
                        if (currentContinuationToken) return [3 /*break*/, 1];
                        _a.label = 4;
                    case 4: return [2 /*return*/, result_1];
                    case 5:
                        err_2 = _a.sent();
                        console.log(err_2);
                        throw err_2;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AzureBlobClient.prototype.makedir = function (path, mode) {
        return __awaiter(this, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.getBlockBlobClient(path).upload('', 0, {
                                metadata: {
                                    hdi_isfolder: 'true'
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        console.log(err_3);
                        throw err_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AzureBlobClient.prototype.upload = function (localPath, remotePath, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var blobClient, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        blobClient = this.client.getBlockBlobClient(remotePath);
                        return [4 /*yield*/, blobClient.uploadFile(localPath)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _a.sent();
                        console.log(err_4);
                        throw err_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AzureBlobClient.prototype.download = function (remotePath, localPath, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var blobClient, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        blobClient = this.client.getBlockBlobClient(remotePath);
                        return [4 /*yield*/, blobClient.downloadToFile(localPath)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_5 = _a.sent();
                        console.log(err_5);
                        throw err_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AzureBlobClient.prototype["delete"] = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var blobClient, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        blobClient = this.client.getBlockBlobClient(path);
                        return [4 /*yield*/, blobClient["delete"]()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_6 = _a.sent();
                        console.log(err_6);
                        throw err_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AzureBlobClient.prototype.deleteFolder = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var info, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.getinfo(path)];
                    case 1:
                        info = _a.sent();
                        if (!(info.type === 'file')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.client.deleteBlob(path)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.deleteBlobsByHierarchy(this.client, path)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        err_7 = _a.sent();
                        console.log(err_7);
                        throw err_7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    AzureBlobClient.prototype.deleteBlobsByHierarchy = function (client, prefix) {
        return __awaiter(this, void 0, void 0, function () {
            var iter, blobItem, blob, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        iter = client.listBlobsByHierarchy('/', {
                            prefix: prefix.endsWith('/') ? prefix : prefix + '/'
                        });
                        return [4 /*yield*/, iter.next()];
                    case 1:
                        blobItem = _b.sent();
                        _b.label = 2;
                    case 2:
                        if (!!blobItem.done) return [3 /*break*/, 11];
                        blob = blobItem.value;
                        if (!(blob.kind === 'blob')) return [3 /*break*/, 4];
                        return [4 /*yield*/, client.deleteBlob(blob.name)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 4:
                        _b.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, client.deleteBlob(blob.name.slice(0, -1))];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        _a = _b.sent();
                        return [3 /*break*/, 7];
                    case 7: return [4 /*yield*/, this.deleteBlobsByHierarchy(client, blob.name)];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [4 /*yield*/, iter.next()];
                    case 10:
                        blobItem = _b.sent();
                        return [3 /*break*/, 2];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    return AzureBlobClient;
}());
exports.AzureBlobClient = AzureBlobClient;

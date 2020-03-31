"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var __1 = require("..");
var baseClient_1 = require("./baseClient");
var cacheClient_1 = require("./cacheClient");
var jobClient_1 = require("./jobClient");
var storageClient_1 = require("./storageClient");
var userClient_1 = require("./userClient");
var virtualClusterClient_1 = require("./virtualClusterClient");
/**
 * OpenPAI Client.
 */
var OpenPAIClient = /** @class */ (function (_super) {
    __extends(OpenPAIClient, _super);
    function OpenPAIClient(cluster, cache) {
        var _this = _super.call(this, cluster) || this;
        _this.job = new jobClient_1.JobClient(cluster);
        _this.user = new userClient_1.UserClient(cluster);
        _this.virtualCluster = new virtualClusterClient_1.VirtualClusterClient(cluster);
        _this.authn = new __1.AuthnClient(cluster);
        _this.storage = new storageClient_1.StorageClient(cluster);
        _this.cache = new cacheClient_1.CacheClient(cache);
        _this.cache.delegate(_this.storage, _this.storage.getStorages);
        _this.cache.delegate(_this.storage, _this.storage.getStorageByName);
        return _this;
    }
    return OpenPAIClient;
}(baseClient_1.OpenPAIBaseClient));
exports.OpenPAIClient = OpenPAIClient;

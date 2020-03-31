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
var request = require("request-promise-native");
var util_1 = require("../commom/util");
var baseClient_1 = require("./baseClient");
/**
 * OpenPAI User client.
 */
var UserClient = /** @class */ (function (_super) {
    __extends(UserClient, _super);
    function UserClient(cluster) {
        return _super.call(this, cluster) || this;
    }
    /**
     * Get user information.
     * @param userName The user name.
     * @param token Specific an access token (optional).
     */
    UserClient.prototype.get = function (userName, token) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = util_1.Util.fixUrl(this.cluster.rest_server_uri + "/api/v2/user/" + userName);
                        if (!(token === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, _super.prototype.token.call(this)];
                    case 1:
                        token = _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, request.get(url, {
                            headers: {
                                Authorization: "Bearer " + token
                            }
                        })];
                    case 3:
                        res = _a.sent();
                        return [2 /*return*/, JSON.parse(res)];
                }
            });
        });
    };
    /**
     * Get all users.
     * @param token Specific an access token (optional).
     */
    UserClient.prototype.list = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = util_1.Util.fixUrl(this.cluster.rest_server_uri + "/api/v2/user/");
                        if (!(token === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, _super.prototype.token.call(this)];
                    case 1:
                        token = _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, request.get(url, {
                            headers: {
                                Authorization: "Bearer " + token
                            }
                        })];
                    case 3:
                        res = _a.sent();
                        return [2 /*return*/, JSON.parse(res)];
                }
            });
        });
    };
    /**
     * Create a new user.
     * @param username username in [\w.-]+ format.
     * @param password password at least 6 characters.
     * @param admin true | false.
     * @param email email address or empty string.
     * @param virtualCluster ["vcname1 in [A-Za-z0-9_]+ format", "vcname2 in [A-Za-z0-9_]+ format"].
     * @param extension { "extension-key1": "extension-value1" }.
     * @param token Specific an access token (optional).
     */
    UserClient.prototype.create = function (username, password, admin, email, virtualCluster, extension, token) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = util_1.Util.fixUrl(this.cluster.rest_server_uri + "/api/v2/user/");
                        if (!(token === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, _super.prototype.token.call(this)];
                    case 1:
                        token = _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, request.post(url, {
                            body: JSON.stringify({ username: username, email: email, password: password, admin: admin, virtualCluster: virtualCluster, extension: extension }),
                            headers: {
                                Authorization: "Bearer " + token,
                                'Content-Type': 'application/json'
                            }
                        })];
                    case 3:
                        res = _a.sent();
                        return [2 /*return*/, JSON.parse(res)];
                }
            });
        });
    };
    /**
     * Update user extension data.
     * @param userName The user name.
     * @param extension The new extension.
     * {
     *   "extension": {
     *      "key-you-wannat-add-or-update-1": "value1",
     *      "key-you-wannat-add-or-update-2": {...},
     *      "key-you-wannat-add-or-update-3": [...]
     * }
     * @param token Specific an access token (optional).
     */
    UserClient.prototype.updateExtension = function (userName, extension, token) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = util_1.Util.fixUrl(this.cluster.rest_server_uri + "/api/v2/user/" + userName + "/extension");
                        if (!(token === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, _super.prototype.token.call(this)];
                    case 1:
                        token = _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.sendPutRequestWithToken(url, { extension: extension }, token)];
                    case 3:
                        res = _a.sent();
                        return [2 /*return*/, JSON.parse(res)];
                }
            });
        });
    };
    /**
     * Delete a user.
     * @param userName The user name.
     * @param token Specific an access token (optional).
     */
    UserClient.prototype["delete"] = function (userName, token) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = util_1.Util.fixUrl(this.cluster.rest_server_uri + "/api/v2/user/" + userName);
                        if (!(token === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, _super.prototype.token.call(this)];
                    case 1:
                        token = _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, request["delete"](url, {
                            headers: {
                                Authorization: "Bearer " + token,
                                'Content-Type': 'application/json'
                            }
                        })];
                    case 3:
                        res = _a.sent();
                        return [2 /*return*/, JSON.parse(res)];
                }
            });
        });
    };
    /**
     * Update user's virtual cluster.
     * @param userName The user name.
     * @param virtualCluster The new virtualCluster.
     * {
     *    "virtualCluster": ["vcname1 in [A-Za-z0-9_]+ format", "vcname2 in [A-Za-z0-9_]+ format"]
     * }
     * @param token Specific an access token (optional).
     */
    UserClient.prototype.updateVirtualcluster = function (userName, virtualCluster, token) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = util_1.Util.fixUrl(this.cluster.rest_server_uri + "/api/v2/user/" + userName + "/virtualcluster");
                        if (!(token === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, _super.prototype.token.call(this)];
                    case 1:
                        token = _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.sendPutRequestWithToken(url, { virtualCluster: virtualCluster }, token)];
                    case 3:
                        res = _a.sent();
                        return [2 /*return*/, JSON.parse(res)];
                }
            });
        });
    };
    /**
     * Update user's password.
     * @param userName The user name.
     * @param oldPassword password at least 6 characters, admin could ignore this params.
     * @param newPassword password at least 6 characters.
     * @param token Specific an access token (optional).
     */
    UserClient.prototype.updatePassword = function (userName, oldPassword, newPassword, token) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = util_1.Util.fixUrl(this.cluster.rest_server_uri + "/api/v2/user/" + userName + "/password");
                        if (!(token === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, _super.prototype.token.call(this)];
                    case 1:
                        token = _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.sendPutRequestWithToken(url, { oldPassword: oldPassword, newPassword: newPassword }, token)];
                    case 3:
                        res = _a.sent();
                        return [2 /*return*/, JSON.parse(res)];
                }
            });
        });
    };
    /**
     * Update user's email.
     * @param userName The user name.
     * @param email The new email.
     * @param token Specific an access token (optional).
     */
    UserClient.prototype.updateEmail = function (userName, email, token) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = util_1.Util.fixUrl(this.cluster.rest_server_uri + "/api/v2/user/" + userName + "/email");
                        if (!(token === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, _super.prototype.token.call(this)];
                    case 1:
                        token = _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.sendPutRequestWithToken(url, { email: email }, token)];
                    case 3:
                        res = _a.sent();
                        return [2 /*return*/, JSON.parse(res)];
                }
            });
        });
    };
    /**
     * Update user's admin permission.
     * @param userName The user name.
     * @param admin true | false.
     * @param token Specific an access token (optional).
     */
    UserClient.prototype.updateAdminPermission = function (userName, admin, token) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = util_1.Util.fixUrl(this.cluster.rest_server_uri + "/api/v2/user/" + userName + "/admin");
                        if (!(token === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, _super.prototype.token.call(this)];
                    case 1:
                        token = _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.sendPutRequestWithToken(url, { admin: admin }, token)];
                    case 3:
                        res = _a.sent();
                        return [2 /*return*/, JSON.parse(res)];
                }
            });
        });
    };
    /**
     * Update user's group list.
     * @param userName The user name.
     * @param grouplist The new group list.
     * @param token Specific an access token (optional).
     */
    UserClient.prototype.updateGroupList = function (userName, grouplist, token) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = util_1.Util.fixUrl(this.cluster.rest_server_uri + "/api/v2/user/" + userName + "/grouplist");
                        if (!(token === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, _super.prototype.token.call(this)];
                    case 1:
                        token = _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.sendPutRequestWithToken(url, { grouplist: grouplist }, token)];
                    case 3:
                        res = _a.sent();
                        return [2 /*return*/, JSON.parse(res)];
                }
            });
        });
    };
    /**
     * Add group into user's group list.
     * @param userName The user name.
     * @param groupname The new groupname in [A-Za-z0-9_]+ format.
     * @param token Specific an access token (optional).
     */
    UserClient.prototype.addGroup = function (userName, groupname, token) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = util_1.Util.fixUrl(this.cluster.rest_server_uri + "/api/v2/user/" + userName + "/group");
                        if (!(token === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, _super.prototype.token.call(this)];
                    case 1:
                        token = _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.sendPutRequestWithToken(url, { groupname: groupname }, token)];
                    case 3:
                        res = _a.sent();
                        return [2 /*return*/, JSON.parse(res)];
                }
            });
        });
    };
    /**
     * Remove group from user's group list.
     * @param userName The user name.
     * @param groupname The groupname in [A-Za-z0-9_]+ format.
     * @param token Specific an access token (optional).
     */
    UserClient.prototype.removeGroup = function (userName, groupname, token) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = util_1.Util.fixUrl(this.cluster.rest_server_uri + "/api/v2/user/" + userName + "/group");
                        if (!(token === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, _super.prototype.token.call(this)];
                    case 1:
                        token = _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, request["delete"](url, {
                            body: JSON.stringify({ groupname: groupname }),
                            headers: {
                                Authorization: "Bearer " + token,
                                'Content-Type': 'application/json'
                            }
                        })];
                    case 3:
                        res = _a.sent();
                        return [2 /*return*/, JSON.parse(res)];
                }
            });
        });
    };
    UserClient.prototype.sendPutRequestWithToken = function (url, body, token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request.put(url, {
                            body: JSON.stringify(body),
                            headers: {
                                Authorization: "Bearer " + token,
                                'Content-Type': 'application/json'
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return UserClient;
}(baseClient_1.OpenPAIBaseClient));
exports.UserClient = UserClient;

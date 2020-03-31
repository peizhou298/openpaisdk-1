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
 * OpenPAI Authn client.
 */
var AuthnClient = /** @class */ (function (_super) {
    __extends(AuthnClient, _super);
    function AuthnClient(cluster) {
        return _super.call(this, cluster) || this;
    }
    /**
     * Get authn information.
     */
    AuthnClient.prototype.info = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        url = util_1.Util.fixUrl(this.cluster.rest_server_uri + "/api/v1/authn/info");
                        if (!(this.authnInfo === undefined)) return [3 /*break*/, 2];
                        _a = this;
                        _c = (_b = JSON).parse;
                        return [4 /*yield*/, request.get(url)];
                    case 1:
                        _a.authnInfo = _c.apply(_b, [_d.sent()]);
                        _d.label = 2;
                    case 2: return [2 /*return*/, this.authnInfo];
                }
            });
        });
    };
    /**
     * OpenID Connect login.
     */
    AuthnClient.prototype.oidcLogin = function (queryString) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = queryString ?
                            util_1.Util.fixUrl(this.cluster.rest_server_uri + "/api/v1/authn/oidc/login?" + queryString) :
                            util_1.Util.fixUrl(this.cluster.rest_server_uri + "/api/v1/authn/oidc/login");
                        return [4 /*yield*/, request.get(url)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    /**
     * OpenID Connect logout.
     */
    AuthnClient.prototype.oidcLogout = function (queryString) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = queryString ?
                            util_1.Util.fixUrl(this.cluster.rest_server_uri + "/api/v1/authn/oidc/logout?" + queryString) :
                            util_1.Util.fixUrl(this.cluster.rest_server_uri + "/api/v1/authn/oidc/logout");
                        return [4 /*yield*/, request.get(url)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    /**
     * Get list of available tokens (portal token + application token).
     */
    AuthnClient.prototype.getTokens = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = util_1.Util.fixUrl(this.cluster.rest_server_uri + "/api/v1/token");
                        if (!(token === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, _super.prototype.token.call(this)];
                    case 1:
                        token = _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, request.get(url, {
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
     * Create an application access token.
     */
    AuthnClient.prototype.createApplicationToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = util_1.Util.fixUrl(this.cluster.rest_server_uri + "/api/v1/token/application");
                        if (!(token === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, _super.prototype.token.call(this)];
                    case 1:
                        token = _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, request.post(url, {
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
     * Revoke a token.
     */
    AuthnClient.prototype.deleteToken = function (deleteToken, accessToken) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = util_1.Util.fixUrl(this.cluster.rest_server_uri + "/api/v1/token/" + deleteToken);
                        if (!(accessToken === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, _super.prototype.token.call(this)];
                    case 1:
                        accessToken = _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, request["delete"](url, {
                            headers: {
                                Authorization: "Bearer " + accessToken,
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
    return AuthnClient;
}(baseClient_1.OpenPAIBaseClient));
exports.AuthnClient = AuthnClient;

"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
exports.__esModule = true;
/**
 * Utility class.
 */
var UtilClass = /** @class */ (function () {
    function UtilClass() {
        this.https = false;
        this.debugMode = false;
    }
    UtilClass.prototype.fixUrl = function (url, https) {
        if (!/^[a-zA-Z]+?\:\/\//.test(url)) {
            url = "http" + (https ? 's' : '') + "://" + url;
        }
        return url;
    };
    UtilClass.prototype.expandUser = function (url) {
        if (/~/.test(url)) {
            var home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
            if (home) {
                url = url.replace('~', home);
            }
            else {
                throw new Error("could not resolve ~ for " + url);
            }
        }
        return url;
    };
    UtilClass.prototype.debug = function (msg, obj) {
        if (!this.debugMode) {
            return;
        }
        if (msg) {
            console.debug(msg);
        }
        if (obj) {
            console.debug(obj);
        }
    };
    return UtilClass;
}());
exports.Util = new UtilClass();

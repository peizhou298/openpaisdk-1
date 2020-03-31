"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
exports.__esModule = true;
/**
 * the container for identifiable objects(:T) with unique ID (:U)
 */
var Identifiable = /** @class */ (function () {
    function Identifiable(data) {
        var _this = this;
        this.data = [];
        this.getData = function () { return _this.data; };
        if (data) {
            this.data = data;
        }
    }
    Identifiable.prototype.copyData = function (data) {
        this.data = JSON.parse(JSON.stringify(data));
    };
    Identifiable.prototype.assignData = function (data) {
        Object.assign(this.data, data);
    };
    Identifiable.prototype.identities = function () {
        var _this = this;
        return this.data.map(function (a) {
            return _this.uidOf(a);
        });
    };
    Identifiable.prototype.indexOf = function (uid) {
        return this.identities().indexOf(uid);
    };
    Identifiable.prototype.add = function (element, denyIfExists) {
        if (denyIfExists === void 0) { denyIfExists = false; }
        var uid = this.uidOf(element);
        if (uid == null) {
            throw new Error("UnIdentifiable");
        }
        var idx = this.indexOf(uid);
        if (denyIfExists && idx > -1) {
            throw new Error("AlreadyExists: of " + this.uidOf(element));
        }
        if (idx === -1) {
            this.data.push(element);
        }
        else {
            this.data[idx] = element;
        }
    };
    Identifiable.prototype.remove = function (uid) {
        var idx = this.indexOf(uid);
        if (idx > -1) {
            this.data.splice(idx, 1);
        }
    };
    Identifiable.prototype.uidEq = function (element, uid) {
        return this.uidOf(element) === uid;
    };
    return Identifiable;
}());
exports.Identifiable = Identifiable;

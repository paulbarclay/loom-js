"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tape_1 = __importDefault(require("tape"));
var ws_rpc_client_1 = require("../../internal/ws-rpc-client");
var json_rpc_client_1 = require("../../internal/json-rpc-client");
var helpers_1 = require("../helpers");
var dual_rpc_client_1 = require("../../internal/dual-rpc-client");
function closeSocket(client) {
    ;
    client._client.close(3000);
}
function ensureSubscriptionAsync(client) {
    if (client.isSubscribed) {
        return Promise.resolve();
    }
    return new Promise(function (resolve, reject) {
        var timeout = setTimeout(function () { return reject(new Error('Timeout waiting for subscription')); }, client.requestTimeout);
        client.once(json_rpc_client_1.RPCClientEvent.Subscribed, function (url, isSubscribed) {
            clearTimeout(timeout);
            if (isSubscribed) {
                resolve();
            }
            else {
                reject(new Error('Subscription inactive'));
            }
        });
    });
}
function ensureUnsubscriptionAsync(client) {
    if (!client.isSubscribed) {
        return Promise.resolve();
    }
    return new Promise(function (resolve, reject) {
        var timeout = setTimeout(function () { return reject(new Error('Timeout waiting for unsubscription')); }, client.requestTimeout);
        client.once(json_rpc_client_1.RPCClientEvent.Subscribed, function (url, isSubscribed) {
            clearTimeout(timeout);
            if (!isSubscribed) {
                resolve();
            }
            else {
                reject(new Error('Subscription active'));
            }
        });
    });
}
function testClientOnlyMaintainsEventSubscriptionWhenListenersExist(t, client) {
    return __awaiter(this, void 0, void 0, function () {
        var listener;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client.on(json_rpc_client_1.RPCClientEvent.Error, function (url, err) {
                        t.error(err);
                    });
                    return [4 /*yield*/, client.ensureConnectionAsync()];
                case 1:
                    _a.sent();
                    listener = function () { };
                    client.on(json_rpc_client_1.RPCClientEvent.Message, listener);
                    return [4 /*yield*/, ensureSubscriptionAsync(client)];
                case 2:
                    _a.sent();
                    t.ok(client.isSubscribed, 'Should auto-subscribe to DAppChain events');
                    client.removeListener(json_rpc_client_1.RPCClientEvent.Message, listener);
                    return [4 /*yield*/, ensureUnsubscriptionAsync(client)];
                case 3:
                    _a.sent();
                    t.ok(!client.isSubscribed, 'Should auto-unsubscribe from DAppChain events');
                    return [2 /*return*/];
            }
        });
    });
}
function testClientReestablishedEventSubscriptionAfterReconnect(t, client) {
    return __awaiter(this, void 0, void 0, function () {
        var listener;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client.on(json_rpc_client_1.RPCClientEvent.Error, function (url, err) {
                        t.error(err);
                    });
                    return [4 /*yield*/, client.ensureConnectionAsync()];
                case 1:
                    _a.sent();
                    listener = function () { };
                    client.on(json_rpc_client_1.RPCClientEvent.Message, listener);
                    return [4 /*yield*/, ensureSubscriptionAsync(client)];
                case 2:
                    _a.sent();
                    closeSocket(client);
                    return [4 /*yield*/, ensureUnsubscriptionAsync(client)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, client.ensureConnectionAsync()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, ensureSubscriptionAsync(client)];
                case 5:
                    _a.sent();
                    t.ok(client.isSubscribed, 'Should auto-subscribe to DAppChain events after reconnect');
                    return [2 /*return*/];
            }
        });
    });
}
tape_1.default('WSRPCClient', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var client, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                client = null;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                client = new ws_rpc_client_1.WSRPCClient(helpers_1.getTestUrls().wsReadUrl, { requestTimeout: 1000 });
                return [4 /*yield*/, testClientOnlyMaintainsEventSubscriptionWhenListenersExist(t, client)];
            case 2:
                _a.sent();
                client.disconnect();
                client = new ws_rpc_client_1.WSRPCClient(helpers_1.getTestUrls().wsReadUrl, {
                    requestTimeout: 2000,
                    reconnectInterval: 100
                });
                return [4 /*yield*/, testClientReestablishedEventSubscriptionAfterReconnect(t, client)];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                t.fail(err_1);
                return [3 /*break*/, 5];
            case 5:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('DualRPCClient', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var client, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                client = null;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                client = new dual_rpc_client_1.DualRPCClient({
                    httpUrl: helpers_1.getTestUrls().httpReadUrl,
                    wsUrl: helpers_1.getTestUrls().wsReadUrl,
                    requestTimeout: 1000
                });
                return [4 /*yield*/, testClientOnlyMaintainsEventSubscriptionWhenListenersExist(t, client)];
            case 2:
                _a.sent();
                client.disconnect();
                client = new dual_rpc_client_1.DualRPCClient({
                    httpUrl: helpers_1.getTestUrls().httpReadUrl,
                    wsUrl: helpers_1.getTestUrls().wsReadUrl,
                    requestTimeout: 2000,
                    reconnectInterval: 100
                });
                return [4 /*yield*/, testClientReestablishedEventSubscriptionAfterReconnect(t, client)];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_2 = _a.sent();
                t.fail(err_2);
                return [3 /*break*/, 5];
            case 5:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=ws-rpc-client-tests.js.map
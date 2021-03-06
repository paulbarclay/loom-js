"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var json_rpc_client_1 = require("./internal/json-rpc-client");
var ws_rpc_client_1 = require("./internal/ws-rpc-client");
var http_rpc_client_1 = require("./internal/http-rpc-client");
var dual_rpc_client_1 = require("./internal/dual-rpc-client");
/**
 * Creates an RPC client for communicating with a Loom DAppChain based on the specified options.
 * @param opts Options object
 * @param opts.protocols
 * @param opts.autoConnect If `true` the client will automatically connect after being created,
 *                         defaults to `true` and shouldn't be changed.
 * @param opts.requestTimeout Maximum number of milliseconds the client should wait for a request
 *                            to receive a response.
 * @param opts.generateRequestId Can be set to override the default JSON-RPC message ID generator.
 */
function createJSONRPCClient(opts) {
    var protocols = opts.protocols, _a = opts.autoConnect, autoConnect = _a === void 0 ? true : _a, requestTimeout = opts.requestTimeout, generateRequestId = opts.generateRequestId;
    if (protocols.length === 1) {
        var _b = protocols[0], url = _b.url, otherOpts = __rest(_b, ["url"]);
        var protocol = selectProtocol(url);
        if (protocol === json_rpc_client_1.JSONRPCProtocol.HTTP) {
            return new http_rpc_client_1.HTTPRPCClient(url, { requestTimeout: requestTimeout, generateRequestId: generateRequestId });
        }
        else if (protocol === json_rpc_client_1.JSONRPCProtocol.WS) {
            return new ws_rpc_client_1.WSRPCClient(url, __assign({ autoConnect: autoConnect, requestTimeout: requestTimeout, generateRequestId: generateRequestId }, otherOpts));
        }
    }
    else if (protocols.length === 2) {
        var p1 = selectProtocol(protocols[0].url);
        var p2 = selectProtocol(protocols[1].url);
        if (p1 === json_rpc_client_1.JSONRPCProtocol.HTTP && p2 === json_rpc_client_1.JSONRPCProtocol.WS) {
            var _c = protocols[1], reconnectInterval = _c.reconnectInterval, maxReconnects = _c.maxReconnects;
            return new dual_rpc_client_1.DualRPCClient({
                httpUrl: protocols[0].url,
                wsUrl: protocols[1].url,
                autoConnect: autoConnect,
                protocol: p1,
                requestTimeout: requestTimeout,
                generateRequestId: generateRequestId,
                reconnectInterval: reconnectInterval,
                maxReconnects: maxReconnects
            });
        }
        else if (p2 === json_rpc_client_1.JSONRPCProtocol.HTTP && p1 === json_rpc_client_1.JSONRPCProtocol.WS) {
            var _d = protocols[0], reconnectInterval = _d.reconnectInterval, maxReconnects = _d.maxReconnects;
            return new dual_rpc_client_1.DualRPCClient({
                httpUrl: protocols[1].url,
                wsUrl: protocols[0].url,
                autoConnect: autoConnect,
                protocol: p1,
                requestTimeout: requestTimeout,
                generateRequestId: generateRequestId,
                reconnectInterval: reconnectInterval,
                maxReconnects: maxReconnects
            });
        }
    }
    throw new Error('Failed to create JSON-RPC client: invalid protocol configuration');
}
exports.createJSONRPCClient = createJSONRPCClient;
function selectProtocol(url) {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return json_rpc_client_1.JSONRPCProtocol.HTTP;
    }
    else if (url.startsWith('ws://') || url.startsWith('wss://')) {
        return json_rpc_client_1.JSONRPCProtocol.WS;
    }
    else {
        throw new Error('Invalid URL');
    }
}
//# sourceMappingURL=rpc-client-factory.js.map
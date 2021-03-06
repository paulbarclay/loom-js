"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var events_1 = __importDefault(require("events"));
var debug_1 = __importDefault(require("debug"));
var log = debug_1.default('http-rpc-client');
/**
 * Sends JSON-RPC messages via HTTP.
 * Doesn't support listening to DAppChain events at the moment.
 */
var HTTPRPCClient = /** @class */ (function (_super) {
    __extends(HTTPRPCClient, _super);
    /**
     *
     * @param url
     * @param opts Options object
     * @param opts.requestTimeout Number of milliseconds to wait for a network operation to complete.
     */
    function HTTPRPCClient(url, opts) {
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this) || this;
        _this.url = url;
        _this._rpcId = 0;
        _this._getNextRequestId = function () { return (++_this._rpcId).toString(); };
        var _a = opts.requestTimeout, requestTimeout = _a === void 0 ? 15000 : _a, // 15s
        _b = opts.generateRequestId, // 15s
        generateRequestId = _b === void 0 ? _this._getNextRequestId : _b;
        _this.requestTimeout = requestTimeout;
        return _this;
    }
    Object.defineProperty(HTTPRPCClient.prototype, "isSubscribed", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    HTTPRPCClient.prototype.disconnect = function () {
        // no persistent connection, so do nothing
    };
    HTTPRPCClient.prototype.ensureConnectionAsync = function () {
        // no persistent connection, so do nothing
        return Promise.resolve();
    };
    /**
     * Sends a JSON-RPC message.
     * @param method RPC method name.
     * @param params Parameter object or array.
     * @returns A promise that will be resolved with the value of the result field (if any) in the
     *          JSON-RPC response message.
     */
    HTTPRPCClient.prototype.sendAsync = function (method, params) {
        return __awaiter(this, void 0, void 0, function () {
            var req, resp, _a, code, message, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        log("Sending RPC msg to " + this.url + ", method " + method);
                        req = {
                            jsonrpc: '2.0',
                            method: method,
                            params: params,
                            id: this._getNextRequestId()
                        };
                        return [4 /*yield*/, axios_1.default.post(this.url, req, {
                                timeout: this.requestTimeout
                            })];
                    case 1:
                        resp = _b.sent();
                        if (resp.data.error) {
                            _a = resp.data.error, code = _a.code, message = _a.message, data = _a.data;
                            throw new Error("JSON-RPC Error " + code + " (" + message + "): " + data);
                        }
                        return [2 /*return*/, resp.data.result];
                }
            });
        });
    };
    return HTTPRPCClient;
}(events_1.default));
exports.HTTPRPCClient = HTTPRPCClient;
//# sourceMappingURL=http-rpc-client.js.map
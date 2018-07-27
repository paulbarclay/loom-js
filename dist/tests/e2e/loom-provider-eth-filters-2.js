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
var index_1 = require("../../index");
var helpers_1 = require("../helpers");
var loom_provider_1 = require("../../loom-provider");
tape_1.default('LoomProvider + Filters 2', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var privKey, client, loomProvider, ethNewBlockFilter, ethGetFilterChanges, ethGetBlockByHash, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                privKey = index_1.CryptoUtils.generatePrivateKey();
                client = helpers_1.createTestClient(privKey);
                client.on('error', function (msg) { return console.error('Error on client:', msg); });
                loomProvider = new loom_provider_1.LoomProvider(client, privKey);
                return [4 /*yield*/, loomProvider.sendAsync({
                        id: 11,
                        method: 'eth_newBlockFilter'
                    })];
            case 1:
                ethNewBlockFilter = _a.sent();
                t.assert(/0x.+/.test(ethNewBlockFilter.result), 'New id should be created for new block filter');
                return [4 /*yield*/, helpers_1.waitForMillisecondsAsync(1000)];
            case 2:
                _a.sent();
                return [4 /*yield*/, loomProvider.sendAsync({
                        id: 12,
                        method: 'eth_getFilterChanges',
                        params: [ethNewBlockFilter.result]
                    })];
            case 3:
                ethGetFilterChanges = _a.sent();
                t.assert(ethGetFilterChanges.result.length > 0, 'Should return the hash for a new block created');
                console.log('Hash for the latest block is:', ethGetFilterChanges.result);
                return [4 /*yield*/, loomProvider.sendAsync({
                        id: 13,
                        method: 'eth_getBlockByHash',
                        params: [ethGetFilterChanges.result[0], true]
                    })];
            case 4:
                ethGetBlockByHash = _a.sent();
                t.assert(ethGetBlockByHash.result, 'Should return the block requested by hash');
                client.disconnect();
                return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                console.log(err_1);
                return [3 /*break*/, 6];
            case 6:
                t.end();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=loom-provider-eth-filters-2.js.map
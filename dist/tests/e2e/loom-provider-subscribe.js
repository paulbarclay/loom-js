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
var evm_helpers_1 = require("../evm-helpers");
/**
 * Requires the SimpleStore solidity contract deployed on a loomchain.
 * go-loom/examples/plugins/evmexample/contract/SimpleStore.sol
 *
 * pragma solidity ^0.4.22;
 *
 * contract SimpleStore {
 *   uint value;
 *
 *   constructor() {
 *       value = 10;
 *   }
 *
 *   event NewValueSet(uint _value);
 *
 *   function set(uint _value) public {
 *     value = _value;
 *     emit NewValueSet(value);
 *   }
 *
 *   function get() public view returns (uint) {
 *     return value;
 *   }
 * }
 *
 */
var contractData = '608060405234801561001057600080fd5b50600a600081905550610114806100286000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c14606c575b600080fd5b606a600480360381019080803590602001909291905050506094565b005b348015607757600080fd5b50607e60df565b6040518082815260200191505060405180910390f35b806000819055507f2afa03c814297ffc234ff967b6f0863d3c358be243103f20217c8d3a4d39f9c060005434604051808381526020018281526020019250505060405180910390a150565b600080549050905600a165627a7a72305820deed812a797567167162d0af3ae5f0528c39bea0620e32b28e243628cd655dc40029';
tape_1.default('LoomProvider + Subscribe', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var privKey, client, fromAddr, loomProvider, contractDeployResult, id, ethSubscribeNewHardsResult, ethUnsubscribeNewHeadsResult, ethSubscribeLogsResult, ethUnsubscribeLogsResult, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                privKey = index_1.CryptoUtils.generatePrivateKey();
                client = helpers_1.createTestClient(privKey);
                client.on('error', function (msg) { return console.error('Error on client:', msg); });
                fromAddr = index_1.LocalAddress.fromPublicKey(index_1.CryptoUtils.publicKeyFromPrivateKey(privKey)).toString();
                loomProvider = new loom_provider_1.LoomProvider(client, privKey);
                return [4 /*yield*/, evm_helpers_1.deployContract(loomProvider, contractData)];
            case 1:
                contractDeployResult = _a.sent();
                id = 1;
                return [4 /*yield*/, loomProvider.sendAsync({
                        id: id,
                        method: 'eth_subscribe',
                        params: ['newHeads', {}]
                    })];
            case 2:
                ethSubscribeNewHardsResult = _a.sent();
                t.equal(ethSubscribeNewHardsResult.id, id, "Id for eth_subscribe should be equal " + id);
                t.assert(/0x.+/.test(ethSubscribeNewHardsResult.result), 'Filter identification should be returned on eth_subscribe');
                return [4 /*yield*/, loomProvider.sendAsync({
                        id: id,
                        method: 'eth_unsubscribe',
                        params: [ethSubscribeNewHardsResult.result]
                    })];
            case 3:
                ethUnsubscribeNewHeadsResult = _a.sent();
                t.equal(ethUnsubscribeNewHeadsResult.id, id, "Id for eth_unsubscribe should be equal " + id);
                t.assert(ethUnsubscribeNewHeadsResult.result, 'Unsubscribed for newHeads');
                return [4 /*yield*/, loomProvider.sendAsync({
                        id: id,
                        method: 'eth_subscribe',
                        params: ['logs', {}]
                    })];
            case 4:
                ethSubscribeLogsResult = _a.sent();
                t.equal(ethSubscribeLogsResult.id, id, "Id for eth_subscribe should be equal " + id);
                t.assert(/0x.+/.test(ethSubscribeLogsResult.result), 'Filter identification should be returned on eth_subscribe');
                return [4 /*yield*/, loomProvider.sendAsync({
                        id: id,
                        method: 'eth_unsubscribe',
                        params: [ethSubscribeLogsResult.result]
                    })];
            case 5:
                ethUnsubscribeLogsResult = _a.sent();
                t.equal(ethUnsubscribeLogsResult.id, id, "Id for eth_unsubscribe should be equal " + id);
                t.assert(ethUnsubscribeLogsResult.result, 'Unsubscribed for Logs');
                client.disconnect();
                return [3 /*break*/, 7];
            case 6:
                err_1 = _a.sent();
                console.log(err_1);
                return [3 /*break*/, 7];
            case 7:
                t.end();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=loom-provider-subscribe.js.map
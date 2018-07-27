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
var loom_pb_1 = require("../../proto/loom_pb");
var loom_provider_1 = require("../../loom-provider");
var evm_helpers_1 = require("../evm-helpers");
var crypto_utils_1 = require("../../crypto-utils");
var address_1 = require("../../address");
/**
 * Requires the SimpleStore solidity contract deployed on a loomchain.
 * go-loom/examples/plugins/evmexample/contract/SimpleStore.sol
 *
 * pragma solidity ^0.4.22;
 *
 * contract SimpleStore {
 *   uint value;
 *   constructor() public {
 *       value = 10;
 *   }
 *
 *   event NewValueSet(uint indexed _value);
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
 *
 */
tape_1.default('Client EVM Event test', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var privateKey, publicKey, client, loomProvider, contractData, result, filter, filterCreated, caller, address, data, callTx, msgTx, tx, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                console.log("start");
                privateKey = index_1.CryptoUtils.generatePrivateKey();
                publicKey = index_1.CryptoUtils.publicKeyFromPrivateKey(privateKey);
                client = helpers_1.createTestClient(privateKey);
                loomProvider = new loom_provider_1.LoomProvider(client, privateKey);
                contractData = '0x608060405234801561001057600080fd5b50600a60008190555061010e806100286000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60d9565b6040518082815260200191505060405180910390f35b806000819055506000547fb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b60405160405180910390a250565b600080549050905600a165627a7a72305820b76f6c855a1f95260fc70490b16774074225da52ea165a58e95eb7a72a59d1700029';
                return [4 /*yield*/, evm_helpers_1.deployContract(loomProvider, contractData)
                    // Middleware used for client
                ];
            case 1:
                result = _a.sent();
                // Middleware used for client
                client.txMiddleware = [
                    new index_1.NonceTxMiddleware(client),
                    new index_1.SignedTxMiddleware(client)
                ];
                filter = {
                    topics: [
                        '0xb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b',
                        [
                            '0x0000000000000000000000000000000000000000000000000000000000000001',
                            '0x0000000000000000000000000000000000000000000000000000000000000002',
                            '0x0000000000000000000000000000000000000000000000000000000000000003',
                            '0x0000000000000000000000000000000000000000000000000000000000000004',
                            '0x0000000000000000000000000000000000000000000000000000000000000005'
                        ]
                    ],
                    address: result.contractAddress
                };
                return [4 /*yield*/, client.evmSubscribeAsync('logs', filter)];
            case 2:
                filterCreated = _a.sent();
                console.log('Filter created', filterCreated);
                caller = new address_1.Address('default', address_1.LocalAddress.fromPublicKey(publicKey));
                address = new address_1.Address('default', address_1.LocalAddress.fromHexString(result.contractAddress));
                data = Buffer.from('60fe47b10000000000000000000000000000000000000000000000000000000000000005', 'hex');
                callTx = new loom_pb_1.CallTx();
                callTx.setVmType(loom_pb_1.VMType.EVM);
                callTx.setInput(crypto_utils_1.bufferToProtobufBytes(data));
                msgTx = new loom_pb_1.MessageTx();
                msgTx.setFrom(caller.MarshalPB());
                msgTx.setTo(address.MarshalPB());
                msgTx.setData(callTx.serializeBinary());
                tx = new loom_pb_1.Transaction();
                tx.setId(2);
                tx.setData(msgTx.serializeBinary());
                return [4 /*yield*/, client.commitTxAsync(caller.local.toString(), tx)];
            case 3:
                _a.sent();
                helpers_1.waitForMillisecondsAsync(2000);
                client.disconnect();
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                console.error(err_1);
                t.fail(err_1.message);
                return [3 /*break*/, 5];
            case 5:
                t.end();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=client-evm-event-tests.js.map
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
 * pragma solidity ^0.4.18;
 * contract SimpleStore {
 *  function set(uint _value) public {
 *   value = _value;
 *  }
 * function get() public constant returns (uint) {
 *   return value;
 * }
 *  uint value;
 * }
 *
 */
tape_1.default('LoomProvider', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var privKey, client, fromAddr, loomProvider, contractData, result, contractAddress, id, netVersionResult, ethAccountsResult, ethNewBlockFilterResult, ethBlockNumber, ethNewBlockByNumberResult, ethNewBlockByNumberResultLatest, ethSendTransactionResult, contractDataToDeploy, ethSendTransactionDeployResult, ethGetCodeResult, ethCallResult, ethGetTransactionReceiptResult, ethGetTransactionByHashResult, ethSubscribeResult, ethUninstallFilter, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 16, , 17]);
                privKey = index_1.CryptoUtils.generatePrivateKey();
                client = helpers_1.createTestClient(privKey);
                fromAddr = index_1.LocalAddress.fromPublicKey(index_1.CryptoUtils.publicKeyFromPrivateKey(privKey)).toString();
                loomProvider = new loom_provider_1.LoomProvider(client, privKey);
                contractData = '608060405234801561001057600080fd5b50600a600081905550610118806100286000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60e3565b6040518082815260200191505060405180910390f35b806000819055507fb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b6000546040518082815260200191505060405180910390a150565b600080549050905600a165627a7a72305820fabe42649c29e53c4b9fad19100d72a1e825603058e1678432a76f94a10d352a0029';
                return [4 /*yield*/, evm_helpers_1.deployContract(loomProvider, contractData)];
            case 1:
                result = _a.sent();
                contractAddress = result.contractAddress;
                client.on('error', function (msg) { return console.error('Error on client:', msg); });
                id = 1;
                return [4 /*yield*/, loomProvider.sendAsync({
                        id: id,
                        method: 'net_version'
                    })];
            case 2:
                netVersionResult = _a.sent();
                t.deepEqual(netVersionResult, { id: 1, jsonrpc: '2.0', result: '474747' }, 'net_version should be 474747');
                return [4 /*yield*/, loomProvider.sendAsync({
                        id: id,
                        method: 'eth_accounts'
                    })];
            case 3:
                ethAccountsResult = _a.sent();
                t.deepEqual(ethAccountsResult, {
                    id: 1,
                    jsonrpc: '2.0',
                    result: [fromAddr]
                }, 'accounts should be available on eth_accounts command');
                return [4 /*yield*/, loomProvider.sendAsync({
                        id: id,
                        method: 'eth_newBlockFilter'
                    })];
            case 4:
                ethNewBlockFilterResult = _a.sent();
                t.equal(ethNewBlockFilterResult.id, id, "Id for eth_newBlockFilter should be equal " + id);
                t.assert(/0x.+/.test(ethNewBlockFilterResult.result), 'Hex identification should be returned on eth_newBlockFilter');
                return [4 /*yield*/, loomProvider.sendAsync({
                        id: id,
                        method: 'eth_blockNumber'
                    })];
            case 5:
                ethBlockNumber = _a.sent();
                t.equal(ethBlockNumber.id, id, "Id for eth_blockNumber should be equal " + id);
                t.assert(/0x.+/.test(ethBlockNumber.result), 'Number identification should be returned on ethBlockNumber');
                return [4 /*yield*/, loomProvider.sendAsync({
                        id: id,
                        method: 'eth_getBlockByNumber',
                        params: ["" + index_1.CryptoUtils.hexToNumber(ethBlockNumber.result)]
                    })];
            case 6:
                ethNewBlockByNumberResult = _a.sent();
                t.equal(ethNewBlockFilterResult.id, id, "Id for eth_getBlockByNumber should be equal " + id);
                t.assert(ethNewBlockByNumberResult.result, 'Block should be returned from eth_getBlockByNumber');
                return [4 /*yield*/, loomProvider.sendAsync({
                        id: id,
                        method: 'eth_getBlockByNumber',
                        params: ['latest', false]
                    })];
            case 7:
                ethNewBlockByNumberResultLatest = _a.sent();
                t.equal(ethNewBlockByNumberResultLatest.id, id, "Id for eth_getBlockByNumber should be equal " + id);
                t.assert(ethNewBlockByNumberResultLatest.result, 'Block should be returned from eth_getBlockByNumber');
                return [4 /*yield*/, loomProvider.sendAsync({
                        id: id,
                        method: 'eth_sendTransaction',
                        params: [
                            {
                                to: contractAddress,
                                from: fromAddr,
                                data: '0x60fe47b10000000000000000000000000000000000000000000000000000000000000001',
                                gas: '0x0',
                                gasPrice: '0x0',
                                value: '0x0'
                            }
                        ]
                    })];
            case 8:
                ethSendTransactionResult = _a.sent();
                t.equal(ethSendTransactionResult.id, id, "Id for eth_sendTransaction should be equal " + id);
                t.assert(/0x.+/.test(ethSendTransactionResult.result), 'Hex identification should be returned for eth_sendTransaction command (contract transaction)');
                contractDataToDeploy = '0x608060405234801561001057600080fd5b50610189806100206000396000f30060806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b1146100515780636d4ce63c14610071575b600080fd5b61006f600480360381019080803590602001909291905050506100cf565b005b34801561007d57600080fd5b5061008661014e565b604051808381526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390f35b806000819055507fc403d054f8d8a57caac9df16a22fc80b97825c521da8eea2943d6d04ba3bab806000543334604051808481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060405180910390a150565b600080600054339150915090915600a165627a7a72305820c6974a05d4e327d57387c8d04a8a5ff056569a4811a69e0de4c15d9ca9135bd70029';
                return [4 /*yield*/, loomProvider.sendAsync({
                        id: id,
                        method: 'eth_sendTransaction',
                        params: [
                            {
                                from: fromAddr,
                                data: contractDataToDeploy,
                                gas: '0x0',
                                gasPrice: '0x0',
                                value: '0x0'
                            }
                        ]
                    })];
            case 9:
                ethSendTransactionDeployResult = _a.sent();
                t.equal(ethSendTransactionDeployResult.id, id, "Id for eth_sendTransaction should be equal " + id);
                t.assert(/0x.+/.test(ethSendTransactionDeployResult.result), 'Hex identification should be returned for eth_sendTransaction command (deploy new contract)');
                return [4 /*yield*/, loomProvider.sendAsync({
                        id: id,
                        method: 'eth_getCode',
                        params: [contractAddress]
                    })];
            case 10:
                ethGetCodeResult = _a.sent();
                t.equal(ethGetCodeResult.id, id, "Id for eth_getCode should be equal " + id);
                t.assert(/0x.+/.test(ethSendTransactionDeployResult.result), 'Hex identification should be returned for eth_getCode command');
                return [4 /*yield*/, loomProvider.sendAsync({
                        id: id,
                        method: 'eth_call',
                        params: [
                            {
                                to: contractAddress,
                                from: fromAddr,
                                data: '0x6d4ce63c'
                            }
                        ]
                    })];
            case 11:
                ethCallResult = _a.sent();
                t.deepEqual(ethCallResult, {
                    id: id,
                    jsonrpc: '2.0',
                    result: '0x0000000000000000000000000000000000000000000000000000000000000001'
                }, 'Return from eth_call should be 0x0000000000000000000000000000000000000000000000000000000000000001');
                return [4 /*yield*/, loomProvider.sendAsync({
                        id: id,
                        method: 'eth_getTransactionReceipt',
                        params: [ethSendTransactionResult.result]
                    })];
            case 12:
                ethGetTransactionReceiptResult = _a.sent();
                t.equal(ethGetTransactionReceiptResult.result.status, '0x1', 'Status for eth_getTransactionReceipt should be 0x1');
                return [4 /*yield*/, loomProvider.sendAsync({
                        id: id,
                        method: 'eth_getTransactionByHash',
                        params: [ethSendTransactionResult.result]
                    })];
            case 13:
                ethGetTransactionByHashResult = _a.sent();
                t.equal(ethGetTransactionByHashResult.id, id, "Id for eth_subscribe should be equal " + id);
                t.assert(/0x.+/.test(ethGetTransactionByHashResult.result.hash), 'Hex identification should be returned for eth_getTransactionByHash command');
                return [4 /*yield*/, loomProvider.sendAsync({
                        id: id,
                        method: 'eth_subscribe',
                        params: ['logs', { topics: ['0x1'] }]
                    })];
            case 14:
                ethSubscribeResult = _a.sent();
                t.equal(ethSubscribeResult.id, id, "Id for eth_subscribe should be equal " + id);
                t.assert(/0x.+/.test(ethSubscribeResult.result), 'Hex identification should be returned for eth_subscribe command');
                return [4 /*yield*/, loomProvider.sendAsync({
                        id: id,
                        method: 'eth_uninstallFilter',
                        params: ['0x1']
                    })];
            case 15:
                ethUninstallFilter = _a.sent();
                t.equal(ethUninstallFilter.id, id, "Id for eth_subscribe should be equal " + id);
                t.equal(ethUninstallFilter.result, true, 'Uninstall filter should return true');
                client.disconnect();
                return [3 /*break*/, 17];
            case 16:
                err_1 = _a.sent();
                console.log(err_1);
                return [3 /*break*/, 17];
            case 17:
                t.end();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=loom-provider-tests.js.map
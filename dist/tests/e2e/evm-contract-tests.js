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
tape_1.default('EVM Contract Calls', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var privKey, pubKey, client, contractAddr, callerAddr, evmContract, inputSet987Array, inputGetArray, numRepeats, results, rtv, i, _i, results_1, result, receipt, staticCallRtv, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                privKey = index_1.CryptoUtils.generatePrivateKey();
                pubKey = index_1.CryptoUtils.publicKeyFromPrivateKey(privKey);
                client = helpers_1.createTestClient(privKey);
                client.txMiddleware = index_1.createDefaultTxMiddleware(client, privKey);
                return [4 /*yield*/, client.getContractAddressAsync('SimpleStore')];
            case 1:
                contractAddr = _a.sent();
                if (!contractAddr) {
                    t.fail('Failed to resolve contract address');
                    return [2 /*return*/];
                }
                callerAddr = new index_1.Address(client.chainId, index_1.LocalAddress.fromPublicKey(pubKey));
                evmContract = new index_1.EvmContract({
                    contractAddr: contractAddr,
                    client: client
                });
                inputSet987Array = [
                    96,
                    254,
                    71,
                    177,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    3,
                    219
                ];
                inputGetArray = [109, 76, 230, 60];
                numRepeats = 10;
                results = [];
                rtv = void 0;
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < numRepeats)) return [3 /*break*/, 5];
                return [4 /*yield*/, evmContract.callAsync(client.caller, inputSet987Array)];
            case 3:
                rtv = _a.sent();
                if (rtv) {
                    for (_i = 0, results_1 = results; _i < results_1.length; _i++) {
                        result = results_1[_i];
                        t.notDeepEqual(result, rtv, 'A different tx hash sould be returned' + ' each time');
                    }
                    results.push(rtv);
                }
                else {
                    t.fail('Should return a tx hash, check loomchain is running');
                }
                _a.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 2];
            case 5:
                if (!rtv) return [3 /*break*/, 7];
                return [4 /*yield*/, client.getEvmTxReceiptAsync(rtv)];
            case 6:
                receipt = _a.sent();
                if (receipt) {
                    t.deepEqual(receipt.getContractAddress_asU8().slice(), contractAddr.local.bytes, 'Contract address should match');
                    t.equal(receipt.getStatus(), 1, 'Should return status 1 success');
                }
                else {
                    t.fail('getTxReceiptAsync should return a result');
                }
                _a.label = 7;
            case 7: return [4 /*yield*/, evmContract.staticCallAsync(client.caller, inputGetArray)];
            case 8:
                staticCallRtv = _a.sent();
                if (staticCallRtv) {
                    t.deepEqual(staticCallRtv, Buffer.from(inputSet987Array.slice(-32)), 'Query result must match the value previously set');
                }
                else {
                    t.fail('staticCallAsync should return a result');
                }
                client.disconnect();
                return [3 /*break*/, 10];
            case 9:
                err_1 = _a.sent();
                console.log(err_1);
                return [3 /*break*/, 10];
            case 10:
                t.end();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=evm-contract-tests.js.map
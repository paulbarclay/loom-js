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
var crypto_utils_1 = require("../../crypto-utils");
tape_1.default('Client EVM test (newBlockEvmFilterAsync)', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var privateKey, client, filterId, hash, blockList, block, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                privateKey = index_1.CryptoUtils.generatePrivateKey();
                client = helpers_1.createTestClient(privateKey);
                client.txMiddleware = [
                    new index_1.NonceTxMiddleware(client),
                    new index_1.SignedTxMiddleware(client)
                ];
                return [4 /*yield*/, client.newBlockEvmFilterAsync()];
            case 1:
                filterId = _a.sent();
                if (!filterId) {
                    t.fail('Filter Id cannot be null');
                }
                return [4 /*yield*/, helpers_1.waitForMillisecondsAsync(1000)
                    // calls getevmfilterchanges
                ];
            case 2:
                _a.sent();
                return [4 /*yield*/, client.getEvmFilterChangesAsync(filterId)];
            case 3:
                hash = _a.sent();
                if (!hash) {
                    t.fail('Block cannot be null');
                }
                blockList = hash.getEthBlockHashList();
                return [4 /*yield*/, client.getEvmBlockByHashAsync(crypto_utils_1.bytesToHexAddr(blockList[0]))];
            case 4:
                block = (_a.sent());
                if (!block) {
                    t.fail('Block cannot be null');
                }
                t.assert(block.getHash(), 'Block should have a hash');
                client.disconnect();
                return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                console.error(err_1);
                t.fail(err_1.message);
                return [3 /*break*/, 6];
            case 6:
                t.end();
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('Client EVM test (newPendingTransactionEvmFilterAsync)', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var privateKey, client, filterId, hash, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                privateKey = index_1.CryptoUtils.generatePrivateKey();
                client = helpers_1.createTestClient(privateKey);
                client.txMiddleware = [
                    new index_1.NonceTxMiddleware(client),
                    new index_1.SignedTxMiddleware(client)
                ];
                return [4 /*yield*/, client.newPendingTransactionEvmFilterAsync()];
            case 1:
                filterId = _a.sent();
                if (!filterId) {
                    t.fail('Filter Id cannot be null');
                }
                return [4 /*yield*/, helpers_1.waitForMillisecondsAsync(1000)
                    // calls getevmfilterchanges
                ];
            case 2:
                _a.sent();
                return [4 /*yield*/, client.getEvmFilterChangesAsync(filterId)];
            case 3:
                hash = _a.sent();
                if (!hash) {
                    t.fail('Transaction cannot be null');
                }
                client.disconnect();
                return [3 /*break*/, 5];
            case 4:
                err_2 = _a.sent();
                console.error(err_2);
                t.fail(err_2.message);
                return [3 /*break*/, 5];
            case 5:
                t.end();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=client-evm-tests.js.map
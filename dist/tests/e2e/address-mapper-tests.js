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
var solidity_helpers_1 = require("../../plasma-cash/solidity-helpers");
var Web3 = require('web3');
// TODO: Need a factory to create connection properly likes plasma-cash test
function getWeb3Connection() {
    return new Web3('http://127.0.0.1:8545');
}
function getClientAndContract(createClient) {
    return __awaiter(this, void 0, void 0, function () {
        var privKey, pubKey, client, addressMapper;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    privKey = index_1.CryptoUtils.generatePrivateKey();
                    pubKey = index_1.CryptoUtils.publicKeyFromPrivateKey(privKey);
                    client = createClient(privKey);
                    client.txMiddleware = index_1.createDefaultTxMiddleware(client, privKey);
                    return [4 /*yield*/, index_1.AddressMapper.createAsync(client, new index_1.Address(client.chainId, index_1.LocalAddress.fromPublicKey(pubKey)))];
                case 1:
                    addressMapper = _a.sent();
                    return [2 /*return*/, { client: client, addressMapper: addressMapper, pubKey: pubKey }];
            }
        });
    });
}
function testAddIdentity(t, createClient) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, client, addressMapper, pubKey, ethAddress, from, to, web3, web3Signer, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getClientAndContract(createClient)];
                case 1:
                    _a = _b.sent(), client = _a.client, addressMapper = _a.addressMapper, pubKey = _a.pubKey;
                    ethAddress = '0x80a4B6Da5143a59C538FBBb794Be260382B38F58';
                    from = new index_1.Address('eth', index_1.LocalAddress.fromHexString(ethAddress));
                    to = new index_1.Address(client.chainId, index_1.LocalAddress.fromPublicKey(pubKey));
                    web3 = getWeb3Connection();
                    web3Signer = new solidity_helpers_1.Web3Signer(web3, ethAddress);
                    return [4 /*yield*/, addressMapper.addIdentityMappingAsync(from, to, web3Signer)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, addressMapper.getMappingAsync(from)];
                case 3:
                    result = _b.sent();
                    t.assert(from.equals(result.from), 'Identity "from" correctly returned');
                    t.assert(to.equals(result.to), 'Identity "to" correctly returned');
                    client.disconnect();
                    return [2 /*return*/];
            }
        });
    });
}
tape_1.default('Address Mapper', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, testAddIdentity(t, helpers_1.createTestHttpClient)];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                t.fail(err_1);
                return [3 /*break*/, 3];
            case 3:
                t.end();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=address-mapper-tests.js.map
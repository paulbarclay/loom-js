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
var bn_js_1 = __importDefault(require("bn.js"));
var contract_1 = require("./contract");
var address_1 = require("./address");
var transfer_gateway_pb_1 = require("./proto/transfer_gateway_pb");
var big_uint_1 = require("./big-uint");
var crypto_utils_1 = require("./crypto-utils");
var TransferGateway = /** @class */ (function (_super) {
    __extends(TransferGateway, _super);
    function TransferGateway(params) {
        var _this = _super.call(this, params) || this;
        _this.on(contract_1.Contract.EVENT, function (event) {
            if (!event.topics || event.topics.length === 0) {
                return;
            }
            if (event.topics[0] === TransferGateway.tokenWithdrawalSignedEventTopic) {
                var tokenWithdrawalSigned = transfer_gateway_pb_1.TransferGatewayTokenWithdrawalSigned.deserializeBinary(crypto_utils_1.B64ToUint8Array(event.data));
                _this.emit(TransferGateway.EVENT_TOKEN_WITHDRAWAL, {
                    tokenOwner: address_1.Address.UmarshalPB(tokenWithdrawalSigned.getTokenOwner()),
                    tokenContract: address_1.Address.UmarshalPB(tokenWithdrawalSigned.getTokenContract()),
                    tokenKind: tokenWithdrawalSigned.getTokenKind(),
                    value: big_uint_1.unmarshalBigUIntPB(tokenWithdrawalSigned.getValue()),
                    sig: tokenWithdrawalSigned.getSig_asU8()
                });
            }
            if (event.topics[0] === TransferGateway.contractMappingConfirmedEventTopic) {
                var contractMappingConfirmed = transfer_gateway_pb_1.TransferGatewayContractMappingConfirmed.deserializeBinary(crypto_utils_1.B64ToUint8Array(event.data));
                _this.emit(TransferGateway.EVENT_CONTRACT_MAPPING_CONFIRMED, {
                    foreignContract: address_1.Address.UmarshalPB(contractMappingConfirmed.getForeignContract()),
                    localContract: address_1.Address.UmarshalPB(contractMappingConfirmed.getLocalContract())
                });
            }
        });
        return _this;
    }
    TransferGateway.createAsync = function (client, callerAddr) {
        return __awaiter(this, void 0, void 0, function () {
            var contractAddr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.getContractAddressAsync('gateway')];
                    case 1:
                        contractAddr = _a.sent();
                        if (!contractAddr) {
                            throw Error('Failed to resolve contract address for TransferGateway');
                        }
                        return [2 /*return*/, new TransferGateway({ contractAddr: contractAddr, callerAddr: callerAddr, client: client })];
                }
            });
        });
    };
    TransferGateway.prototype.addContractMappingAsync = function (params) {
        var caller = params.caller, foreignContract = params.foreignContract, localContract = params.localContract, foreignContractCreatorSig = params.foreignContractCreatorSig, foreignContractCreatorTxHash = params.foreignContractCreatorTxHash;
        var mappingContractRequest = new transfer_gateway_pb_1.TransferGatewayAddContractMappingRequest();
        mappingContractRequest.setForeignContract(foreignContract.MarshalPB());
        mappingContractRequest.setLocalContract(localContract.MarshalPB());
        mappingContractRequest.setForeignContractCreatorSig(foreignContractCreatorSig);
        mappingContractRequest.setForeignContractTxHash(foreignContractCreatorTxHash);
        return this.callAsync(caller, 'AddContractMapping', mappingContractRequest);
    };
    TransferGateway.prototype.withdrawERC721Async = function (caller, tokenId, tokenContract) {
        var tgWithdrawERC721Req = new transfer_gateway_pb_1.TransferGatewayWithdrawERC721Request();
        tgWithdrawERC721Req.setTokenId(big_uint_1.marshalBigUIntPB(tokenId));
        tgWithdrawERC721Req.setTokenContract(tokenContract.MarshalPB());
        return this.callAsync(caller, 'WithdrawERC721', tgWithdrawERC721Req);
    };
    TransferGateway.prototype.withdrawalReceiptAsync = function (owner) {
        return __awaiter(this, void 0, void 0, function () {
            var tgWithdrawReceiptReq, result, tgReceipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tgWithdrawReceiptReq = new transfer_gateway_pb_1.TransferGatewayWithdrawalReceiptRequest();
                        tgWithdrawReceiptReq.setOwner(owner.MarshalPB());
                        return [4 /*yield*/, this.staticCallAsync(owner, 'WithdrawalReceipt', tgWithdrawReceiptReq, new transfer_gateway_pb_1.TransferGatewayWithdrawalReceiptResponse())];
                    case 1:
                        result = _a.sent();
                        tgReceipt = result.getReceipt();
                        if (tgReceipt) {
                            return [2 /*return*/, {
                                    tokenOwner: address_1.Address.UmarshalPB(tgReceipt.getTokenOwner()),
                                    tokenContract: address_1.Address.UmarshalPB(tgReceipt.getTokenContract()),
                                    tokenKind: tgReceipt.getTokenKind(),
                                    value: big_uint_1.unmarshalBigUIntPB(tgReceipt.getValue()),
                                    withdrawalNonce: new bn_js_1.default(tgReceipt.getWithdrawalNonce()),
                                    oracleSignature: tgReceipt.getOracleSignature_asU8()
                                }];
                        }
                        else {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // LoomJS user events
    TransferGateway.EVENT_TOKEN_WITHDRAWAL = 'event_token_withdrawal';
    TransferGateway.EVENT_CONTRACT_MAPPING_CONFIRMED = 'event_contract_mapping_confirmed';
    // Events from Loomchain
    TransferGateway.tokenWithdrawalSignedEventTopic = 'event:TokenWithdrawalSigned';
    TransferGateway.contractMappingConfirmedEventTopic = 'event:ContractMappingConfirmed';
    return TransferGateway;
}(contract_1.Contract));
exports.TransferGateway = TransferGateway;
//# sourceMappingURL=transfer-gateway.js.map
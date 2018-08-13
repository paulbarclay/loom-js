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
Object.defineProperty(exports, "__esModule", { value: true });
var contract_1 = require("../contract");
var coin_pb_1 = require("../proto/coin_pb");
var big_uint_1 = require("../big-uint");
var Coin = /** @class */ (function (_super) {
    __extends(Coin, _super);
    function Coin(params) {
        return _super.call(this, params) || this;
    }
    Coin.createAsync = function (client, callerAddr) {
        return __awaiter(this, void 0, void 0, function () {
            var contractAddr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.getContractAddressAsync('coin')];
                    case 1:
                        contractAddr = _a.sent();
                        if (!contractAddr) {
                            throw Error('Failed to resolve contract address');
                        }
                        return [2 /*return*/, new Coin({ contractAddr: contractAddr, callerAddr: callerAddr, client: client })];
                }
            });
        });
    };
    Coin.prototype.getTotalSupplyAsync = function (caller) {
        return __awaiter(this, void 0, void 0, function () {
            var totalSupplyReq, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        totalSupplyReq = new coin_pb_1.TotalSupplyRequest();
                        return [4 /*yield*/, this.staticCallAsync(caller, 'TotalSupply', totalSupplyReq, new coin_pb_1.TotalSupplyResponse())];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, big_uint_1.unmarshalBigUIntPB(result.getTotalSupply())];
                }
            });
        });
    };
    Coin.prototype.getBalanceOfAsync = function (caller, owner) {
        return __awaiter(this, void 0, void 0, function () {
            var balanceOfReq, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        balanceOfReq = new coin_pb_1.BalanceOfRequest();
                        balanceOfReq.setOwner(owner.MarshalPB());
                        return [4 /*yield*/, this.staticCallAsync(caller, 'BalanceOf', balanceOfReq, new coin_pb_1.BalanceOfResponse())];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, big_uint_1.unmarshalBigUIntPB(result.getBalance())];
                }
            });
        });
    };
    Coin.prototype.getAllowanceAsync = function (caller, owner, spender) {
        return __awaiter(this, void 0, void 0, function () {
            var allowanceReq, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        allowanceReq = new coin_pb_1.AllowanceRequest();
                        allowanceReq.setOwner(owner.MarshalPB());
                        allowanceReq.setSpender(spender.MarshalPB());
                        return [4 /*yield*/, this.staticCallAsync(caller, 'Allowance', allowanceReq, new coin_pb_1.AllowanceResponse())];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, big_uint_1.unmarshalBigUIntPB(result.getAmount())];
                }
            });
        });
    };
    Coin.prototype.approveAsync = function (caller, spender, amount) {
        var approveReq = new coin_pb_1.ApproveRequest();
        approveReq.setSpender(spender.MarshalPB());
        approveReq.setAmount(big_uint_1.marshalBigUIntPB(amount));
        return this.callAsync(caller, 'Approve', approveReq);
    };
    Coin.prototype.transferAsync = function (caller, to, amount) {
        var transferReq = new coin_pb_1.TransferRequest();
        transferReq.setTo(to.MarshalPB());
        transferReq.setAmount(big_uint_1.marshalBigUIntPB(amount));
        return this.callAsync(caller, 'Transfer', transferReq);
    };
    Coin.prototype.transferFromAsync = function (caller, from, to, amount) {
        var transferFromReq = new coin_pb_1.TransferFromRequest();
        transferFromReq.setFrom(from.MarshalPB());
        transferFromReq.setTo(to.MarshalPB());
        transferFromReq.setAmount(big_uint_1.marshalBigUIntPB(amount));
        return this.callAsync(caller, 'TransferFrom', transferFromReq);
    };
    return Coin;
}(contract_1.Contract));
exports.Coin = Coin;
//# sourceMappingURL=coin.js.map
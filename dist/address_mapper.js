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
var contract_1 = require("./contract");
var address_1 = require("./address");
var address_mapper_pb_1 = require("./proto/address_mapper_pb");
var solidity_helpers_1 = require("./plasma-cash/solidity-helpers");
var AddressMapper = /** @class */ (function (_super) {
    __extends(AddressMapper, _super);
    function AddressMapper(params) {
        return _super.call(this, params) || this;
    }
    AddressMapper.createAsync = function (client, callerAddr) {
        return __awaiter(this, void 0, void 0, function () {
            var contractAddr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.getContractAddressAsync('addressmapper')];
                    case 1:
                        contractAddr = _a.sent();
                        if (!contractAddr) {
                            throw Error('Failed to resolve contract address');
                        }
                        return [2 /*return*/, new AddressMapper({ contractAddr: contractAddr, callerAddr: callerAddr, client: client })];
                }
            });
        });
    };
    AddressMapper.prototype.addIdentityMappingAsync = function (from, to, web3Signer) {
        return __awaiter(this, void 0, void 0, function () {
            var mappingIdentityRequest, hash, sign;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mappingIdentityRequest = new address_mapper_pb_1.AddressMapperAddIdentityMappingRequest();
                        mappingIdentityRequest.setFrom(from.MarshalPB());
                        mappingIdentityRequest.setTo(to.MarshalPB());
                        hash = solidity_helpers_1.soliditySha3({
                            type: 'address',
                            value: from.local.toString().slice(2)
                        }, { type: 'address', value: to.local.toString().slice(2) });
                        return [4 /*yield*/, web3Signer.signAsync(hash)];
                    case 1:
                        sign = _a.sent();
                        mappingIdentityRequest.setSignature(sign);
                        return [2 /*return*/, this.callAsync(from, 'AddIdentityMapping', mappingIdentityRequest)];
                }
            });
        });
    };
    AddressMapper.prototype.getMappingAsync = function (from) {
        return __awaiter(this, void 0, void 0, function () {
            var getMappingRequest, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        getMappingRequest = new address_mapper_pb_1.AddressMapperGetMappingRequest();
                        getMappingRequest.setFrom(from.MarshalPB());
                        return [4 /*yield*/, this.staticCallAsync(from, 'GetMapping', getMappingRequest, new address_mapper_pb_1.AddressMapperGetMappingResponse())];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                from: address_1.Address.UmarshalPB(result.getFrom()),
                                to: address_1.Address.UmarshalPB(result.getTo())
                            }];
                }
            });
        });
    };
    return AddressMapper;
}(contract_1.Contract));
exports.AddressMapper = AddressMapper;
//# sourceMappingURL=address_mapper.js.map
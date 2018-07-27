"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tape_1 = __importDefault(require("tape"));
var bn_js_1 = __importDefault(require("bn.js"));
var big_uint_1 = require("../../big-uint");
var crypto_utils_1 = require("../../crypto-utils");
var tests_pb_1 = require("../tests_pb");
tape_1.default('BigUInt', function (t) {
    try {
        var pb = new tests_pb_1.EmbeddedBigUInt();
        pb.setTestVal(big_uint_1.marshalBigUIntPB(new bn_js_1.default(10)));
        var hex = crypto_utils_1.bytesToHex(pb.serializeBinary());
        t.equal(hex, '0A030A010A', 'Correctly encoded in protobuf');
        var pb2 = tests_pb_1.EmbeddedBigUInt.deserializeBinary(crypto_utils_1.bufferToProtobufBytes(Buffer.from(hex, 'hex')));
        var val = big_uint_1.unmarshalBigUIntPB(pb2.getTestVal());
        t.equal(new bn_js_1.default(10).cmp(val), 0, 'Correctly decoded from protobuf');
    }
    catch (err) {
        console.log(err);
    }
    t.end();
});
//# sourceMappingURL=big-uint-tests.js.map
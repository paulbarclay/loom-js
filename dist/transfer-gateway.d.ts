import BN from 'bn.js';
import { Client } from './client';
import { Contract } from './contract';
import { Address } from './address';
import { TransferGatewayTokenKind } from './proto/transfer_gateway_pb';
export interface IWithdrawalReceipt {
    tokenOwner: Address;
    tokenContract: Address;
    tokenKind: TransferGatewayTokenKind;
    value: BN;
    withdrawalNonce: BN;
    oracleSignature: Uint8Array;
}
export interface ITokenWithdrawalEventArgs {
    tokenOwner: Address;
    tokenContract: Address;
    tokenKind: TransferGatewayTokenKind;
    value: BN;
    sig: Uint8Array;
}
export interface IContractMappingConfirmedEventArgs {
    foreignContract: Address;
    localContract: Address;
}
export declare class TransferGateway extends Contract {
    static readonly EVENT_TOKEN_WITHDRAWAL: string;
    static readonly EVENT_CONTRACT_MAPPING_CONFIRMED: string;
    static readonly tokenWithdrawalSignedEventTopic: String;
    static readonly contractMappingConfirmedEventTopic: String;
    static createAsync(client: Client, callerAddr: Address): Promise<TransferGateway>;
    constructor(params: {
        contractAddr: Address;
        callerAddr: Address;
        client: Client;
    });
    addContractMappingAsync(params: {
        caller: Address;
        foreignContract: Address;
        localContract: Address;
        foreignContractCreatorSig: Uint8Array;
        foreignContractCreatorTxHash: Uint8Array;
    }): Promise<void>;
    withdrawERC721Async(caller: Address, tokenId: BN, tokenContract: Address): Promise<void>;
    withdrawalReceiptAsync(owner: Address): Promise<IWithdrawalReceipt | null>;
}

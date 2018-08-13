import { Client } from './client';
import { Contract } from './contract';
import { Address } from './address';
import { Web3Signer } from './plasma-cash/solidity-helpers';
export interface IAddressMapping {
    from: Address;
    to: Address;
}
export declare class AddressMapper extends Contract {
    static createAsync(client: Client, callerAddr: Address): Promise<AddressMapper>;
    constructor(params: {
        contractAddr: Address;
        callerAddr: Address;
        client: Client;
    });
    addIdentityMappingAsync(from: Address, to: Address, web3Signer: Web3Signer): Promise<Uint8Array | void>;
    getMappingAsync(from: Address): Promise<IAddressMapping>;
}

import { Client } from './client';
import { Contract } from './contract';
import { Address } from './address';
import { Web3Signer } from './plasma-cash/solidity-helpers';
export declare class AddressMapper {
    private _addressMapperContract;
    static createAsync(client: Client, callerAddr: Address): Promise<AddressMapper>;
    constructor(contract: Contract);
    addContractMappingAsync(from: Address, to: Address): Promise<void>;
    getContractMappingAsync(from: Address): Promise<{
        from: Address;
        to: Address;
    }>;
    addIdentityMappingAsync(from: Address, to: Address, web3Signer: Web3Signer): Promise<Uint8Array | void>;
}
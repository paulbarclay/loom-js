import BN from 'bn.js';
import { Client } from '../client';
import { Contract } from '../contract';
import { Address } from '../address';
export declare class Coin extends Contract {
    static createAsync(client: Client, callerAddr: Address): Promise<Coin>;
    constructor(params: {
        contractAddr: Address;
        callerAddr: Address;
        client: Client;
    });
    getTotalSupplyAsync(caller: Address): Promise<BN>;
    getBalanceOfAsync(caller: Address, owner: Address): Promise<BN>;
    getAllowanceAsync(caller: Address, owner: Address, spender: Address): Promise<BN>;
    approveAsync(caller: Address, spender: Address, amount: BN): Promise<void>;
    transferAsync(caller: Address, to: Address, amount: BN): Promise<void>;
    transferFromAsync(caller: Address, from: Address, to: Address, amount: BN): Promise<void>;
}

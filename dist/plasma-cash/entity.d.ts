import BN from 'bn.js';
import Web3 from 'web3';
import { EthereumPlasmaClient, IPlasmaCoin, IPlasmaDeposit } from './ethereum-client';
import { DAppChainPlasmaClient } from './dappchain-client';
export interface IEntityParams {
    /** Web3 account for use on Ethereum */
    ethAccount: any;
    ethPlasmaClient: EthereumPlasmaClient;
    dAppPlasmaClient: DAppChainPlasmaClient;
    /** Allows to override the amount of gas used when sending txs to Ethereum. */
    defaultGas?: string | number;
    childBlockInterval: number;
}
/**
 * Manages Plasma Cash related interactions between an Ethereum network (Ganache, Mainnet, etc.)
 * and a Loom DAppChain from the point of view of a single entity. An entity has two identities, one
 * on Ethereum, and one on the DAppChain, each identity has its own private/public key pair.
 */
export declare class Entity {
    private _web3;
    private _ethAccount;
    private _dAppPlasmaClient;
    private _ethPlasmaClient;
    private _defaultGas?;
    private _childBlockInterval;
    readonly ethAddress: string;
    readonly plasmaCashContract: any;
    constructor(web3: Web3, params: IEntityParams);
    transferTokenAsync(params: {
        slot: BN;
        prevBlockNum: BN;
        denomination: BN | number;
        newOwner: Entity;
    }): Promise<void>;
    getPlasmaCoinAsync(slot: BN): Promise<IPlasmaCoin>;
    submitPlasmaBlockAsync(): Promise<BN>;
    submitPlasmaDepositAsync(deposit: IPlasmaDeposit): Promise<void>;
    startExitAsync(params: {
        slot: BN;
        prevBlockNum: BN;
        exitBlockNum: BN;
    }): Promise<object>;
    finalizeExitsAsync(): Promise<object>;
    withdrawAsync(slot: BN): Promise<object>;
    withdrawBondsAsync(): Promise<object>;
    challengeAfterAsync(params: {
        slot: BN;
        challengingBlockNum: BN;
    }): Promise<object>;
    challengeBetweenAsync(params: {
        slot: BN;
        challengingBlockNum: BN;
    }): Promise<object>;
    challengeBeforeAsync(params: {
        slot: BN;
        prevBlockNum: BN;
        challengingBlockNum: BN;
    }): Promise<object>;
    respondChallengeBeforeAsync(params: {
        slot: BN;
        challengingTxHash: string;
        respondingBlockNum: BN;
    }): Promise<object>;
}

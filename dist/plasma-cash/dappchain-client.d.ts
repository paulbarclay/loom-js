import BN from 'bn.js';
import { Client } from '../client';
import { Address } from '../address';
import { PlasmaCashTx } from './plasma-cash-tx';
import { PlasmaCashBlock } from './plasma-cash-block';
import { IPlasmaDeposit } from './ethereum-client';
export declare class DAppChainPlasmaClient {
    private _dAppClient;
    private _plasmaContract?;
    private _callerAddress;
    private _plasmaContractName;
    constructor(params: {
        dAppClient: Client;
        callerAddress: Address;
        contractName?: string;
    });
    private _resolvePlasmaContractAsync;
    /**
     * Retrieves the latest finalized Plasma block number from the DAppChain.
     */
    getCurrentPlasmaBlockNumAsync(): Promise<BN>;
    /**
     * Retrieves a Plasma block from the DAppChain.
     *
     * @param blockNum Height of the block to be retrieved.
     */
    getPlasmaBlockAtAsync(blockNum: BN): Promise<PlasmaCashBlock>;
    /**
     * Transfers a Plasma token from one entity to another.
     */
    sendTxAsync(tx: PlasmaCashTx): Promise<void>;
    /**
     * Requests that the DAppChain prepares a Plasma block for submission to Ethereum.
     *
     * This method is only provided for debugging & testing, in practice only DAppChain Plasma Oracles
     * will be permitted to make this request.
     */
    debugFinalizeBlockAsync(): Promise<void>;
    /**
     * Submits a Plasma deposit from Ethereum to the DAppChain.
     *
     * This method is only provided for debugging & testing, in practice only DAppChain Plasma Oracles
     * will be permitted to make this request.
     */
    debugSubmitDepositAsync(deposit: IPlasmaDeposit): Promise<void>;
}

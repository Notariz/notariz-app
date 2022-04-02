import { PublicKey } from "@solana/web3.js"

export class Emergency {
    public publicKey: PublicKey;
    public upstreamDeed: PublicKey;
    public owner: PublicKey;
    public receiver: PublicKey; 
    public claimedTimestamp: number;
    public redeemTimestamp: number;
    public timeBetweenPayments: number;
    public percentage: number;
    public numberOfPayments: number;
    public paymentsLeft: number;

    constructor (publicKey: PublicKey, accountData: any) {
        this.publicKey = publicKey
        this.upstreamDeed = accountData.upstreamDeed
        this.owner = accountData.owner
        this.receiver = accountData.receiver
        this.claimedTimestamp = accountData.claimedTimestamp
        this.redeemTimestamp = accountData.redeemTimestamp
        this.timeBetweenPayments = accountData.timeBetweenPayments
        this.percentage = accountData.percentage
        this.numberOfPayments = accountData.numberOfPayments
        this.paymentsLeft = accountData.paymentsLeft

    }
    
}
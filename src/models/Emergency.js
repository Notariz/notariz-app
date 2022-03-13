export class Emergency {
    constructor (publicKey, accountData) {
        this.publicKey = publicKey
        this.upstreamDeed = accountData.upstreamDeed
        this.owner = accountData.owner
        this.receiver = accountData.receiver
        this.percentage = accountData.percentage
        this.claimedTimestamp = accountData.claimedTimestamp.toString()
    }

    get key() {
        return this.publicKey.toBase58()
    }

    get owner_display() {
        const owner = this.owner.toBase58()
        return owner.slice(0,4) + '..' + owner.slice(-4)
    }

    get receiver_display() {
        const receiver = this.receiver.toBase58()
        return receiver.slice(0,4) + '..' + receiver.slice(-4)
    }
}
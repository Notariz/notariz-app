export class Recovery {
    constructor (publicKey, accountData) {
        this.publicKey = publicKey
        this.upstreamDeed = accountData.upstreamDeed
        this.owner = accountData.owner
        this.receiver = accountData.receiver
    }

    get key() {
        return this.publicKey.toBase58()
    }

    get owner_display() {
        const owner = this.owner.toBase58()
        return owner.slice(0,4) + '..' + owner.slice(-4)
    }
}
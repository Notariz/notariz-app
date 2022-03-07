import { PublicKey } from '@solana/web3.js';
import { useState, useCallback, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import './Wallet.css';
import '../Common.css';

interface Deed {
    owner: string;
    recovery: string;
    last_seen: number;
    total_shares: number;
    withdrawal_period: number;
}

const TEST_DEED: Deed[] = [
    {
        owner: '3dCjBWJyjGwiNk3Q45WzvMhfmz4Weod2ABjQuzhfqzD3',
        recovery: '',
        last_seen: 0,
        total_shares: 0,
        withdrawal_period: 0,
    },
];

const PROGRAM_BALANCE = 500;
const WITHDRAWAL_PERIOD = 4;
const SOLANA_PRICE = 100;
const LAST_ON_CHAIN_ACTIVITY = "03/07/22"

function Wallet() {
    const [openDeed, setOpenDeed] = useState<Deed[]>([]);

    const renderCreateAccount = useCallback(
        () => (
            <div className="wallet-item">
                <h3>Open deed</h3>
                <div className="hint">
                    It looks like you do not have any open deed. Deeds keep track of your Notariz data.
                </div>
                <button className="cta-button confirm-button">Open a deed</button>
            </div>
        ),
        [openDeed]
    );

    const renderBalance = useCallback(
        () => (
            <div className="wallet-item">
                <h3>Total deposit</h3>
                <h1>{PROGRAM_BALANCE + ' SOL'}</h1>
                <button className="cta-button confirm-button">Deposit</button>
                <button className="cta-button delete-button">Withdraw</button>
            </div>
        ),
        [openDeed]
    );

    const renderWithdrawalPeriod = useCallback(
        () => (
            <div className="wallet-item">
                <h3>Withdrawal period</h3>
                <h1>{WITHDRAWAL_PERIOD + ' days'}</h1>
                <button className="cta-button confirm-button">Edit</button>
            </div>
        ),
        [openDeed]
    );

    const renderSolanaPrice = useCallback(
        () => (
            <div className="wallet-item">
                <h3>Solana price</h3>
                <h1>{'$'+ SOLANA_PRICE}</h1>
            </div>
        ),
        [openDeed]
    );

    const renderOnChainActivity = useCallback(
        () => (
            <div className="wallet-item">
                <h3>Last recorded on-chain activity</h3>
                <h1>{LAST_ON_CHAIN_ACTIVITY}</h1>
            </div>
        ),
        [openDeed]
    );

    useEffect(() => setOpenDeed(TEST_DEED), [PublicKey]);

    return (
        <div className="wallet-container">
            <Container>
                <Row>
                    <Col xs={8}>
                        <div className="wallet-item-background">
                            <div className="wallet-item">
                                {openDeed.length > 0 ? renderBalance() : renderCreateAccount()}
                            </div>
                        </div>
                    </Col>
                    <Col xs={4}>
                        <div className="wallet-item-background">
                            <div className="wallet-item">{openDeed.length > 0 ? renderWithdrawalPeriod() : null}</div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <div className="wallet-item-background">
                            <div className="wallet-item">{openDeed.length > 0 ? renderSolanaPrice() : null}</div>
                        </div>
                    </Col>
                    
                </Row>
            </Container>
        </div>
    );
}

export default Wallet;

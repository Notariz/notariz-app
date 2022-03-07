import { PublicKey } from '@solana/web3.js';
import { useState, useCallback, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { PieChart } from 'react-minimal-pie-chart';
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
const LAST_ON_CHAIN_ACTIVITY = '03/07/22';
const TOTAL_SHARED = 62;

function Wallet() {
    const [openDeed, setOpenDeed] = useState<Deed[]>([]);
    const myData = [
        { title: 'Dogs', value: 100, color: '#fd1d68' },
        { title: 'Cats', value: 50, color: '#ed729b' },
        { title: 'Dragons', value: 15, color: 'purple' },
    ];

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

    const renderPieChart = useCallback(
        () => (
            <div className="wallet-item pie-chart-container">
                <h3>Assets distribution</h3>
                <div className="pie-chart-item">
                    <PieChart
                        // your data
                        data={myData}
                        // width and height of the view box
                        viewBoxSize={[100, 100]}
                    />
                </div>
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

    const renderShares = useCallback(
        () => (
            <div className="wallet-item">
                <h3>Shared deposit total</h3>
                <h1>{TOTAL_SHARED + '%'}</h1>
            </div>
        ),
        [openDeed]
    );

    useEffect(() => setOpenDeed(TEST_DEED), [PublicKey]);

    return (
        <div className="wallet-container">
            {openDeed.length > 0 ? (
                <Container>
                    <Row>
                        <Col xs={7}>
                            <div className="wallet-item-background">{renderBalance()}</div>
                        </Col>
                        <Col xs={5}>
                            <div className="wallet-item-background">{renderWithdrawalPeriod()}</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4}>
                            <div className="wallet-item-background">{renderShares()}</div>
                            <div className="wallet-item-background">{renderOnChainActivity()}</div>
                        </Col>
                        <Col xs={8}>
                            <div className="wallet-item-background">{renderPieChart()}</div>
                        </Col>
                    </Row>
                </Container>
            ) : (
                renderCreateAccount()
            )}
        </div>
    );
}

export default Wallet;

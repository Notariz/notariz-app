import { useCallback, useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Col, Container, Row } from 'react-bootstrap';
import Parser from 'html-react-parser';
import Emergency from './DashboardComponents/Emergency';
import Claim from './DashboardComponents/Claim';
import Recovery from './DashboardComponents/Recovery';
import Wallet from './DashboardComponents/Wallet';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import './DashboardComponents/Common.css';

function Dashboard() {
    const { publicKey } = useWallet();
    const [notificationsCount, setNotificationsCount] = useState(0);

    const renderWalletNotConnected = useCallback(
        () => (
            <div className="not-connected-container">
                <Container>
                    <p>
                        Think of tomorrow. <span>Notariz</span>.
                    </p>
                    <Row>
                        <Col></Col>
                        <Col>
                            <WalletMultiButton />
                        </Col>
                        <Col></Col>
                    </Row>
                </Container>
            </div>
        ),
        [publicKey]
    );

    useEffect(() => {
        document.title = `${notificationsCount > 0 ? `(${notificationsCount})` : ''} Notariz`;
    });

    const renderWalletConnected = () => {
        return (
            <Tabs defaultActiveKey="emergency" id="tabs" className="mb-3">
                <Tab
                    eventKey="emergency"
                    title={
                        notificationsCount > 0
                            ? Parser(`Emergencies <span className="notification-badge">${notificationsCount}</span>`)
                            : 'Emergencies'
                    }
                    className="tab-content"
                >
                    <Emergency setNotificationCounter={(number) => setNotificationsCount(number)} />
                </Tab>
                <Tab eventKey="recovery" title="Recovery addresses" className="tab-content">
                    <Recovery />
                </Tab>
                <Tab eventKey="claim" title="Pending incomes" className="tab-content">
                    <Claim />
                </Tab>
                <Tab eventKey="wallet" title="Wallet" className="tab-content">
                    <Wallet />
                </Tab>
            </Tabs>
        );
    };

    return (
        <div className="dashboard-container">
            {!publicKey && renderWalletNotConnected()}
            {publicKey && renderWalletConnected()}
        </div>
    );
}

export default Dashboard;

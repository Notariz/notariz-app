import { useCallback, useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Col, Container, Row } from 'react-bootstrap';
import Parser from 'html-react-parser';
import Emergency from './DashboardComponents/Emergency/Sender/Emergency';
import ClaimEmergency from './DashboardComponents/Emergency/Receiver/ClaimEmergency';
import Recovery from './DashboardComponents/Recovery/Sender/Recovery';
import ProfileButton from './utils/ProfileButton';
import Wallet from './DashboardComponents/Wallet';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import './DashboardComponents/Common.css';

function Dashboard() {
    const { publicKey } = useWallet();
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [emergencyProfile, setEmergencyProfile] = useState(() => {
        const initialValue = localStorage.getItem("emergencyProfile") ? JSON.parse(localStorage.getItem("emergencyProfile") || "") : null;
        return initialValue || 'sender';
    }); 
    const [recoveryProfile, setRecoveryProfile] = useState(() => {
        const initialValue = localStorage.getItem("recoveryProfile") ? JSON.parse(localStorage.getItem("recoveryProfile") || "") : null;
        return initialValue || 'sender';
    }); 

    const renderWalletNotConnected = useCallback(
        () => (
            <div className="not-connected-container">
                <Container>
                    <h3>Think of tomorrow.</h3>
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

    const setEmergencyToggle = () => {
        if (emergencyProfile === 'sender') setEmergencyProfile('receiver');
        else if (emergencyProfile === 'receiver') setEmergencyProfile('sender');
    };

    const setRecoveryToggle = () => {
        if (recoveryProfile === 'sender') setRecoveryProfile('receiver');
        else if (recoveryProfile === 'receiver') setRecoveryProfile('sender');
    };

    useEffect(() => {
        document.title = `${notificationsCount > 0 ? `(${notificationsCount})` : ''} Notariz`;
    });

    useEffect(() => {
        localStorage.setItem('emergencyProfile', JSON.stringify(emergencyProfile));
    }, [emergencyProfile]);

    useEffect(() => {
        localStorage.setItem('recoveryProfile', JSON.stringify(recoveryProfile));
    }, [recoveryProfile]);

    const renderWalletConnected = useCallback(
        () => (
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
                    <ProfileButton profile={emergencyProfile} setToggle={setEmergencyToggle} />
                    {emergencyProfile === 'sender' && (
                        <Emergency setNotificationCounter={(number) => setNotificationsCount(number)} />
                    ) || <ClaimEmergency />}
                </Tab>
                <Tab eventKey="recovery" title="Recovery addresses" className="tab-content">
                    <ProfileButton profile={recoveryProfile} setToggle={setRecoveryToggle} />
                    {recoveryProfile === 'sender' && <Recovery />}
                </Tab>
                <Tab eventKey="wallet" title="Wallet" className="tab-content">
                    <Wallet />
                </Tab>
            </Tabs>
        ),
        [publicKey, notificationsCount, emergencyProfile, recoveryProfile]
    );

    return (
        <div className="dashboard-container">
            {!publicKey && renderWalletNotConnected()}
            {publicKey && renderWalletConnected()}
        </div>
    );
}

export default Dashboard;

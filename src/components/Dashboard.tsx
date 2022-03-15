import { Deed } from '../models';
import { Emergency } from '../models';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';

import { clusterApiUrl, Connection, Transaction, PublicKey, LAMPORTS_PER_SOL, ConfirmOptions } from '@solana/web3.js';
import { Program, Provider, Wallet, web3, BN } from '@project-serum/anchor';
import idl from '../idl.json';

import { useCallback, useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { Col, Container, Row } from 'react-bootstrap';
import Parser from 'html-react-parser';
import SendEmergency from './DashboardComponents/Emergency/Sender/SendEmergency';
import ClaimEmergency from './DashboardComponents/Emergency/Receiver/ClaimEmergency';
import Recovery from './DashboardComponents/Recovery/Sender/Recovery';
import ClaimRecovery from './DashboardComponents/Recovery/Receiver/ClaimRecovery';
import ProfileButton from './utils/ProfileButton';
import WalletDashboard from './DashboardComponents/Wallet/WalletDashboard';
import About from './DashboardComponents/About';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import './DashboardComponents/Common.css';
import { useMemo } from 'react';

const { SystemProgram, Keypair } = web3;

const opts: ConfirmOptions = {
    commitment: 'processed',
};

const programID = new PublicKey(idl.metadata.address);

function Dashboard() {
    const wallet = useWallet();
    const { publicKey } = wallet;
    const { connection } = useConnection();

    const [notificationsCount, setNotificationsCount] = useState(0);

    const [openDeed, setOpenDeed] = useState<Deed | undefined>();
    const [upstreamDeed, setUpstreamDeed] = useState<Deed | undefined>();
    const [emergencyList, setEmergencyList] = useState<Emergency[] | undefined>([]);
    const [emergencySenderList, setEmergencySenderList] = useState<Emergency[] | undefined>([]);

    const [userBalance, setUserBalance] = useState('0');
    const [deedBalance, setDeedBalance] = useState<number | undefined>(0.0);

    const provider = new Provider(connection, wallet as any, opts);
    const program = new Program(idl as any, programID, provider);

    const [emergencyProfile, setEmergencyProfile] = useState(() => {
        const initialValue = localStorage.getItem('emergencyProfile')
            ? JSON.parse(localStorage.getItem('emergencyProfile') || '')
            : null;
        return initialValue || 'sender';
    });
    const [recoveryProfile, setRecoveryProfile] = useState(() => {
        const initialValue = localStorage.getItem('recoveryProfile')
            ? JSON.parse(localStorage.getItem('recoveryProfile') || '')
            : null;
        return initialValue || 'sender';
    });

    const renderWalletNotConnected = useMemo(
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
        []
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

    const fetchDeeds = useCallback(() => {
        if (!publicKey) throw new WalletNotConnectedError();

        return program.account.deed
            .all([
                {
                    memcmp: {
                        offset: 8, // Discriminator.
                        bytes: publicKey.toBase58(),
                    },
                },
            ])
            .then((deeds) => {
                return deeds.length > 0 ? new Deed(deeds[0].publicKey, deeds[0].account) : undefined;
            });
    }, [publicKey, program.account.deed]);

    const refreshDeedData = useCallback(async () => {
        const deed = await fetchDeeds();

        setOpenDeed(deed);

        if (!deed) return;

        const deedAccountBalance = await program.provider.connection
            .getAccountInfo(deed.publicKey)
            .then((res) => res?.lamports)
            .catch(console.log);

        if (deedAccountBalance) {
            setDeedBalance(deedAccountBalance / LAMPORTS_PER_SOL);
        }
    }, [fetchDeeds, program.provider.connection]);

    useEffect(() => {
        refreshDeedData();
    }, [publicKey]);

    const getUserBalance = useCallback(() => {
        if (!publicKey) throw new WalletNotConnectedError();

        connection
            .getBalance(publicKey)
            .then((res) => setUserBalance((res / LAMPORTS_PER_SOL).toFixed(2)))
            .catch(() => alert('Cannot fetch wallet balance!'));

        return userBalance;
    }, [publicKey, connection, userBalance]);

    const fetchEmergencies = useCallback(() => {
        if (!publicKey) throw new WalletNotConnectedError();

        if (!openDeed) return;

        return program.account.emergency
            .all([
                {
                    memcmp: {
                        offset: 8, // Discriminator.
                        bytes: openDeed.publicKey.toBase58(),
                    },
                },
            ])
            .then((emergencies) => {
                console.log(emergencies);
                return emergencies.length > 0
                    ? emergencies.map((emergency) => new Emergency(emergency.publicKey, emergency.account))
                    : undefined;
            });
    }, [publicKey, openDeed, program.account.emergency]);

    const refreshEmergenciesData = useCallback(async () => {
        const emergencies = await fetchEmergencies();

        if (!emergencies) return;

        setEmergencyList(emergencies);
    }, [fetchEmergencies]);

    useEffect(() => {
        refreshEmergenciesData();
    }, [publicKey, openDeed]);

    

    const fetchEmergencySenders = useCallback(() => {
        if (!publicKey) throw new WalletNotConnectedError();

        return program.account.emergency
            .all([
                {
                    memcmp: {
                        offset: 8 + 32 + 32, // Discriminator + upstream deed public key + deed owner.
                        bytes: provider.wallet.publicKey.toBase58(),
                    },
                },
            ])
            .then((emergencies) => {
                console.log(emergencies);
                return emergencies.length > 0
                    ? emergencies.map((emergency) => new Emergency(emergency.publicKey, emergency.account))
                    : undefined;
            });
    }, [publicKey, program.account.emergency, provider.wallet.publicKey]);

    const refreshEmergencySendersData = useCallback(async () => {
        const emergencySenders = await fetchEmergencySenders();
        console.log(emergencySenders);

        if (!emergencySenders) return;

        setEmergencySenderList(emergencySenders);
    }, [fetchEmergencySenders]);

    useEffect(() => {
        refreshEmergencySendersData();
    }, [publicKey, refreshEmergencySendersData]);

    const renderWalletConnected = useMemo(
        () => (
            <Tabs defaultActiveKey="wallet" id="tabs" className="mb-3">
                <Tab eventKey="wallet" title="Dashboard" className="tab-content">
                    <WalletDashboard
                        getUserBalance={getUserBalance}
                        refreshDeedData={refreshDeedData}
                        userBalance={userBalance}
                        deedBalance={deedBalance}
                        openDeed={openDeed}
                        setOpenDeed={setOpenDeed}
                    />
                </Tab>
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
                    {(emergencyProfile === 'sender' && (
                        <SendEmergency
                            emergencyList={emergencyList}
                            setEmergencyList={setEmergencyList}
                            refreshDeedData={refreshDeedData}
                            deedBalance={deedBalance}
                            refreshEmergenciesData={refreshEmergenciesData}
                            openDeed={openDeed}
                            setOpenDeed={setOpenDeed}
                            setNotificationCounter={(number) => setNotificationsCount(number)}
                        />
                    )) || (
                        <ClaimEmergency
                            emergencySenderList={emergencySenderList}
                            setEmergencySenderList={setEmergencySenderList}
                            refreshEmergencySendersData={refreshEmergencySendersData}
                        />
                    )}
                </Tab>
                <Tab eventKey="recovery" title="Recoveries" className="tab-content">
                    <ProfileButton profile={recoveryProfile} setToggle={setRecoveryToggle} />
                    {(recoveryProfile === 'sender' && <Recovery openDeed={openDeed} setOpenDeed={setOpenDeed} />) || (
                        <ClaimRecovery />
                    )}
                </Tab>
                <Tab eventKey="about" title="About" className="tab-content">
                    <About />
                </Tab>
            </Tabs>
        ),
        [
            notificationsCount,
            emergencyProfile,
            recoveryProfile,
            deedBalance,
            emergencyList,
            getUserBalance,
            openDeed,
            refreshDeedData,
            refreshEmergenciesData,
            setEmergencyToggle,
            setRecoveryToggle,
            userBalance,
            emergencySenderList
        ]
    );

    return <div className="dashboard-container">{publicKey ? renderWalletConnected : renderWalletNotConnected}</div>;
}

export default Dashboard;

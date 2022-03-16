import { Deed, Recovery } from '../models';
import { Emergency } from '../models';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
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
import SendRecovery from './DashboardComponents/Recovery/Sender/SendRecovery';
import ClaimRecovery from './DashboardComponents/Recovery/Receiver/ClaimRecovery';
import ProfileButton from './utils/ProfileButton';
import WalletDashboard from './DashboardComponents/Wallet/WalletDashboard';
import About from './DashboardComponents/About';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import './DashboardComponents/Common.css';
import { useMemo } from 'react';
import { resourceUsage } from 'process';

const { SystemProgram, Keypair } = web3;

const opts: ConfirmOptions = {
    commitment: 'processed',
};

interface DeedBalance {
    deed: PublicKey;
    balance: number;
}

const programID = new PublicKey(idl.metadata.address);

function Dashboard() {
    const wallet = useWallet();
    const { publicKey } = wallet ?? { publicKey: undefined };
    const { connection } = useConnection();
    const provider = new Provider(connection, wallet as any, opts);
    const program = new Program(idl as any, programID, provider);

    const [notificationsCount, setNotificationsCount] = useState(0);

    const [openDeed, setOpenDeed] = useState<Deed | undefined>();
    const [upstreamDeeds, setUpstreamDeeds] = useState<Deed[] | undefined>();

    const [emergencyList, setEmergencyList] = useState<Emergency[] | undefined>([]);
    const [emergencySenderList, setEmergencySenderList] = useState<Emergency[] | undefined>([]);

    const [recoveryList, setRecoveryList] = useState<Recovery[] | undefined>([]);
    const [recoverySenderList, setRecoverySenderList] = useState<Recovery[] | undefined>([]);

    const [userBalance, setUserBalance] = useState('0');
    const [upstreamDeedsBalance, setUpstreamDeedsBalance] = useState<DeedBalance[] | undefined>();
    const [deedBalance, setDeedBalance] = useState<number | undefined>(0.0);

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
    }, [openDeed, notificationsCount]);

    useEffect(() => {
        localStorage.setItem('emergencyProfile', JSON.stringify(emergencyProfile));
    }, [emergencyProfile]);

    useEffect(() => {
        localStorage.setItem('recoveryProfile', JSON.stringify(recoveryProfile));
    }, [recoveryProfile]);

    const fetchDeeds = useCallback(() => {
        if (!publicKey) return;

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
            .then((res: any) => res?.lamports)
            .catch(console.log);

        if (deedAccountBalance) {
            setDeedBalance(deedAccountBalance / LAMPORTS_PER_SOL);
        }
    }, [fetchDeeds, program.provider.connection]);

    useEffect(() => {
        refreshDeedData();
    }, [publicKey]);

    const fetchUpstreamDeed = useCallback(
        (upstreamDeedOwner) => {
            if (!publicKey) return;

            return program.account.deed
                .all([
                    {
                        memcmp: {
                            offset: 8, // Discriminator.
                            bytes: upstreamDeedOwner.toBase58(),
                        },
                    },
                ])
                .then((upstreamDeed) => {
                    return upstreamDeed.length > 0
                        ? new Deed(upstreamDeed[0].publicKey, upstreamDeed[0].account)
                        : undefined;
                });
        },
        [publicKey, program.account.deed]
    );

    const refreshUpstreamDeedsData = useCallback(async () => {
        if (!emergencySenderList) return;

        const upstreamDeeds = (
            await Promise.all(emergencySenderList.map((sending) => fetchUpstreamDeed(sending.owner)))
        ).filter((val) => typeof val !== 'undefined') as Deed[];

        if (!upstreamDeeds) return;

        console.log('Upstream deeds: ', upstreamDeeds);

        setUpstreamDeeds(upstreamDeeds);
    }, [emergencySenderList, fetchUpstreamDeed]);

    useEffect(() => {
        refreshUpstreamDeedsData();
    }, [publicKey, emergencySenderList]);

    const getUserBalance = useCallback(() => {
        if (!publicKey) return;

        connection
            .getBalance(publicKey)
            .then((res) => setUserBalance((res / LAMPORTS_PER_SOL).toFixed(2)))
            .catch(() => alert('Cannot fetch wallet balance!'));

        return userBalance;
    }, [publicKey, connection, userBalance]);

    const getUpstreamDeedsBalance = useCallback(() => {
        if (!publicKey) return;

        if (!emergencySenderList) return;

        emergencySenderList.map((emergency) =>
            connection
                .getBalance(emergency.upstreamDeed)
                .then((res) =>
                    setUpstreamDeedsBalance(
                        upstreamDeedsBalance
                            ? [...upstreamDeedsBalance, { deed: emergency.upstreamDeed, balance: res }]
                            : [{ deed: emergency.upstreamDeed, balance: res }]
                    )
                )
                .catch(() => alert('Cannot fetch upstream deed balance!'))
        );
    }, [publicKey, connection, emergencySenderList, upstreamDeedsBalance]);

    const fetchEmergencies = useCallback(() => {
        if (!publicKey) return;

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

    const claimingEmergencies = emergencyList?.filter(function (emergency) {
        if (!emergencyList) return;

        return emergency.claimedTimestamp > 0;
    });

    useEffect(() => {
        if (claimingEmergencies) setNotificationsCount(claimingEmergencies.length);
    }, [emergencyList, claimingEmergencies]);

    const fetchEmergencySenders = useCallback(() => {
        if (!publicKey) return;

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
                return emergencies.length > 0
                    ? emergencies.map((emergency) => new Emergency(emergency.publicKey, emergency.account))
                    : undefined;
            });
    }, [publicKey, program.account.emergency, provider.wallet.publicKey]);

    const refreshEmergencySendersData = useCallback(async () => {
        const emergencySenders = await fetchEmergencySenders();

        if (!emergencySenders) return;

        setEmergencySenderList(emergencySenders);
    }, [fetchEmergencySenders]);

    useEffect(() => {
        refreshEmergencySendersData();
    }, [publicKey]);

    const fetchRecoveries = useCallback(() => {
        if (!publicKey) return;

        if (!openDeed) return;

        return program.account.recovery
            .all([
                {
                    memcmp: {
                        offset: 8, // Discriminator.
                        bytes: openDeed.publicKey.toBase58(),
                    },
                },
            ])
            .then((recoveries) => {
                return recoveries.length > 0
                    ? recoveries.map((recovery) => new Recovery(recovery.publicKey, recovery.account))
                    : undefined;
            });
    }, [publicKey, openDeed, program.account.recovery]);

    const refreshRecoveriesData = useCallback(async () => {
        const recoveries = await fetchRecoveries();

        if (!recoveries) return;

        setRecoveryList(recoveries);
    }, [fetchRecoveries]);

    useEffect(() => {
        refreshRecoveriesData();
    }, [publicKey, openDeed]);

    const fetchRecoverySenders = useCallback(() => {
        if (!publicKey) return;

        return program.account.recovery
            .all([
                {
                    memcmp: {
                        offset: 8 + 32 + 32, // Discriminator + upstream deed public key + deed owner.
                        bytes: provider.wallet.publicKey.toBase58(),
                    },
                },
            ])
            .then((recoveries) => {
                return recoveries.length > 0
                    ? recoveries.map((recovery) => new Recovery(recovery.publicKey, recovery.account))
                    : undefined;
            });
    }, [publicKey, program.account.recovery, provider.wallet.publicKey]);

    const refreshRecoverySendersData = useCallback(async () => {
        const recoverySenders = await fetchRecoverySenders();

        if (!recoverySenders) return;

        setRecoverySenderList(recoverySenders);
    }, [fetchRecoverySenders]);

    useEffect(() => {
        refreshRecoverySendersData();
    }, [publicKey]);

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
                        emergencyList={emergencyList}
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
                        />
                    )) || (
                        <ClaimEmergency
                            upstreamDeedsBalance={upstreamDeedsBalance}
                            getUpstreamDeedsBalance={getUpstreamDeedsBalance}
                            emergencySenderList={emergencySenderList}
                            setEmergencySenderList={setEmergencySenderList}
                            refreshEmergencySendersData={refreshEmergencySendersData}
                            upstreamDeeds={upstreamDeeds}
                        />
                    )}
                </Tab>
                <Tab eventKey="recovery" title="Recoveries" className="tab-content">
                    <ProfileButton profile={recoveryProfile} setToggle={setRecoveryToggle} />
                    {(recoveryProfile === 'sender' && (
                        <SendRecovery
                            openDeed={openDeed}
                            refreshDeedData={refreshDeedData}
                            refreshRecoveriesData={refreshRecoveriesData}
                            setOpenDeed={setOpenDeed}
                            deedBalance={deedBalance}
                            recoveryList={recoveryList}
                            setRecoveryList={setRecoveryList}
                        />
                    )) || (
                        <ClaimRecovery
                            refreshRecoverySendersData={refreshRecoverySendersData}
                            recoverySendersList={recoverySenderList}
                            setRecoverySendersList={setRecoverySenderList}
                            upstreamDeeds={upstreamDeeds}
                        />
                    )}
                </Tab>
                <Tab eventKey="about" title="Why?" className="tab-content">
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
            emergencySenderList,
            getUpstreamDeedsBalance,
            refreshEmergencySendersData,
            upstreamDeedsBalance,
            recoveryList,
            recoverySenderList,
            refreshRecoveriesData,
            refreshRecoverySendersData,
            upstreamDeeds
        ]
    );

    return <div className="dashboard-container">{publicKey ? renderWalletConnected : renderWalletNotConnected}</div>;
}

export default Dashboard;

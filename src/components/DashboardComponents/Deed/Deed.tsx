import { Deed } from '../../../models/Deed';

import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { clusterApiUrl, Connection, Transaction, PublicKey, LAMPORTS_PER_SOL, ConfirmOptions } from '@solana/web3.js';
import { Program, Provider, Wallet, web3, BN } from '@project-serum/anchor';
import idl from '../../../idl.json';

import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { PieChart } from 'react-minimal-pie-chart';
import TopUpModal from './Modals/TopUpModal';
import DeleteDeedModal from './Modals/DeleteDeedModal';
import WithdrawModal from './Modals/WithdrawModal';
import EditWithdrawalPeriodModal from './Modals/EditWithdrawalPeriod';
import Emojis from '../../utils/Emojis';
import './Deed.css';
import '../Common.css';
import { Emergency, Recovery } from '../../../models';

const { SystemProgram, Keypair } = web3;

const opts: ConfirmOptions = {
    commitment: 'processed',
};

const programID = new PublicKey(idl.metadata.address);

interface Data {
    title: string;
    value: number;
    color: string;
}

function DeedAccount(props: {
    emergencyList: Emergency[] | undefined;
    recoveryList: Recovery[] | undefined;
    refreshEmergenciesData: () => any;
    refreshRecoveriesData: () => any;
    userBalance: string;
    deedBalance: number | undefined;
    openDeed: Deed | undefined;
    getUserBalance: () => string | undefined;
    refreshDeedData: () => any;
    setOpenDeed: (deed: Deed | undefined) => void;
}) {
    const wallet = useWallet();
    const { publicKey, sendTransaction } = wallet;
    const { connection } = useConnection();

    const provider = new Provider(connection, wallet as any, opts);
    const program = new Program(idl as any, programID, provider);

    const [topUpModalShow, setTopUpModalShow] = useState(false);
    const [topUpFormIsCorrect, setTopUpFormIsCorrect] = useState(false);

    const [showDeleteModal, setDeleteModalShow] = useState(false);
    const [showWithdrawModal, setWithdrawModalShow] = useState(false);
    const [withdrawFormIsCorrect, setWithdrawFormIsCorrect] = useState(false);

    const [editWithdrawalPeriodModalShow, setEditWithdrawalPeriodModalShow] = useState(false);
    const [editWithdrawalPeriodFormIsCorrect, setEditWithdrawalPeriodFormIsCorrect] = useState(false);

    const [distribution, setDistribution] = useState<Data[] | undefined>();

    const colors = ['#F75538', '#F56728', '#F47A18', '#F28D08'];

    const getColor = () => {
        return colors[Math.floor(Math.random() * (colors.length - 1))];
    };

    const computeDistribution = useCallback(() => {
        if (!publicKey || !props.openDeed) return;

        let distribution = [{ title: publicKey.toString(), value: props.openDeed.leftToBeShared, color: '#FC1C67' }];

        if (props.emergencyList && distribution) {
            distribution = distribution.concat(
                props.emergencyList.map((e) => ({
                    title: e.receiver.toString(),
                    value: e.percentage,
                    color: getColor(),
                }))
            );
        }

        setDistribution(distribution);
    }, [publicKey, props.openDeed, props.emergencyList, getColor]);

    useEffect(() => {
        computeDistribution();
    }, [publicKey, props]);

    function toDate(timestamp: number) {
        const date = new Date(timestamp * 1000);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return [day, month, year].join('/');
    }

    function fromSecondsToHours(duration: number) {
        return duration / 3600;
    }

    const createDeed = useCallback(async () => {
        if (!publicKey || typeof wallet.signTransaction === 'undefined') return;

        if (typeof props.openDeed !== 'undefined') return;

        const deedKeypair = web3.Keypair.generate();

        /* interact with the program via rpc */
        await program.rpc
            .createDeed({
                accounts: {
                    deed: deedKeypair.publicKey,
                    owner: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                },
                signers: [deedKeypair],
            })
            .then((res) => program.provider.connection.confirmTransaction(res))
            .catch(console.log);

        const deedAccount = await program.account.deed.fetch(deedKeypair.publicKey);
        props.setOpenDeed(new Deed(deedKeypair.publicKey, deedAccount));
    }, [
        program.account.deed,
        program.provider.connection,
        program.rpc,
        provider.wallet.publicKey,
        publicKey,
        wallet.signTransaction,
        props,
    ]);

    const renderCreateAccount = useMemo(
        () => (
            <div className="wallet-item">
                <h3>Create a Notariz account</h3>
                <p>
                    <div className="hint">It looks like you do not have any open deed.</div>
                    <div className="hint"> Deeds keep track of your interactions with Notariz.</div>
                </p>
                <button
                    onClick={() => {
                        createDeed();
                        props.getUserBalance();
                    }}
                    className="cta-button confirm-button"
                >
                    Open a deed
                </button>
            </div>
        ),
        [createDeed]
    );

    const deleteDeed = useCallback(
        async (deed: Deed | undefined) => {
            if (!publicKey) return;

            if (!deed) return;

            return program.rpc
                .deleteDeed({
                    accounts: {
                        deed: deed.publicKey,
                        owner: deed.owner,
                    },
                })
                .then((res) => program.provider.connection.confirmTransaction(res))
                .catch(console.log);
        },
        [program.provider.connection, publicKey, program.rpc]
    );

    const renderAccountName = useMemo(
        () => (
            <div>
                <h3>Your deed account</h3>
                <p>
                    {props.openDeed?.publicKey.toString().substring(0, 5) +
                        '..' +
                        props.openDeed?.publicKey
                            .toString()
                            .substring(props.openDeed?.publicKey.toString().length - 5)}{' '}
                    <a
                        href={
                            'https://explorer.solana.com/address/' +
                            props.openDeed?.publicKey.toString() +
                            '?cluster=devnet'
                        }
                    >
                        <Emojis symbol="????" label="scroll" />
                    </a>
                </p>
                <button
                    onClick={() => {
                        props.refreshEmergenciesData;
                        props.refreshRecoveriesData;
                        props.getUserBalance();
                        setDeleteModalShow(true);
                    }}
                    className="cta-button delete-button"
                >
                    Delete
                </button>
            </div>
        ),
        [props]
    );

    const renderProgramBalance = useMemo(
        () => (
            <div className="wallet-item">
                <h3>Total deposit</h3>
                <h1>{props.deedBalance + ' SOL '}</h1>
                <button
                    onClick={() => {
                        setTopUpModalShow(true);
                        props.getUserBalance();
                    }}
                    className="cta-button confirm-button"
                >
                    Top up
                </button>
                <button
                    onClick={() => {
                        setWithdrawModalShow(true);
                        props.getUserBalance();
                    }}
                    className="cta-button delete-button"
                >
                    Withdraw
                </button>
            </div>
        ),
        [props]
    );

    const renderWithdrawalPeriod = useMemo(
        () => (
            <div className="wallet-item">
                <h3>Withdrawal period</h3>
                <h1>
                    {props.openDeed
                        ? fromSecondsToHours(props.openDeed.withdrawalPeriod) +
                          (fromSecondsToHours(props.openDeed.withdrawalPeriod) > 1 ? ' hours' : ' hour')
                        : 'Unknown'}
                </h1>
                <button
                    onClick={() => {
                        setEditWithdrawalPeriodModalShow(true);
                        props.getUserBalance();
                    }}
                    className="cta-button confirm-button"
                >
                    Edit
                </button>
            </div>
        ),
        [props.openDeed]
    );

    const renderPieChart = useMemo(
        () => (
            <div className="wallet-item pie-chart-container">
                <h3>Assets distribution</h3>
                <div className="pie-chart-item">
                    {distribution && (
                        <PieChart
                            // your data
                            data={distribution}
                            // width and height of the view box
                            viewBoxSize={[100, 100]}
                        />
                    )}
                </div>
                <br></br> <br></br>
            </div>
        ),
        [distribution]
    );

    const keepAlive = async () => {
        if (!publicKey) return;

        if (!props.openDeed) return;

        if (publicKey) {
            await program.rpc
                .keepAlive({
                    accounts: {
                        deed: props.openDeed.publicKey,
                        owner: publicKey,
                    },
                })
                .then((res) => program.provider.connection.confirmTransaction(res))
                .catch(console.log);

            props.refreshDeedData();
        }
    };

    const renderOnChainActivity = useMemo(
        () => (
            <div className="wallet-item">
                <h3>Last recorded on-chain activity</h3>
                <h1>{props.openDeed ? toDate(props.openDeed.lastSeen) : 'NA'}</h1>
                <button
                    onClick={() => {
                        keepAlive();
                        props.getUserBalance();
                    }}
                    className="cta-button confirm-button"
                >
                    Keep alive
                </button>
            </div>
        ),
        [props.openDeed, keepAlive]
    );

    const renderShares = useMemo(
        () => (
            <div className="wallet-item">
                <h3>Left to be shared</h3>
                <h1>{props.openDeed ? props.openDeed.leftToBeShared + '%' : 'NA'}</h1>
            </div>
        ),
        [props]
    );

    const topUp = async (inputValue: number) => {
        if (!publicKey) return;

        if (!props.openDeed) return;

        if (inputValue > 0 && inputValue < parseFloat(props.userBalance)) {
            setTopUpFormIsCorrect(true);

            if (publicKey) {
                const transaction = new Transaction().add(
                    SystemProgram.transfer({
                        fromPubkey: publicKey,
                        toPubkey: props.openDeed.publicKey, // To be replaced with the deed's account public key
                        lamports: inputValue * LAMPORTS_PER_SOL,
                    })
                );

                const signature = await sendTransaction(transaction, connection);

                await connection.confirmTransaction(signature, 'processed');

                props.refreshDeedData();
            }
        } else {
            setTopUpFormIsCorrect(false);
        }
    };

    const withdraw = async (inputValue: number) => {
        if (!publicKey) return;

        if (!props.openDeed) return;

        if (!props.deedBalance) return;

        if (inputValue > 0 && inputValue < props.deedBalance) {
            setWithdrawFormIsCorrect(true);

            if (publicKey) {
                await program.rpc
                    .withdrawDeedLamports(new BN(inputValue * LAMPORTS_PER_SOL), {
                        accounts: {
                            deed: props.openDeed.publicKey,
                            owner: publicKey,
                            systemProgram: SystemProgram.programId,
                        },
                    })
                    .then((res) => program.provider.connection.confirmTransaction(res))
                    .catch(console.log);

                props.refreshDeedData();
            }
        } else {
            setWithdrawFormIsCorrect(false);
        }
    };

    const editWithdrawalPeriod = async (inputValue: number) => {
        if (!publicKey) return;

        if (!props.openDeed) return;

        if (inputValue >= 0) {
            setEditWithdrawalPeriodFormIsCorrect(true);
            /* interact with the program via rpc */
            await program.rpc
                .editWithdrawalPeriod(new BN(inputValue * 3600), {
                    accounts: {
                        deed: props.openDeed.publicKey,
                        owner: props.openDeed.owner,
                    },
                })
                .then((res) => program.provider.connection.confirmTransaction(res))
                .catch(console.log);

            const deedAccount = await program.account.deed.fetch(props.openDeed.publicKey);

            props.setOpenDeed(new Deed(props.openDeed.publicKey, deedAccount));
        } else {
            setEditWithdrawalPeriodFormIsCorrect(false);
        }
    };

    return (
        <div className="wallet-container">
            {props.openDeed && typeof props.openDeed !== 'undefined' ? (
                <Container>
                    <Row>
                        <Col xs={6}>
                            <div className="wallet-item-background">{renderProgramBalance}</div>
                            {props.deedBalance ? (
                                <div>
                                    <TopUpModal
                                        show={topUpModalShow}
                                        onClose={() => setTopUpModalShow(false)}
                                        formIsCorrect={topUpFormIsCorrect}
                                        topUp={topUp}
                                        userBalance={props.userBalance}
                                    />
                                    <WithdrawModal
                                        show={showWithdrawModal}
                                        onClose={() => setWithdrawModalShow(false)}
                                        formIsCorrect={withdrawFormIsCorrect}
                                        withdraw={withdraw}
                                        deedBalance={props.deedBalance}
                                        userBalance={props.userBalance}
                                    />
                                </div>
                            ) : null}
                        </Col>
                        <Col xs={6}>
                            <div className="wallet-item-background">{renderWithdrawalPeriod}</div>
                            <EditWithdrawalPeriodModal
                                show={editWithdrawalPeriodModalShow}
                                onClose={() => setEditWithdrawalPeriodModalShow(false)}
                                formIsCorrect={editWithdrawalPeriodFormIsCorrect}
                                editWithdrawalPeriod={editWithdrawalPeriod}
                                userBalance={props.userBalance}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4}>
                            <div className="wallet-item-background">{renderShares}</div>
                            <div className="wallet-item-background">{renderOnChainActivity}</div>
                        </Col>
                        <Col xs={8}>
                            <div className="wallet-item-background">{renderPieChart}</div>
                        </Col>
                    </Row>
                    <div className="wallet-item-background">{renderAccountName}</div>
                    <DeleteDeedModal
                        onClose={() => setDeleteModalShow(false)}
                        show={showDeleteModal}
                        emergencyList={props.emergencyList}
                        recoveryList={props.recoveryList}
                        deleteDeed={() => deleteDeed(props.openDeed)}
                        userBalance={props.userBalance}
                    />
                </Container>
            ) : (
                <div className="wallet-not-connected-item-background">{renderCreateAccount}</div>
            )}
        </div>
    );
}

export default DeedAccount;

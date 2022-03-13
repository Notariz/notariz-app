import { Deed } from '../../../models';

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
import EditWithdrawalPeriodModal from './Modals/EditWithdrawalPeriod';
import Emojis from '../../utils/Emojis';
import './WalletDashboard.css';
import '../Common.css';

const { SystemProgram, Keypair } = web3;

const opts: ConfirmOptions = {
    commitment: 'processed',
};

const programID = new PublicKey(idl.metadata.address);

function WalletDashboard() {
    const wallet = useWallet();
    const { publicKey, sendTransaction } = wallet;
    const { connection } = useConnection();
    const [userBalance, setUserBalance] = useState('0');
    const [openDeed, setOpenDeed] = useState<Deed | undefined>();
    const [deedBalance, setDeedBalance] = useState<number | null>(0.0);

    const provider = new Provider(connection, wallet as any, opts);

    const program = new Program(idl as any, programID, provider);

    const [topUpModalShow, setTopUpModalShow] = useState(false);
    const [topUpFormIsCorrect, setTopUpFormIsCorrect] = useState(false);

    const [editWithdrawalPeriodModalShow, setEditWithdrawalPeriodModalShow] = useState(false);
    const [editWithdrawalPeriodFormIsCorrect, setEditWithdrawalPeriodFormIsCorrect] = useState(false);

    const myData = useMemo(() => ([
        { title: 'Dogs', value: 100, color: '#fd1d68' },
        { title: 'Cats', value: 50, color: '#ed729b' },
        { title: 'Dragons', value: 15, color: 'purple' },
    ]), []);

    function toDate(timestamp: number) {
        const date = new Date(timestamp * 1000);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return [day, month, year].join('/');
    }

    function fromSecondsToDays(duration: number) {
        return duration / 24 / 3600;
    }

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

    }, [fetchDeeds, program.provider.connection.getAccountInfo]);

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

    const createDeed = useCallback(async () => {
        if (!publicKey || typeof wallet.signTransaction === 'undefined') throw new WalletNotConnectedError();

        if (typeof openDeed !== "undefined") return;

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
        setOpenDeed(new Deed(deedKeypair.publicKey, deedAccount));
    }, [openDeed, program.account.deed, program.provider.connection, program.rpc, provider.wallet.publicKey, publicKey, wallet.signTransaction]);

    const renderCreateAccount = useMemo(
        () => (
            <div className="wallet-item">
                <h3>Create a Notariz account</h3>
                <div className="hint">
                    It looks like you do not have any open deed. Deeds keep track of your interactions with Notariz.
                </div>
                <button onClick={() => createDeed()} className="cta-button confirm-button">
                    Open a deed
                </button>
            </div>
        ),
        [createDeed]
    );

    const renderProgramBalance = useCallback(
        () => (
            <div className="wallet-item">
                <h3>Total deposit</h3>
                <h1>{deedBalance + ' SOL'}</h1>
                <button
                    onClick={() => {
                        setTopUpModalShow(true);
                        getUserBalance();
                    }}
                    className="cta-button confirm-button"
                >
                    Top up
                </button>
                <button className="cta-button delete-button">Withdraw</button>
            </div>
        ),
        [deedBalance, getUserBalance]
    );

    const renderWithdrawalPeriod = useCallback(
        () => (
            <div className="wallet-item">
                <h3>Withdrawal period</h3>
                <h1>{openDeed ? fromSecondsToDays(openDeed.withdrawalPeriod) + ' days' : 'Unknown'}</h1>
                <button onClick={() => setEditWithdrawalPeriodModalShow(true)} className="cta-button confirm-button">
                    Edit
                </button>
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
        [myData]
    );

    const renderOnChainActivity = useMemo(
        () => (
            <div className="wallet-item">
                <h3>Last recorded on-chain activity</h3>
                <h1>{openDeed ? toDate(openDeed.lastSeen) : 'NA'}</h1>
            </div>
        ),
        [openDeed]
    );

    const renderShares = useMemo(
        () => (
            <div className="wallet-item">
                <h3>Shared deposit total</h3>
                <h1>{openDeed ? openDeed.leftToBeShared + '%' : 'NA'}</h1>
            </div>
        ),
        [openDeed]
    );

    const topUp = async (inputValue: number) => {
        if (!publicKey) throw new WalletNotConnectedError();

        if (!openDeed) return;

        if (inputValue > 0 && inputValue <= parseFloat(userBalance)) {
            setTopUpFormIsCorrect(true);

            if (publicKey) {
                const transaction = new Transaction().add(
                    SystemProgram.transfer({
                        fromPubkey: publicKey,
                        toPubkey: openDeed.publicKey, // To be replaced with the deed's account public key
                        lamports: inputValue * LAMPORTS_PER_SOL,
                    })
                );

                const signature = await sendTransaction(transaction, connection);

                await connection.confirmTransaction(signature, 'processed');

                refreshDeedData();
            }
        } else {
            setTopUpFormIsCorrect(false);
        }
    };

    const editWithdrawalPeriod = async (inputValue: number) => {
        if (!publicKey) throw new WalletNotConnectedError();

        if (!openDeed) return;

        if (inputValue >= 2) {
            setEditWithdrawalPeriodFormIsCorrect(true);

            try {
                /* interact with the program via rpc */
                await program.rpc
                    .editWithdrawalPeriod(new BN(inputValue * 24 * 3600), {
                        accounts: {
                            deed: openDeed.publicKey,
                            owner: openDeed.owner,
                        },
                    })
                    .then((res) => program.provider.connection.confirmTransaction(res))
                    .catch(console.log);

                const deedAccount = await program.account.deed.fetch(openDeed.publicKey);

                setOpenDeed(new Deed(openDeed.publicKey, deedAccount));
            } catch (err) {
                console.log('Transaction error: ', err);
            }
        } else {
            setEditWithdrawalPeriodFormIsCorrect(false);
        }
    };

    const deleteDeed = useCallback(
        async (deed: Deed) => {
            if (!publicKey || typeof wallet.signTransaction === 'undefined') throw new WalletNotConnectedError();

            if (!deed) return;

            /* interact with the program via rpc */
            return program.rpc
                .deleteDeed({
                    accounts: {
                        deed: deed.publicKey,
                        owner: provider.wallet.publicKey,
                    }
                })
                .then((res) => program.provider.connection.confirmTransaction(res))
                .catch(console.log);
        },
        [program.provider.connection, program.rpc, provider.wallet.publicKey, wallet.signTransaction, publicKey]
    );

    const renderDeleteDeed = useCallback(() => {
        if (!openDeed) return <></>;

        return (
            <div className="wallet-item">
                <button
                    onClick={() => {
                        deleteDeed(openDeed).then(() => setOpenDeed(undefined));
                    }}
                    className="cta-button confirm-button"
                >
                    Delete deed
                </button>
            </div>
        );
    }, [deleteDeed, openDeed]);

    return (
        <div className="wallet-container">
            {openDeed ? (
                <Container>
                    <Row>
                        <div className="wallet-item-background">
                            <h3>
                                {'Deed account ('}
                                <a
                                    className=""
                                    href={
                                        'https://explorer.solana.com/address/' +
                                        openDeed.publicKey.toString() +
                                        '?cluster=devnet'
                                    }
                                >
                                    {openDeed.publicKey.toString().substring(0, 5) +
                                        '..' +
                                        openDeed.publicKey
                                            .toString()
                                            .substring(openDeed.publicKey.toString().length - 5)}
                                </a>
                                {') '}
                                <i className='fa fa-arrow-rotate'></i>
                            </h3>
                        </div>
                        <Col xs={6}>
                            <div className="wallet-item-background">{renderProgramBalance()}</div>
                            <TopUpModal
                                show={topUpModalShow}
                                onClose={() => setTopUpModalShow(false)}
                                formIsCorrect={topUpFormIsCorrect}
                                topUp={topUp}
                                userBalance={userBalance}
                            />
                        </Col>
                        <Col xs={6}>
                            <div className="wallet-item-background">{renderWithdrawalPeriod()}</div>
                            <EditWithdrawalPeriodModal
                                show={editWithdrawalPeriodModalShow}
                                onClose={() => setEditWithdrawalPeriodModalShow(false)}
                                formIsCorrect={editWithdrawalPeriodFormIsCorrect}
                                editWithdrawalPeriod={editWithdrawalPeriod}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4}>
                            <div className="wallet-item-background">{renderShares}</div>
                            <div className="wallet-item-background">{renderOnChainActivity}</div>
                        </Col>
                        <Col xs={8}>
                            <div className="wallet-item-background">{renderPieChart()}</div>
                        </Col>
                    </Row>
                    <div className="wallet-item-background">{renderDeleteDeed()}</div>
                </Container>
            ) : (
                <div className="wallet-item-background">{renderCreateAccount}</div>
            )}
        </div>
    );
}

export default WalletDashboard;

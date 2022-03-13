import { Deed } from '../../../models';

import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { clusterApiUrl, Connection, Transaction, PublicKey, LAMPORTS_PER_SOL, ConfirmOptions } from '@solana/web3.js';
import { Program, Provider, Wallet, web3 } from '@project-serum/anchor';
import idl from '../../../idl.json';

import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

import { useState, useCallback, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { PieChart } from 'react-minimal-pie-chart';
import TopUpModal from './Modals/TopUpModal';
import './WalletDashboard.css';
import '../Common.css';

const { SystemProgram, Keypair } = web3;

// const arr = Object.values(kp._keypair.secretKey)
// const secret = new Uint8Array(arr)
// const deedKeypair = web3.Keypair.fromSecretKey(secret)

const deedKeypair = web3.Keypair.generate();

const opts: ConfirmOptions = {
    commitment: 'processed',
};

const programID = new PublicKey(idl.metadata.address);

interface Emergency {
    receiver: PublicKey;
    percentage: number;
    claimed_timestamp: BigNumber;
    redeemed_timestamp: BigNumber;
}

interface Recovery {
    receiver: PublicKey;
    redeemed: boolean;
}

function WalletDashboard() {
    const wallet = useWallet();
    const { publicKey, sendTransaction } = wallet;
    const { connection } = useConnection();
    const [userBalance, setUserBalance] = useState('0');
    const [openDeed, setOpenDeed] = useState<Deed>(null);
    const [deedBalance, setDeedBalance] = useState<number | null>(0.0);

    const provider = new Provider(connection, wallet as any, opts);

    const program = new Program(idl as any, programID, provider);

    const [topUpModalShow, setTopUpModalShow] = useState(false);
    const [topUpFormIsCorrect, setTopUpFormIsCorrect] = useState(false);

    const myData = [
        { title: 'Dogs', value: 100, color: '#fd1d68' },
        { title: 'Cats', value: 50, color: '#ed729b' },
        { title: 'Dragons', value: 15, color: 'purple' },
    ];

    function toDate(timestamp: number) {
        var date = new Date(timestamp * 1000);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        return [day, month, year].join('/');
    }

    function fromSecondsToDays(duration: number) {
        return duration / 24 / 3600;
    }

    const fetchDeeds = async () => {
        if (!publicKey || typeof wallet.signTransaction === 'undefined') throw new WalletNotConnectedError();

        const provider = new Provider(connection, wallet as any, opts);

        const program = new Program(idl as any, programID, provider);

        const deeds = await program.account.deed.all();

        return deeds.map((deed) => new Deed(deed.publicKey, deed.account));
    };

    console.log(fetchDeeds().then(console.log));

    const getUserBalance = useCallback(() => {
        if (!publicKey) throw new WalletNotConnectedError();

        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

        connection
            .getBalance(publicKey)
            .then((res) => setUserBalance((res / LAMPORTS_PER_SOL).toFixed(2)))
            .catch(() => alert('Cannot fetch wallet balance!'));

        return userBalance;
    }, [publicKey, connection, userBalance]);

    const renderCreateAccount = useCallback(
        () => (
            <div className="wallet-item">
                <h3>Create a Notariz account</h3>
                <div className="hint">
                    It looks like you do not have any open deed. Deeds keep track of your Notariz data.
                </div>
                <button onClick={() => createDeed()} className="cta-button confirm-button">
                    Open a deed
                </button>
            </div>
        ),
        [openDeed]
    );

    const renderProgramBalance = useCallback(
        () => (
            <div className="wallet-item">
                <h3>Total deposit</h3>
                <h1>{deedBalance +' SOL'}</h1>
                <button
                    onClick={() => (setTopUpModalShow(true), getUserBalance())}
                    className="cta-button confirm-button"
                >
                    Top up
                </button>
                <button className="cta-button delete-button">Withdraw</button>
            </div>
        ),
        [openDeed, deedBalance]
    );

    const renderWithdrawalPeriod = useCallback(
        () => (
            <div className="wallet-item">
                <h3>Withdrawal period</h3>
                <h1>{fromSecondsToDays(openDeed.withdrawalPeriod) + ' days'}</h1>
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
                <h1>{toDate(openDeed.lastSeen)}</h1>
            </div>
        ),
        [openDeed]
    );

    const renderShares = useCallback(
        () => (
            <div className="wallet-item">
                <h3>Shared deposit total</h3>
                <h1>{openDeed.leftToBeShared + '%'}</h1>
            </div>
        ),
        [openDeed]
    );

    const topUp = async (inputValue: number) => {
        if (!publicKey) throw new WalletNotConnectedError();

        const program = new Program(idl as any, programID, provider);

        if (inputValue > 0 && inputValue <= parseFloat(userBalance)) {
            setTopUpFormIsCorrect(true);

            if (publicKey) {
                const transaction = new Transaction().add(
                    SystemProgram.transfer({
                        fromPubkey: publicKey,
                        toPubkey: deedKeypair.publicKey, // To be replaced with the deed's account public key
                        lamports: inputValue * LAMPORTS_PER_SOL,
                    })
                );

                const signature = await sendTransaction(transaction, connection);

                await connection.confirmTransaction(signature, 'processed');

                let deedAccount = await program.account.deed.fetch(deedKeypair.publicKey);
                setOpenDeed(new Deed(deedKeypair.publicKey, deedAccount));

                let deedAccountBalance = await program.provider.connection
                    .getAccountInfo(deedKeypair.publicKey)
                    .then((res) => res?.lamports)
                    .catch(console.log)
                    ;

                if (deedAccountBalance) {
                    setDeedBalance(deedAccountBalance / LAMPORTS_PER_SOL);
                }
            }
        } else {
            setTopUpFormIsCorrect(false);
        }
    };

    const createDeed = async () => {
        if (!publicKey || typeof wallet.signTransaction === 'undefined') throw new WalletNotConnectedError();

        console.log('Account key pair 1: ', deedKeypair);

        try {
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

            let deedAccount = await program.account.deed.fetch(deedKeypair.publicKey);
            console.log('Deed account: ', deedAccount);
            setOpenDeed(new Deed(deedKeypair.publicKey, deedAccount));
        } catch (err) {
            console.log('Transaction error: ', err);
        }
    };

    const renderDeleteDeed = async () => {};

    /* useEffect(() => setOpenDeed(TEST_DEED), [PublicKey]); */

    return (
        <div className="wallet-container">
            {openDeed !== null ? (
                <Container>
                    <Row>
                        <Col xs={7}>
                            <div className="wallet-item-background">{renderProgramBalance()}</div>
                            <TopUpModal
                                show={topUpModalShow}
                                onClose={() => setTopUpModalShow(false)}
                                formIsCorrect={topUpFormIsCorrect}
                                topUp={topUp}
                                userBalance={userBalance}
                            />
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
                <div className="wallet-item-background">{renderCreateAccount()}</div>
            )}
        </div>
    );
}

export default WalletDashboard;

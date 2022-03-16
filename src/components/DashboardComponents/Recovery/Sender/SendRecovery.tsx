import { Deed } from '../../../../models';
import { Recovery } from '../../../../models';

import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { clusterApiUrl, Connection, Transaction, PublicKey, LAMPORTS_PER_SOL, ConfirmOptions } from '@solana/web3.js';
import { Program, Provider, Wallet, web3, BN } from '@project-serum/anchor';
import idl from '../../../../idl.json';

import { useCallback, useEffect, useMemo, useState } from 'react';
import AddRecoverySendingModal from './Modals/AddRecoverySendingModal';
import DeleteRecoveryModal from './Modals/DeleteRecoveryModal';
import './SendRecovery.css';

const { SystemProgram, Keypair } = web3;

const opts: ConfirmOptions = {
    commitment: 'processed',
};

const programID = new PublicKey(idl.metadata.address);

function SendRecovery(props: {
    openDeed: Deed | undefined;
    setOpenDeed: (deed: Deed | undefined) => void;
    recoveryList: Recovery[] | undefined;
    setRecoveryList: (emergencies: Recovery[] | undefined) => void;
    refreshDeedData: () => any;
    refreshRecoveriesData: () => any;
    deedBalance: number | undefined;
}) {
    const wallet = useWallet();
    const { publicKey, sendTransaction } = wallet;
    const { connection } = useConnection();
    const provider = new Provider(connection, wallet as any, opts);
    const program = new Program(idl as any, programID, provider);

    const [showAddModal, setAddModalShow] = useState(false);
    const [showDeleteModal, setDeleteModalShow] = useState(false);
    const [isMentioned, setIsMentioned] = useState(false);
    const [selectedReceiver, setSelectedReceiver] = useState<PublicKey | undefined>();
    const [recoveryKeypair, setRecoveryKeypair] = useState(web3.Keypair.generate());

    const selectedRecovery = props.recoveryList?.filter(function (recovery) {
        if (!selectedReceiver) return;

        return recovery.receiver === selectedReceiver;
    });

    const renderDescription = useMemo(
        () => (
            <div className="recovery-item-background">
                <div className="recovery-item">
                    <h3>Your recovery addresses will lie here once added.</h3>
                    <p className="hint">Once set, a recovery address can redeem 100% of your total deposit.</p>
                </div>
            </div>
        ),
        []
    );

    const renderRecoveryList = useMemo(
        () => (
            <div>
                {props.recoveryList && props.deedBalance &&
                    props.recoveryList.length > 0 &&
                    props.recoveryList.map((value, index) => (
                        <div key={index} className="recovery-item-background">
                            <div className="recovery-item">
                                <h3>{'Recovery address ' + (index + 1)}</h3>
                                <p>
                                    {'Me '}

                                    <span>
                                        <i className="fa fa-arrow-right"></i>
                                    </span>
                                    {' ' + (props.deedBalance ? props.deedBalance : null) + ' SOL '}
                                    <span>
                                        <i className="fa fa-arrow-right"></i>
                                    </span>

                                    {' ' +
                                        value.receiver.toString().substring(0, 5) +
                                        '..' +
                                        value.receiver.toString().substring(value.receiver.toString().length - 5) +
                                        ' '}
                                </p>
                                <button
                                    onClick={() => (setSelectedReceiver(value.receiver), setDeleteModalShow(true))}
                                    className="cta-button delete-button"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
        ),
        [props.recoveryList, props.deedBalance]
    );

    const addRecovery = async (inputValue: Recovery) => {
        if (!publicKey) throw new WalletNotConnectedError();

        if (!props.openDeed) return;

        if (!props.recoveryList) return;

        const recovery = props.recoveryList.filter(function (value) {
            return value.receiver !== inputValue.receiver;
        });

        if (!recovery) return setIsMentioned(true);

        await program.rpc
            .addRecovery(inputValue.receiver, {
                accounts: {
                    recovery: recoveryKeypair.publicKey,
                    deed: props.openDeed.publicKey,
                    owner: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                },
                signers: [recoveryKeypair],
            })
            .then((res) => program.provider.connection.confirmTransaction(res))
            .catch(console.log);

        await program.account.recovery
            .fetch(recoveryKeypair.publicKey)
            .then((account) => {
                props.recoveryList
                    ? props.setRecoveryList([
                          ...props.recoveryList,
                          new Recovery(recoveryKeypair.publicKey, account),
                      ])
                    : props.setRecoveryList([new Recovery(recoveryKeypair.publicKey, account)]);
            })
            .catch(console.log);

        setIsMentioned(false);

        props.refreshDeedData();
        props.refreshRecoveriesData();
    };

    const deleteRecovery = async () => {
        if (!props.recoveryList) return;

        if (!selectedRecovery) return;

        const recovery = selectedRecovery[0];

        if (!props.openDeed) return;

        await program.rpc.deleteRecovery({
            accounts: {
                recovery: recovery.publicKey,
                deed: props.openDeed.publicKey,
                owner: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
            },
        });

        props.refreshRecoveriesData();

        const newRecoveries = props.recoveryList.filter(function (r) {
            return r != recovery;
        });

        props.setRecoveryList(newRecoveries);
    };

    return (
        <div className="recovery-container">
            <button
                onClick={() => {
                    setRecoveryKeypair(web3.Keypair.generate());
                    setAddModalShow(true);
                }}
                className="cta-button confirm-button"
            >
                New recovery address
            </button>
            {props.openDeed ? (
                <div>
                    <AddRecoverySendingModal
                        isMentioned={isMentioned}
                        addRecovery={addRecovery}
                        onClose={() => {
                            setAddModalShow(false);
                        }}
                        show={showAddModal}
                        openDeed={props.openDeed}
                        recoveryPk={recoveryKeypair.publicKey}
                    />
                    <DeleteRecoveryModal
                        onClose={() => setDeleteModalShow(false)}
                        show={showDeleteModal}
                        deleteRecovery={deleteRecovery}
                    />
                </div>
            ) : null}
            <div className="recovery-list">
                {props.recoveryList && props.recoveryList.length > 0 ? renderRecoveryList : renderDescription}
            </div>
        </div>
    );
}

export default SendRecovery;

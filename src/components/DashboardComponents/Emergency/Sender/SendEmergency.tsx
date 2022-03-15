import { Emergency } from '../../../../models';
import { Deed } from '../../../../models';

import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { clusterApiUrl, Connection, Transaction, PublicKey, LAMPORTS_PER_SOL, ConfirmOptions } from '@solana/web3.js';
import { Program, Provider, Wallet, web3, BN } from '@project-serum/anchor';
import idl from '../../../../idl.json';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Countdown from 'react-countdown';
import AddEmergencyReceiverModal from './Modals/AddEmergencyReceiverModal';
import DeleteEmergencyReceiverModal from './Modals/DeleteEmergencyReceiverModal';
import EditEmergencyReceiverModal from './Modals/EditEmergencyReceiverModal';
import Emojis from '../../../utils/Emojis';
import './SendEmergency.css';
import '../../Common.css';

const { SystemProgram, Keypair } = web3;

const opts: ConfirmOptions = {
    commitment: 'processed',
};

const programID = new PublicKey(idl.metadata.address);
interface EmergencyAlias {
    receiver: PublicKey;
    alias: string;
}

const WITHDRAWAL_PERIOD = 4;

const WALLET_BALANCE = 1500;

function SendEmergency(props: {
    emergencyList: Emergency[] | undefined;
    setEmergencyList: (emergencies: Emergency[] | undefined) => void;
    openDeed: Deed | undefined;
    setOpenDeed: (deed: Deed | undefined) => void;
    deedBalance: number | undefined;
    refreshDeedData: () => any;
    refreshEmergenciesData: () => any;
    setNotificationCounter: (number: number) => void;
}) {
    const wallet = useWallet();
    const { publicKey, sendTransaction } = wallet;
    const { connection } = useConnection();

    const [aliasList, setAliasList] = useState<EmergencyAlias[]>(() => {
        const initialValue = JSON.parse(localStorage.getItem('aliasList') || '[{"receiver": "", "alias": ""}]');
        return initialValue;
    });

    const [showAddModal, setAddModalShow] = useState(false);
    const [showDeleteModal, setDeleteModalShow] = useState(false);
    const [showEditModal, setEditModalShow] = useState(false);
    const [formIsCorrect, setFormIsCorrect] = useState(false);
    const [selectedReceiver, setSelectedReceiver] = useState<PublicKey | undefined>(undefined);
    const [selectedField, setSelectedField] = useState('');
    const [emergencyIsAlreadyMentioned, setEmergencyIsAlreadyMentioned] = useState(false);
    const [emergencyKeypair, setEmergencyKeypair] = useState(web3.Keypair.generate());

    const provider = new Provider(connection, wallet as any, opts);
    const program = new Program(idl as any, programID, provider);

    const claimingEmergencies = props.emergencyList?.filter(function (emergency) {
        return emergency.claimedTimestamp > 0;
    });

    const selectedEmergency = props.emergencyList
        ? props.emergencyList.filter(function (emergency) {
              return emergency.receiver === selectedReceiver;
          })
        : null;

    const renderDescription = useMemo(
        () => (
            <div className="emergency-item-background">
                <h3>Your emergencies will lie here.</h3>
            </div>
        ),
        []
    );

    const renderNoOpenDeedDescription = useMemo(
        () => (
            <div className="emergency-item-background">
                <h3>No open deed.</h3>
                <p>
                    <div className="hint">Please open a deed to add emergency addresses.</div>
                </p>
            </div>
        ),
        []
    );

    const addEmergency = async (inputValues: Emergency) => {
        if (!publicKey) throw new WalletNotConnectedError();

        if (!props.openDeed) return;

        if (inputValues.percentage > 0 && inputValues.percentage <= props.openDeed.leftToBeShared) {
            const emergency = props.emergencyList?.filter(function (value) {
                return value.receiver === inputValues.receiver;
            });

            console.log(
                'Emergency pk before form:',
                emergencyKeypair.publicKey);
            console.log('Emergency pk after form: ',
                inputValues.publicKey
            );
            console.log('Receiver pk after form:', inputValues.receiver);

            setFormIsCorrect(true);

            if (!emergency) return setEmergencyIsAlreadyMentioned(true);

            await program.rpc
                .addEmergency(inputValues.receiver, inputValues.percentage, {
                    accounts: {
                        emergency: emergencyKeypair.publicKey,
                        deed: props.openDeed.publicKey,
                        owner: provider.wallet.publicKey,
                        systemProgram: SystemProgram.programId,
                    },
                    signers: [emergencyKeypair],
                })
                .then((res) => program.provider.connection.confirmTransaction(res))
                .catch(console.log);

            await program.account.emergency
                .fetch(emergencyKeypair.publicKey)
                .then((account) => {
                    props.emergencyList
                        ? props.setEmergencyList([
                              ...props.emergencyList,
                              new Emergency(emergencyKeypair.publicKey, account),
                          ])
                        : props.setEmergencyList([new Emergency(emergencyKeypair.publicKey, account)]);
                })
                .catch(console.log);

            setAliasList([...aliasList, { receiver: inputValues.receiver, alias: '' }]);
            setEmergencyIsAlreadyMentioned(false);

            props.refreshDeedData();
            props.refreshEmergenciesData();
        } else {
            setFormIsCorrect(false);
        }
    };

    const editEmergency = async (inputValue: any) => {
        if (!selectedEmergency) return;

        const id = selectedEmergency[0].receiver;
        const newEmergencies = props.emergencyList ? [...props.emergencyList] : props.emergencyList;

        if (!newEmergencies) return;

        switch (selectedField) {
            case 'alias':
                if (inputValue.length <= 15) {
                    setFormIsCorrect(true);
                    newEmergencies.map((value) =>
                        value.receiver === id ? setAliasList([...aliasList, { receiver: id, alias: inputValue }]) : null
                    );
                } else {
                    setFormIsCorrect(false);
                }
                break;
            case 'share':
                if (inputValue > 0 && inputValue <= 100 && Math.round(inputValue) == inputValue) {
                    setFormIsCorrect(true);
                    newEmergencies.map((value) =>
                        value.receiver === id ? (value.percentage = inputValue) : value.percentage
                    );
                    props.setEmergencyList(newEmergencies);
                } else {
                    setFormIsCorrect(false);
                }
                break;
            case 'cancel':
                setFormIsCorrect(true);
                newEmergencies.map((value) =>
                    value.claimedTimestamp > 0 ? (value.claimedTimestamp = 0) : value.claimedTimestamp
                );
                props.setEmergencyList(newEmergencies);
                break;
        }
    };

    const deleteEmergency = async () => {
        if (!props.openDeed) return;

        if (!selectedEmergency) return;

        const emergency = selectedEmergency[0];

        if (!props.emergencyList) return;

        await program.rpc.deleteEmergency({
            accounts: {
                emergency: emergency.publicKey,
                deed: props.openDeed.publicKey,
                owner: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
            },
        });

        const newEmergencies = props.emergencyList.filter(function (e) {
            return e.receiver != emergency.receiver;
        });

        props.setEmergencyList(newEmergencies);
    };

    useEffect(() => {
        localStorage.setItem('aliasList', JSON.stringify(aliasList));
    }, [aliasList]);

    const renderEmergencyList = useMemo(
        () => (
            <div>
                {props.emergencyList?.map((value, index) => (
                    <div key={value.receiver.toString()} className="emergency-item-background">
                        <div className="emergency-item">
                            <h3>{'Emergency ' + (index + 1)}</h3>
                            <p>
                                {'Me '}
                                <i className="fa fa-arrow-right"></i>
                                <span
                                    onClick={() => {
                                        setEditModalShow(true);
                                        setSelectedField('percentage');
                                        setSelectedReceiver(value.receiver);
                                        console.log(selectedReceiver);
                                    }}
                                    className="receiver-text"
                                >
                                    {props.deedBalance
                                        ? ' ' +
                                          parseFloat(((props.deedBalance * value.percentage) / 100).toString()).toFixed(
                                              5
                                          ) +
                                          ' SOL '
                                        : null}
                                </span>
                                <i className="fa fa-arrow-right"></i>

                                <span
                                    onClick={() => {
                                        setEditModalShow(true);
                                        setSelectedField('alias');
                                        setSelectedReceiver(value.receiver);
                                    }}
                                    className="receiver-text"
                                >
                                    {aliasList.map((alias, index) => (
                                        <span key={index.toString()} className="receiver-name">
                                            {alias.receiver === value.receiver && ' ' + alias.alias + ' '}
                                        </span>
                                    ))}
                                    {' ' +
                                        value.receiver.toString().substring(0, 5) +
                                        '..' +
                                        value.receiver.toString().substring(value.receiver.toString().length - 5) +
                                        ' '}
                                </span>
                            </p>

                            <button
                                onClick={() => {
                                    setEditModalShow(true);
                                    setSelectedField('cancel');
                                    setSelectedReceiver(value.receiver);
                                }}
                                className="cta-button status-button"
                                disabled={value.claimedTimestamp === 0}
                            >
                                {value.claimedTimestamp > 0 ? 'Claimed' : 'Unclaimed'}
                            </button>
                            {value.claimedTimestamp > 0 ? (
                                <button className="cta-button status-button">
                                    <div>
                                        <Emojis symbol="⏳" label="hourglass" />
                                        <Countdown date={Date.now() + WITHDRAWAL_PERIOD * 3600 * 24 * 1000} />
                                    </div>
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setDeleteModalShow(true);
                                        setSelectedReceiver(value.receiver);
                                    }}
                                    className="cta-button delete-button"
                                >
                                    DELETE
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        ),
        [props, selectedReceiver, aliasList]
    );

    useEffect(() => {
        if (claimingEmergencies) props.setNotificationCounter(claimingEmergencies.length);
    }, [claimingEmergencies, props]);

    return (
        <div className="emergency-container">
            {props.openDeed ? (
                <div>
                    <button
                        onClick={() => {
                            setAddModalShow(true);
                            setEmergencyKeypair(web3.Keypair.generate());
                        }}
                        className="cta-button confirm-button"
                    >
                        ADD A RECEIVING ADDRESS
                    </button>
                    {props.emergencyList && props.deedBalance ? (
                        <div>
                            <AddEmergencyReceiverModal
                                onClose={() => setAddModalShow(false)}
                                show={showAddModal}
                                addEmergency={addEmergency}
                                emergencyPk={emergencyKeypair.publicKey}
                                formIsCorrect={formIsCorrect}
                                emergencyIsAlreadyMentioned={emergencyIsAlreadyMentioned}
                                openDeed={props.openDeed}
                            />
                            <DeleteEmergencyReceiverModal
                                onClose={() => setDeleteModalShow(false)}
                                show={showDeleteModal}
                                deleteEmergency={deleteEmergency}
                                selectedField={selectedField}
                            />
                            {selectedReceiver ? (
                                <EditEmergencyReceiverModal
                                    onClose={() => {
                                        setEditModalShow(false);
                                    }}
                                    show={showEditModal}
                                    editEmergency={editEmergency}
                                    formIsCorrect={formIsCorrect}
                                    selectedField={selectedField}
                                    selectedReceiver={selectedReceiver}
                                />
                            ) : null}
                        </div>
                    ) : (
                        'null'
                    )}
                    <div className="emergency-list">
                        {(props.emergencyList && renderEmergencyList) || renderDescription}
                    </div>
                </div>
            ) : (
                <div>{renderNoOpenDeedDescription}</div>
            )}
        </div>
    );
}

export default SendEmergency;

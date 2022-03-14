import { Emergency } from '../../../../models';

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

interface EmergencyDetails {
    receiver: string;
    share: number;
    claim_request_timestamp: number;
    redeem_request_timestamp: number;
}

interface EmergencyAlias {
    receiver: string;
    alias: string;
}

const WITHDRAWAL_PERIOD = 4;

const TEST_EMERGENCY_LIST: EmergencyDetails[] = [];

const TEST_ALIAS_LIST: EmergencyAlias[] = [];

const WALLET_BALANCE = 1500;

function SendEmergency(props: { setNotificationCounter: (number: number) => void }) {
    const wallet = useWallet();
    const { publicKey, sendTransaction } = wallet;
    const { connection } = useConnection();

    const [showAddModal, setAddModalShow] = useState(false);
    const [showDeleteModal, setDeleteModalShow] = useState(false);
    const [showEditModal, setEditModalShow] = useState(false);
    const [emergencyList, setEmergencyList] = useState<EmergencyDetails[]>([]);
    const [aliasList, setAliasList] = useState<EmergencyAlias[]>(() => {
        const initialValue = JSON.parse(localStorage.getItem('aliasList') || '[{"receiver": "", "alias": ""}]');
        return initialValue;
    });
    const [formIsCorrect, setFormIsCorrect] = useState(false);
    const [selectedReceiver, setSelectedReceiver] = useState('');
    const [selectedField, setSelectedField] = useState('');
    const [emergencyIsMentioned, setEmergencyIsMentioned] = useState(false);

    const provider = new Provider(connection, wallet as any, opts);

    const program = new Program(idl as any, programID, provider);

    const fetchEmergencies = useCallback(() => {
        if (!publicKey) throw new WalletNotConnectedError();

        return program.account.emergency
            .all([
                {
                    memcmp: {
                        offset: 40, // Discriminator.
                        bytes: publicKey.toBase58(),
                    },
                },
            ])
            .then((emergencies) => {
                return emergencies.length > 0 ? new Emergency(emergencies[0].publicKey, emergencies[0].account) : undefined;
            });
    }, [publicKey, program.account.deed]);

    var claimingEmergencies = emergencyList.filter(function (emergency) {
        return emergency.claim_request_timestamp > 0 && emergency.redeem_request_timestamp === 0;
    });

    var selectedEmergency = emergencyList.filter(function (emergency) {
        return emergency.receiver === selectedReceiver;
    });

    
    const renderDescription = useMemo(
        () => (
            <div className="emergency-item">
                <h3>Your emergencies will lie here.</h3>
            </div>
        ),
        [emergencyList]
    );

    const addEmergency = async (inputValues: EmergencyDetails) => {
        if (
            inputValues.receiver.length >= 32 &&
            inputValues.receiver.length <= 44 &&
            inputValues.share > 0 &&
            inputValues.share <= 100 &&
            inputValues.share == Math.round(inputValues.share)
        ) {
            var emergency = emergencyList.filter(function (value) {
                return value.receiver === inputValues.receiver;
            });

            setFormIsCorrect(true);
            emergency.length > 0
                ? setEmergencyIsMentioned(true)
                : (setEmergencyList([...emergencyList, inputValues]),
                  setAliasList([...aliasList, { receiver: inputValues.receiver, alias: '' }]),
                  setEmergencyIsMentioned(false));
        } else {
            setFormIsCorrect(false);
        }
    };

    const editEmergency = async (inputValue: any) => {
        const id = selectedEmergency[0].receiver;
        const newEmergencies = [...emergencyList];

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
                    newEmergencies.map((value) => (value.receiver === id ? (value.share = inputValue) : value.share));
                    setEmergencyList(newEmergencies);
                } else {
                    setFormIsCorrect(false);
                }
                break;
            case 'cancel':
                setFormIsCorrect(true);
                newEmergencies.map((value) =>
                    value.claim_request_timestamp > 0 && value.redeem_request_timestamp === 0
                        ? (value.claim_request_timestamp = 0)
                        : value.claim_request_timestamp
                );
                setEmergencyList(newEmergencies);
                break;
        }
    };

    const deleteEmergency = async () => {
        const id = selectedEmergency[0].receiver;
        const newEmergencies = emergencyList.filter(function (emergency) {
            return emergency.receiver != id;
        });

        setEmergencyList(newEmergencies);
    };

    useEffect(() => {
        setEmergencyList(TEST_EMERGENCY_LIST);
    }, [PublicKey]);

    useEffect(() => {
        localStorage.setItem('aliasList', JSON.stringify(aliasList));
    }, [aliasList]);

    const renderEmergencyList = useMemo(
        () => (
            <div>
                {emergencyList.map((value, index) => (
                    <div key={value.receiver} className="emergency-item-background">
                        <div className="emergency-item">
                            <h3>{'Emergency ' + (index + 1)}</h3>
                            <p>
                                {'Me '}
                                <i className="fa fa-arrow-right"></i>
                                <span
                                    onClick={() => {
                                        setEditModalShow(true);
                                        setSelectedField('share');
                                        setSelectedReceiver(value.receiver);
                                    }}
                                    className="receiver-text"
                                >
                                    {' ' + (WALLET_BALANCE * value.share) / 100 + ' SOL '}
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

                                    {' ' + value.receiver.substring(0, 5) +
                                        '...' +
                                        value.receiver.substring(value.receiver.length - 5) +
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
                                disabled={value.claim_request_timestamp === 0 || value.redeem_request_timestamp > 0}
                            >
                                {value.claim_request_timestamp > 0
                                    ? value.redeem_request_timestamp > 0
                                        ? (<div>{'Sent'}</div>)
                                        : ('Claimed')
                                    : 'Unclaimed'}
                            </button>
                            {value.claim_request_timestamp > 0 && value.redeem_request_timestamp === 0 ? (
                                <button className="cta-button status-button">
                                    <div>
                                        <Emojis symbol="⏳" label="hourglass" />
                                        <Countdown date={Date.now() + WITHDRAWAL_PERIOD * 3600 * 24 * 1000} />
                                    </div>
                                </button>
                            ) : null}
                            {value.claim_request_timestamp === 0 ? (
                                <button
                                    onClick={() => {
                                        setDeleteModalShow(true);
                                        setSelectedReceiver(value.receiver);
                                    }}
                                    className="delete-button"
                                >
                                    DELETE
                                </button>
                            ) : null}
                        </div>
                    </div>
                ))}
            </div>
        ),
        [emergencyList, aliasList]
    );

    useEffect(() => {
        props.setNotificationCounter(claimingEmergencies.length);
    }, [claimingEmergencies.length]);

    return (
        <div className="emergency-container">
            <button onClick={() => setAddModalShow(true)} className="cta-button confirm-button">
                ADD A RECEIVING ADDRESS
            </button>
            <AddEmergencyReceiverModal
                onClose={() => setAddModalShow(false)}
                show={showAddModal}
                addEmergency={addEmergency}
                formIsCorrect={formIsCorrect}
                emergencyIsMentioned={emergencyIsMentioned}
            />
            <DeleteEmergencyReceiverModal
                onClose={() => setDeleteModalShow(false)}
                show={showDeleteModal}
                deleteEmergency={deleteEmergency}
                selectedField={selectedField}
            />
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
            <div className="emergency-list">
                {(emergencyList.length > 0 && renderEmergencyList) || renderDescription}
            </div>
        </div>
    );
}

export default SendEmergency;

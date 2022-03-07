import { useCallback, useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import AddModal from './Modals/AddModal';
import DeleteModal from './Modals/DeleteModal';
import EditModal from './Modals/EditModal';
import Emojis from '../../../utils/Emojis';
import './Emergency.css';
import '../../Common.css';
import { PublicKey } from '@solana/web3.js';

interface EmergencyDetails {
    receiver: string;
    percentage: number;
    claim_request_timestamp: number;
    redeem_request_timestamp: number;
}

interface EmergencyAlias {
    receiver: string;
    alias: string;
}

const WITHDRAWAL_PERIOD = 4;

const TEST_EMERGENCY_LIST: EmergencyDetails[] = [
    {
        receiver: 'JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB',
        percentage: 30,
        claim_request_timestamp: 30,
        redeem_request_timestamp: 0   
    },
    {
        receiver: '3VQwtcntVQN1mj1MybQw8qK7Li3KNrrgNskSQwZAPGNr',
        percentage: 20,
        claim_request_timestamp: 40,
        redeem_request_timestamp: 50  
    },
    {
        receiver: '2V7t5NaKY7aGkwytCWQgvUYZfEr9XMwNChhJEakTExk6',
        percentage: 17,
        claim_request_timestamp: 0,
        redeem_request_timestamp: 0  
    },
    {
        receiver: '7KVswB9vkCgeM3SHP7aGDijvdRAHK8P5wi9JXViCrtYh',
        percentage: 5,
        claim_request_timestamp: 0,
        redeem_request_timestamp: 0  
    },
];

const TEST_ALIAS_LIST: EmergencyAlias[] = [
    
];

const WALLET_BALANCE = 1500;

function Emergency(props: { setNotificationCounter: (number: number) => void }) {
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

    var claimingEmergencies = emergencyList.filter(function (emergency) {
        return emergency.claim_request_timestamp > 0 && emergency.redeem_request_timestamp === 0;
    });

    var selectedEmergency = emergencyList.filter(function (emergency) {
        return emergency.receiver === selectedReceiver;
    });

    const renderDescription = useCallback(
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
            inputValues.percentage > 0 &&
            inputValues.percentage <= 100 &&
            inputValues.percentage == Math.round(inputValues.percentage)
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
            case 'percentage':
                if (inputValue > 0 && inputValue <= 100 && Math.round(inputValue) == inputValue) {
                    setFormIsCorrect(true);
                    newEmergencies.map((value) =>
                        value.receiver === id ? (value.percentage = inputValue) : value.percentage
                    );
                    setEmergencyList(newEmergencies);
                } else {
                    setFormIsCorrect(false);
                }
                break;
            case 'cancel':
                setFormIsCorrect(true);
                newEmergencies.map((value) =>
                    value.claim_request_timestamp > 0 && value.redeem_request_timestamp === 0 ? (value.claim_request_timestamp = 0) : value.claim_request_timestamp
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

    const renderEmergencyList = useCallback(
        () => (
            <div className="emergency-list">
                {emergencyList.map((value, index) => (
                    <div className="emergency-item-background">
                        <div key={index.toString()} className="emergency-item">
                            <h3>{'Emergency ' + (index + 1)}</h3>
                            <p>
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
                                            {alias.receiver === value.receiver && alias.alias + ' '}
                                        </span>
                                    ))}

                                    {value.receiver.substring(0, 5) +
                                        '...' +
                                        value.receiver.substring(value.receiver.length - 5) +
                                        ' '}
                                </span>
                                <i className="fa fa-arrow-left"></i>
                                <span
                                    onClick={() => {
                                        setEditModalShow(true);
                                        setSelectedField('percentage');
                                        setSelectedReceiver(value.receiver);
                                    }}
                                    className="receiver-text"
                                >
                                    {' ' + (WALLET_BALANCE * value.percentage) / 100}
                                </span>
                                {' SOL '}
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
                                {value.claim_request_timestamp > 0 ? (value.redeem_request_timestamp > 0 ? 'Redeemed' : 'Claimed') : 'Unclaimed'}
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
                ADD AN EMERGENCY ADDRESS
            </button>
            <AddModal
                onClose={() => setAddModalShow(false)}
                show={showAddModal}
                addEmergency={addEmergency}
                formIsCorrect={formIsCorrect}
                emergencyIsMentioned={emergencyIsMentioned}
            />
            <DeleteModal
                onClose={() => setDeleteModalShow(false)}
                show={showDeleteModal}
                deleteEmergency={deleteEmergency}
                selectedField={selectedField}
            />
            <EditModal
                onClose={() => {
                    setEditModalShow(false);
                }}
                show={showEditModal}
                editEmergency={editEmergency}
                formIsCorrect={formIsCorrect}
                selectedField={selectedField}
                selectedReceiver={selectedReceiver}
            />
            {(emergencyList.length > 0 && renderEmergencyList()) || renderDescription()}
        </div>
    );
}

export default Emergency;

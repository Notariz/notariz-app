import { useCallback, useEffect, useState } from 'react';
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
    delay: number;
    status: string;
    timestamp: number;
}

interface EmergencyAlias {
    receiver: string;
    alias: string;
}

const TEST_EMERGENCY_LIST: EmergencyDetails[] = [
    {
        receiver: 'JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB',
        percentage: 30,
        delay: 4,
        status: 'claimed',
        timestamp: 300,
    },
    {
        receiver: '3VQwtcntVQN1mj1MybQw8qK7Li3KNrrgNskSQwZAPGNr',
        percentage: 20,
        delay: 2,
        status: 'claimed',
        timestamp: 300,
    },
    {
        receiver: '2V7t5NaKY7aGkwytCWQgvUYZfEr9XMwNChhJEakTExk6',
        percentage: 17,
        delay: 3,
        status: 'redeemed',
        timestamp: 0,
    },
    {
        receiver: '7KVswB9vkCgeM3SHP7aGDijvdRAHK8P5wi9JXViCrtYh',
        percentage: 5,
        delay: 7,
        status: 'unclaimed',
        timestamp: 0,
    },
];

const TEST_ALIAS_LIST: EmergencyAlias[] = [
    {
        receiver: '7KVswB9vkCgeM3SHP7aGDijvdRAHK8P5wi9JXViCrtYh',
        alias: 'Carol'
    },
];

const WALLET_BALANCE = 1500;

function Emergency(props: { setNotificationCounter: (number: number) => void }) {
    const [showAddModal, setAddModalShow] = useState(false);
    const [showDeleteModal, setDeleteModalShow] = useState(false);
    const [showEditModal, setEditModalShow] = useState(false);
    const [emergencyList, setEmergencyList] = useState<EmergencyDetails[]>([]);
    const [aliasList, setAliasList] = useState<EmergencyAlias[]>(() => {
        const initialValue = JSON.parse(localStorage.getItem("aliasList") || "");
        return initialValue;
    });
    const [formIsCorrect, setFormIsCorrect] = useState(false);
    const [selectedReceiver, setSelectedReceiver] = useState('');
    const [selectedField, setSelectedField] = useState('');
    const [emergencyIsMentioned, setEmergencyIsMentioned] = useState(false);

    var claimingEmergencies = emergencyList.filter(function (emergency) {
        return emergency.status === 'claimed';
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

    const renderItemField = useCallback(
        (claimed: boolean) => <span>{claimed === true ? 'in' : 'after'}</span>,
        [emergencyList]
    );

    const addEmergency = async (inputValues: EmergencyDetails) => {
        if (
            inputValues.receiver.length >= 32 &&
            inputValues.receiver.length <= 44 &&
            inputValues.percentage > 0 &&
            inputValues.percentage <= 100 &&
            inputValues.delay >= 1 &&
            inputValues.delay == Math.round(inputValues.delay) &&
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
                        value.receiver === id
                            ? setAliasList([...aliasList, { receiver: id, alias: inputValue }])
                            : null
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
            case 'delay':
                if (inputValue >= 1 && Math.round(inputValue) == inputValue) {
                    setFormIsCorrect(true);
                    newEmergencies.map((value) => (value.receiver === id ? (value.delay = inputValue) : value.delay));
                    setEmergencyList(newEmergencies);
                } else {
                    setFormIsCorrect(false);
                }
                break;
            case 'cancel':
                setFormIsCorrect(true);
                newEmergencies.map((value) =>
                    value.status === 'claimed' ? (value.status = 'unclaimed') : value.status
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
        localStorage.setItem("aliasList", JSON.stringify(aliasList));
    }, [aliasList])

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
                                {renderItemField(value.status === 'claimed' ? true : false)}
                                <span
                                    onClick={() => {
                                        setEditModalShow(true);
                                        setSelectedField('delay');
                                        setSelectedReceiver(value.receiver);
                                    }}
                                    className="receiver-text"
                                >
                                    {' ' + value.delay + ' days'}
                                </span>
                            </p>

                            <button
                                onClick={() => {
                                    setEditModalShow(true);
                                    setSelectedField('cancel');
                                    setSelectedReceiver(value.receiver);
                                }}
                                className="cta-button status-button"
                                disabled={value.status !== 'claimed'}
                            >
                                {value.status === 'claimed' ? (
                                    <div>
                                        <Emojis symbol="⏳" label="hourglass" /> {value.status.toUpperCase()}
                                    </div>
                                ) : (
                                    value.status.toUpperCase()
                                )}
                            </button>
                            {value.status === 'unclaimed' ? (
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

    console.log(aliasList);

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

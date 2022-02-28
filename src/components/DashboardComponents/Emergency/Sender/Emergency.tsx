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
    alias: string;
    percentage: number;
    delay: number;
    status: string;
    timestamp: number;
}

const TEST_EMERGENCY_LIST: EmergencyDetails[] = [
    {
        receiver: '4cjmQjJuB4WzUqqtt6VLycjXTaRvgL',
        alias: 'Alice',
        percentage: 30,
        delay: 4,
        status: 'claimed',
        timestamp: 300
    },
    {
        receiver: '9sH2FTJKB9naMwYB7zRTch2bNFBpvwj',
        alias: 'Bob',
        percentage: 20,
        delay: 2,
        status: 'claimed',
        timestamp: 300
    },
    {
        receiver: '5tt6VLycjXTaRvgLNhz6ZzRTch2bNFB',
        alias: '',
        percentage: 17,
        delay: 3,
        status: 'redeemed',
        timestamp: 0
    },
    {
        receiver: '7dsjIzdlck45dzLdldqnmPadmcnAodzs',
        alias: 'Carol',
        percentage: 5,
        delay: 7,
        status: 'unclaimed',
        timestamp: 0
    },
];

const WALLET_BALANCE = 1500;

function Emergency(props: { setNotificationCounter: (number: number) => void }) {
    const [showAddModal, setAddModalShow] = useState(false);
    const [showDeleteModal, setDeleteModalShow] = useState(false);
    const [showEditModal, setEditModalShow] = useState(false);
    const [emergencyList, setEmergencyList] = useState<EmergencyDetails[]>([]);
    const [formIsCorrect, setFormIsCorrect] = useState(false);
    const [selectedreceiver, setSelectedreceiver] = useState('');
    const [selectedField, setSelectedField] = useState('');

    var claimingEmergencies = emergencyList.filter(function (emergency) {
        return emergency.status === 'claimed';
    });

    var selectedEmergency = emergencyList.filter(function (emergency) {
        return emergency.receiver === selectedreceiver;
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
        (claimed: boolean) => (
            <span>{claimed === true ? 'in' : 'after'}</span>
        ), [emergencyList]
    );

    const addEmergency = async (inputValues: EmergencyDetails) => {
        if (
            inputValues.receiver.length >= 32 && inputValues.receiver.length <= 44 &&
            inputValues.percentage > 0 &&
            inputValues.percentage <= 100 &&
            inputValues.delay >= 1 &&
            inputValues.delay == Math.round(inputValues.delay) &&
            inputValues.percentage == Math.round(inputValues.percentage) &&
            inputValues.alias.length <= 5
        ) {
            setFormIsCorrect(true);
            setEmergencyList([...emergencyList, inputValues]);
        } else {
            setFormIsCorrect(false);
        }
    };

    const editEmergency = async (inputValue: any) => {
        const id = selectedEmergency[0].receiver;
        const newEmergencies = [...emergencyList];
        switch (selectedField) {
            case 'alias':
                if (inputValue.length <= 5) {
                    setFormIsCorrect(true);
                    newEmergencies.map((value) => (value.receiver === id ? (value.alias = inputValue) : value.alias));
                    setEmergencyList(newEmergencies);
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
        const newEmergencies = emergencyList.filter(function(emergency) {
            return emergency.receiver != id;
        });

        setEmergencyList(newEmergencies);
    };

    useEffect(() => {
        setEmergencyList(TEST_EMERGENCY_LIST);
    }, [PublicKey]);

    const renderEmergencyList = useCallback(
        () => (
            <div className="emergency-list">
                {emergencyList.map((value, index) => (
                    <div key={value.receiver} className="emergency-item">
                        <h3>{'Emergency ' + (index + 1)}</h3>
                        <p>
                            <span
                                onClick={() => {
                                    setEditModalShow(true);
                                    setSelectedField('alias');
                                    setSelectedreceiver(value.receiver);
                                }}
                                className="receiver-text"
                            >
                                {(value.alias.length > 0
                                    ? value.alias +
                                      ' (' +
                                      value.receiver.substring(0, 5) +
                                      '...' +
                                      value.receiver.substring(value.receiver.length - 5) +
                                      ')'
                                    : value.receiver.substring(0, 5) + '...' + value.receiver.substring(value.receiver.length - 5)) + ' '}
                            </span>
                            <i className="fa fa-arrow-left"></i>
                            <span
                                onClick={() => {
                                    setEditModalShow(true);
                                    setSelectedField('percentage');
                                    setSelectedreceiver(value.receiver);
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
                                    setSelectedreceiver(value.receiver);
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
                                setSelectedreceiver(value.receiver);
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
                        <button
                            onClick={() => {
                                setDeleteModalShow(true);
                                setSelectedreceiver(value.receiver);
                            }}
                            className="delete-button"
                        >
                            DELETE
                        </button>
                    </div>
                ))}
            </div>
        ),
        [emergencyList]
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
                selectedreceiver={selectedreceiver}
            />
            {(emergencyList.length > 0 && renderEmergencyList()) || renderDescription()}
        </div>
    );
}

export default Emergency;

import { Children, useCallback, useEffect, useState } from 'react';
import AddModal from './Modals/AddModal';
import EditModal from './Modals/EditModal';
import CancelModal from './Modals/CancelModal';
import DeleteModal from './Modals/DeleteModal';
import Emojis from '../utils/Emojis';
import './Emergency.css';
import './Common.css';
import { PublicKey } from '@solana/web3.js';
interface EmergencyDetails {
    pk: string;
    alias: string;
    percentage: number;
    delay: number;
    status: string;
}

const TEST_EMERGENCY_LIST: EmergencyDetails[] = [
    {
        pk: '4cjmQjJuB4WzUqqtt6VLycjXTaRvgL',
        alias: 'Alice',
        percentage: 30,
        delay: 4,
        status: 'unclaimed',
    },
    {
        pk: 'sH2FTJKB9naMwYB7zRTch2bNFBpvwj',
        alias: 'Bob',
        percentage: 20,
        delay: 2,
        status: 'claimed',
    },
    {
        pk: 'tt6VLycjXTaRvgLNhz6ZzRTch2bNFB',
        alias: '',
        percentage: 17,
        delay: 3,
        status: 'redeemed',
    },
];

const WALLET_BALANCE = 1500;

function Emergency(props: { setNotificationCounter: (number: number) => void }) {
    const [showAddModal, setAddModalShow] = useState(false);
    const [showCancelModal, setCancelModalShow] = useState(false);
    const [showEditModal, setEditModalShow] = useState(false);
    const [showDeleteModal, setDeleteModalShow] = useState(false);
    const [emergencyList, setEmergencyList] = useState<EmergencyDetails[]>([]);
    const [formIsCorrect, setFormIsCorrect] = useState(false);

    var claimingEmergencies = TEST_EMERGENCY_LIST.filter(function (emergency) {
        return emergency.status === 'claimed';
    });

    const renderDescription = useCallback(
        () => (
            <div className="emergency-item">
                <p>Your emergencies list will lie here.</p>
            </div>
        ),
        [emergencyList]
    );

    const sendEmergency = async (inputValues: EmergencyDetails) => {
        if (
            inputValues.pk != '' &&
            inputValues.percentage > 0 &&
            inputValues.percentage <= 100 &&
            inputValues.delay >= 1
        ) {
            setFormIsCorrect(true);
            setEmergencyList([...emergencyList, inputValues]);
            console.log(emergencyList);
        } else {
            setFormIsCorrect(false);
            console.log(inputValues);
        }
    };

    useEffect(() => {
        setEmergencyList(TEST_EMERGENCY_LIST);
    }, [PublicKey]);

    const renderEmergencyList = useCallback(
        () => (
            <div className="emergency-list">
                {emergencyList.map((value) => (
                    <div key={value.pk} className="emergency-item">
                        <p>
                            {(value.alias.length > 0
                                ? value.alias +
                                  ' (' +
                                  value.pk.substring(1, 6) +
                                  '...' +
                                  value.pk.substring(value.pk.length - 5) +
                                  ')'
                                : value.pk.substring(1, 6) + '...' + value.pk.substring(value.pk.length - 5)) + ' '}
                            <i className="fa fa-arrow-left"></i>
                            {' ' + (WALLET_BALANCE * value.percentage) / 100 + ' SOL '}
                            <span>after</span>
                            {' ' + value.delay + ' days'}
                        </p>

                        <button
                            onClick={() => setCancelModalShow(true)}
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
                        <button onClick={() => setEditModalShow(true)} className="edit-button">
                            EDIT
                        </button>
                        <button onClick={() => setDeleteModalShow(true)} className="delete-button">
                            DELETE
                        </button>
                    </div>
                ))}
            </div>
        ),
        [emergencyList]
    );

    return (
        <div className="emergency-container">
            {props.setNotificationCounter(claimingEmergencies.length)}
            <button onClick={() => setAddModalShow(true)} className="cta-button confirm-button">
                ADD AN EMERGENCY ADDRESS
            </button>
            <AddModal
                onClose={() => setAddModalShow(false)}
                show={showAddModal}
                sendEmergency={sendEmergency}
                formIsCorrect={formIsCorrect}
            />
            <CancelModal onClose={() => setCancelModalShow(false)} show={showCancelModal} />
            <EditModal onClose={() => setEditModalShow(false)} show={showEditModal} />
            <DeleteModal onClose={() => setDeleteModalShow(false)} show={showDeleteModal} />
            {(TEST_EMERGENCY_LIST.length > 0 && renderEmergencyList()) || renderDescription()}
        </div>
    );
}

export default Emergency;

import { PublicKey } from '@solana/web3.js';
import { useCallback, useEffect, useState } from 'react';
import AddRecoveryReceivingModal from './Modals/AddRecoveryReceivingModal';
import DeleteRecoveryModal from './Modals/DeleteRecoveryModal';
import './Recovery.css';

interface RecoveryAddress {
    sender: string;
    receiver: string;
    redeemed: boolean;
}

const TEST_RECOVERY_ADDRESS: RecoveryAddress[] = [
    {
        sender: '3dCjBWJyjGwiNk3Q45WzvMhfmz4Weod2ABjQuzhfqzD3',
        receiver: '5ZLaVaVJdvdqGmvnS4jYgJ7k54Kdev7f1q5LDytjwqJ6',
        redeemed: false
    },
];

const WALLET_BALANCE = 1500;

function Recovery() {
    const [recoveryList, setRecoveryList] = useState<RecoveryAddress[]>([]);
    const [showAddModal, setAddModalShow] = useState(false);
    const [showDeleteModal, setDeleteModalShow] = useState(false);
    const [formIsCorrect, setFormIsCorrect] = useState(false);
    const [isMentioned, setIsMentioned] = useState(false);
    const [selectedReceiver, setSelectedReceiver] = useState('');

    var selectedRecovery = recoveryList.filter(function (recovery) {
        return recovery.receiver === selectedReceiver;
    });

    const renderDescription = useCallback(() => <h3>Your recovery addresses will lie here once added.</h3>, []);

    const renderRecoveryList = useCallback(
        () => (
            <div>
                {recoveryList.map((value, index) => (
                    <div key={index} className="recovery-item-background">
                        <div className="recovery-item">
                            <h3>{'Recovery address ' + (index + 1)}</h3>
                            <p>
                                {'Me '}
                                
                                <span>
                                    <i className="fa fa-arrow-right"></i>
                                </span>
                                {' ' + WALLET_BALANCE + ' SOL '}
                                <span>
                                    <i className="fa fa-arrow-right"></i>
                                </span>
                                
                                {' ' +
                                    value.receiver.substring(0, 5) +
                                    '...' +
                                    value.receiver.substring(value.receiver.length - 5) +
                                    ' '}
                            </p>
                            <button className='cta-button status-button' disabled>{value.redeemed ? 'Sent' : 'Unclaimed'}</button>
                            <button
                                onClick={() => (setSelectedReceiver(value.receiver), setDeleteModalShow(true))}
                                className="cta-button delete-button"
                            >
                                DELETE
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        ),
        [recoveryList]
    );

    const addRecovery = async (inputValue: RecoveryAddress) => {
        if (inputValue.receiver.length >= 32 && inputValue.receiver.length <= 44) {
            var recovery = recoveryList.filter(function (value) {
                return value.sender === inputValue.sender && value.receiver === inputValue.receiver;
            });

            setFormIsCorrect(true);
            recovery.length > 0
                ? setIsMentioned(true)
                : (setRecoveryList([...recoveryList, { sender: inputValue.sender, receiver: inputValue.receiver, redeemed: false }]),
                  setIsMentioned(false));
        } else {
            setFormIsCorrect(false);
        }
    };

    const deleteRecovery = async () => {
        const id = selectedRecovery[0].sender;
        const newRecoveries = recoveryList.filter(function (recovery) {
            return recovery.sender != id;
        });

        setRecoveryList(newRecoveries);
    };

    useEffect(() => setRecoveryList(TEST_RECOVERY_ADDRESS), [PublicKey]);

    return (
        <div className="recovery-container">
            <button onClick={() => setAddModalShow(true)} className="cta-button confirm-button">
                ADD A RECEIVING ADDRESS
            </button>
            <AddRecoveryReceivingModal
                formIsCorrect={formIsCorrect}
                isMentioned={isMentioned}
                addRecovery={addRecovery}
                onClose={() => {
                    setAddModalShow(false);
                }}
                show={showAddModal}
            />
            <DeleteRecoveryModal
                onClose={() => setDeleteModalShow(false)}
                show={showDeleteModal}
                deleteRecovery={deleteRecovery}
                selectedReceiver={selectedReceiver}
            />
            <div className="recovery-list">{recoveryList.length > 0 ? renderRecoveryList() : renderDescription()}</div>
        </div>
    );
}

export default Recovery;

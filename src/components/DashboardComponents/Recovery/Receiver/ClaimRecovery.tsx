import { PublicKey } from '@solana/web3.js';
import { useCallback, useEffect, useState } from 'react';
import AddRecoveryModal from '../Sender/Modals/AddRecoveryModal';
import '../Sender/Recovery.css';

interface RecoveryAddress {
    sender: string;
    receiver: string;
}

const TEST_RECOVERY_ADDRESS: RecoveryAddress[] = [
    {
        sender: '5ZLaVaVJdvdqGmvnS4jYgJ7k54Kdev7f1q5LDytjwqJ6',
        receiver: '3dCjBWJyjGwiNk3Q45WzvMhfmz4Weod2ABjQuzhfqzD3'
    },
];

const WALLET_BALANCE = 1500;

function ClaimRecovery() {
    const [recoveryList, setRecoveryList] = useState<RecoveryAddress[]>([]);
    const [showAddModal, setAddModalShow] = useState(false);
    const [showDeleteModal, setDeleteModalShow] = useState(false);
    const [formIsCorrect, setFormIsCorrect] = useState(false);
    const [isMentioned, setIsMentioned] = useState(false);
    const [selectedSender, setSelectedSender] = useState('');

    var selectedRecovery = recoveryList.filter(function (recovery) {
        return recovery.sender === selectedSender;
    });

    const renderDescription = useCallback(() => <h3>The addresses which defined your address as a recovery will lie here once added.</h3>, []);
    
    const renderRecoveryList = useCallback(
        () => (
            <div>
                {recoveryList.map((value, index) => (
                    <div className="recovery-item-background">
                        <div key={index.toString()} className="recovery-item">
                            <h3>{'Recovery address ' + (index + 1)}</h3>
                            <p>
                                {value.sender.substring(0, 5) + '...' + value.sender.substring(value.sender.length - 5) + ' '}
                                <span><i className="fa fa-arrow-right"></i></span>
                                {' ' + WALLET_BALANCE + ' SOL '}
                                <span><i className="fa fa-arrow-right"></i></span>
                                {' Me'}
                            </p>
                            <button onClick={() => (setSelectedSender(value.sender), setDeleteModalShow(true))} className='cta-button delete-button'>DELETE</button>
                        </div>
                    </div>
                ))}
            </div>
        ),
        [recoveryList]
    );

    const addRecovery = async (inputValue: RecoveryAddress) => {
        if (inputValue.sender.length >= 32 && inputValue.sender.length <= 44) {
            var recovery = recoveryList.filter(function (value) {
                return value.sender === inputValue.sender && value.receiver === inputValue.receiver;
            });

            setFormIsCorrect(true);
            recovery.length > 0
                ? setIsMentioned(true)
                : (setRecoveryList([...recoveryList, { sender: inputValue.sender, receiver: inputValue.receiver }]),
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
                ADD AN EMERGENCY ADDRESS
            </button>
            <AddRecoveryModal
                formIsCorrect={formIsCorrect}
                isMentioned={isMentioned}
                addRecovery={addRecovery}
                onClose={() => {
                    setAddModalShow(false);
                }}
                show={showAddModal}
            />
            {/*
            <DeleteRecoveryModal
                onClose={() => setDeleteModalShow(false)}
                show={showDeleteModal}
                deleteRecovery={deleteRecovery}
                selectedReceiver={selectedReceiver}
            />*/}
            <div className="recovery-list">{recoveryList.length > 0 ? renderRecoveryList() : renderDescription()}</div>
        </div>
    );
}

export default ClaimRecovery;

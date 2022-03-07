import { PublicKey } from '@solana/web3.js';
import { useCallback, useEffect, useState } from 'react';
import AddRecoveryModal from './Modals/AddRecoveryModal';
import './Recovery.css';

interface RecoveryAddress {
    sender: string;
    receiver: string;
}

const TEST_RECOVERY_ADDRESS: RecoveryAddress[] = [{ sender: '5ZLaVaVJdvdqGmvnS4jYgJ7k54Kdev7f1q5LDytjwqJ6', receiver: '3dCjBWJyjGwiNk3Q45WzvMhfmz4Weod2ABjQuzhfqzD3' }];

function Recovery() {
    const [recoveryList, setRecoveryList] = useState<RecoveryAddress[]>([]);
    const [showAddModal, setAddModalShow] = useState(false);
    const [formIsCorrect, setFormIsCorrect] = useState(false);
    const [isMentioned, setIsMentioned] = useState(false);

    const renderDescription = useCallback(() => <h3>Your recovery addresses will lie here once added.</h3>, []);

    const addRecovery = async (inputValue: RecoveryAddress) => {
        if (inputValue.sender.length >= 32 && inputValue.sender.length <= 44) {
            
            var recovery = recoveryList.filter(function (value) {
                return value.sender === inputValue.sender && value.receiver === inputValue.receiver;
            });

            setFormIsCorrect(true);
            recovery.length > 0
                ? setIsMentioned(true)
                : (setRecoveryList([...recoveryList, {sender: inputValue.sender, receiver: inputValue.receiver}]), setIsMentioned(false));
        } else {
            setFormIsCorrect(false);
        }
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
            {renderDescription()}
        </div>
    );
}

export default Recovery;

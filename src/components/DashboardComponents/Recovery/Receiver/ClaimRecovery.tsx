import { PublicKey } from '@solana/web3.js';
import { useCallback, useEffect, useState } from 'react';
import AddRecoveryReceivingModal from './Modals/AddRecoveryReceivingModal';
import ClaimRecoveryModal from './Modals/ClaimRecoveryModal'
import '../Sender/SendRecovery.css';

interface RecoveryAddress {
    sender: string;
    receiver: string;
    redeemed: boolean;
}

const TEST_RECOVERY_ADDRESS: RecoveryAddress[] = [
    {
        sender: '5ZLaVaVJdvdqGmvnS4jYgJ7k54Kdev7f1q5LDytjwqJ6',
        receiver: '3dCjBWJyjGwiNk3Q45WzvMhfmz4Weod2ABjQuzhfqzD3',
        redeemed: false
    },
    {
        sender: '95y9LhviCVzdPwfJ2gHUuQkax8jj1fbQ19imhesbPJjM',
        receiver: '3dCjBWJyjGwiNk3Q45WzvMhfmz4Weod2ABjQuzhfqzD3',
        redeemed: false
    }
];

const WALLET_BALANCE = 1500;

function ClaimRecovery() {
    const [recoveryList, setRecoveryList] = useState<RecoveryAddress[]>([]);
    const [showAddModal, setAddModalShow] = useState(false);
    const [showClaimModal, setClaimModalShow] = useState(false);
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
                    <div key={index} className="recovery-item-background">
                        <div className="recovery-item">
                            <h3>{'Recovery address ' + (index + 1)}</h3>
                            <p>
                                {value.sender.substring(0, 5) + '...' + value.sender.substring(value.sender.length - 5) + ' '}
                                <span><i className="fa fa-arrow-right"></i></span>
                                {' ' + WALLET_BALANCE + ' SOL '}
                                <span><i className="fa fa-arrow-right"></i></span>
                                {' Me'}
                            </p>
                            <button onClick={() => (setSelectedSender(value.sender), setClaimModalShow(true))} className='cta-button status-button' disabled={value.redeemed}>{value.redeemed ? 'Received' : 'Redeem'}</button>
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
                : (setRecoveryList([...recoveryList, { sender: inputValue.sender, receiver: inputValue.receiver, redeemed: false }]),
                  setIsMentioned(false));
        } else {
            setFormIsCorrect(false);
        }
    };

    const claimRequest = async () => {
        const id = selectedRecovery[0].sender;
        const newSenders = [...recoveryList];
        newSenders.map((value) =>
            (value.sender === id ? value.redeemed = true : null)
        );
        setRecoveryList(newSenders);
    };

    useEffect(() => setRecoveryList(TEST_RECOVERY_ADDRESS), [PublicKey]);

    return (
        <div className="recovery-container">
            <button onClick={() => setAddModalShow(true)} className="cta-button confirm-button">
                ADD A SENDING ADDRESS
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
            <ClaimRecoveryModal
                onClose={() => setClaimModalShow(false)}
                show={showClaimModal}
                claimRequest={claimRequest}
                selectedSender={recoveryList.filter((recovery) => {
                    return selectedSender === recovery.sender;
                })}
            />
            <div className="recovery-list">{recoveryList.length > 0 ? renderRecoveryList() : renderDescription()}</div>
        </div>
    );
}

export default ClaimRecovery;

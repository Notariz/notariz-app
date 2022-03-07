import { useCallback, useState, useEffect } from 'react';
import Countdown from 'react-countdown';
import { PublicKey } from '@solana/web3.js';
import AddSenderModal from './Modals/AddModal';
import Emojis from '../../../utils/Emojis';
import './ClaimEmergency.css';
import '../../Common.css';

interface EmergencyDetails {
    sender: string;
    receiver: string;
    percentage: number;
    claim_request_timestamp: number;
    redeem_request_timestamp: number;
}

const TEST_EMERGENCY_LIST: EmergencyDetails[] = [
    {
        sender: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK',
        receiver: 'HSH3LftAhgNEQmpNRuE1ghnbqVHsxt8edvid1zdLxH5C',
        percentage: 30,
        claim_request_timestamp: 0,
        redeem_request_timestamp: 0   
    },
    {
        sender: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK',
        receiver: '9sH2FTJKB9naMwYB7zRTch2bNFBpvwj',
        percentage: 20,
        claim_request_timestamp: 0,
        redeem_request_timestamp: 0 
    },
    {
        sender: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK',
        receiver: '5tt6VLycjXTaRvgLNhz6ZzRTch2bNFB',
        percentage: 17,
        claim_request_timestamp: 0,
        redeem_request_timestamp: 0 
    },
    {
        sender: '7S3P4HxJpyyigGzodYwHtCxZyUQe9JiBMHyRWXArAaKv',
        receiver: 'HSH3LftAhgNEQmpNRuE1ghnbqVHsxt8edvid1zdLxH5C',
        percentage: 5,
        claim_request_timestamp: 0,
        redeem_request_timestamp: 0 
    },
    {
        sender: '3VQwtcntVQN1mj1MybQw8qK7Li3KNrrgNskSQwZAPGNr',
        receiver: 'JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB',
        percentage: 5,
        claim_request_timestamp: 0,
        redeem_request_timestamp: 0 
    },
];

const TEST_SENDER_LIST: EmergencyDetails[] = [
    {
        sender: '7S3P4HxJpyyigGzodYwHtCxZyUQe9JiBMHyRWXArAaKv',
        receiver: 'HSH3LftAhgNEQmpNRuE1ghnbqVHsxt8edvid1zdLxH5C',
        percentage: 5,
        claim_request_timestamp: 5,
        redeem_request_timestamp: 0 
    }
];

const WALLET_BALANCE = 1500;

const WITHDRAWAL_PERIOD = 4;

const RECEIVER_WALLET_ADDRESS = 'HSH3LftAhgNEQmpNRuE1ghnbqVHsxt8edvid1zdLxH5C';

function Claim() {
    const [senderList, setSenderList] = useState<EmergencyDetails[]>([]);
    const [emergencyList, setEmergencyList] = useState<EmergencyDetails[]>([]);
    const [showAddSenderModal, setAddSenderModalShow] = useState(false);
    const [formIsCorrect, setFormIsCorrect] = useState(false);
    const [senderExists, setSenderExists] = useState(false);
    const [senderIsMentioned, setSenderIsMentioned] = useState(false);

    const addSender = async (inputValue: string) => {
        if (inputValue.length >= 32 && inputValue.length <= 44) {
            setFormIsCorrect(true);

            var sender = emergencyList.filter(function (emergency) {
                return emergency.receiver == RECEIVER_WALLET_ADDRESS && emergency.sender === inputValue;
            });

            var receiver = senderList.filter(function (emergency) {
                return emergency.receiver === RECEIVER_WALLET_ADDRESS && emergency.sender === inputValue;
            });

            sender.length > 0
                ? receiver.length > 0
                    ? setSenderIsMentioned(true)
                    : (setSenderList([...senderList, sender[0]]), setSenderExists(true), setSenderIsMentioned(false))
                : setSenderExists(false);
        } else {
            setFormIsCorrect(false);
        }
    };

    const renderSenderList = useCallback(
        () => (
            <div className="claim-emergency-list">
                {senderList.map((value, index) => (
                    <div className="claim-emergency-background">
                        <div key={index.toString()} className="claim-emergency-item">
                            <h3>
                                {'Sender ' +
                                    (index + 1) +
                                    ' (' +
                                    value.sender.substring(0, 5) +
                                    '...' +
                                    value.sender.substring(value.sender.length - 5) +
                                    ')'}
                            </h3>
                            <p>
                                {'Me (' + value.receiver.substring(0,5) + '...' + value.receiver.substring(value.receiver.length - 5) + ') '}
                                <i className="fa fa-arrow-left"></i>
                                {' ' + (WALLET_BALANCE * value.percentage) / 100 + ' SOL '}
                            </p>
                            {value.claim_request_timestamp > 0 || value.redeem_request_timestamp > 0 ? (
                            <div>
                                <button className="cta-button status-button" disabled={value.redeem_request_timestamp > 0}>
                                    {value.redeem_request_timestamp > 0 ? 'Redeemed' : 'Claimed'}
                                </button>
                                <button className="cta-button status-button">
                                    <div>
                                        <Emojis symbol="⏳" label="hourglass" />
                                        <Countdown date={Date.now() + WITHDRAWAL_PERIOD * 3600 * 24 * 1000} />
                                    </div>
                                </button>
                            </div>
                            ) : (
                            <div>
                                <button className="cta-button status-button">Claim</button>
                                <button className="cta-button status-button">
                                    <Emojis symbol="⏳" label="hourglass" />
                                    {' ' + WITHDRAWAL_PERIOD + ' days'}
                                </button>
                            </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        ),
        [senderList]
    );

    const renderDescription = useCallback(
        () => (
            <div className="claim-emergency-item">
                <h3>Your senders will lie here.</h3>
            </div>
        ),
        [senderList]
    );

    useEffect(() => {
        setEmergencyList(TEST_EMERGENCY_LIST);
    }, [PublicKey]);

    useEffect(() => {
        setSenderList(TEST_SENDER_LIST);
    }, [PublicKey]);

    return (
        <div className="claim-emergency-container">
            <button onClick={() => setAddSenderModalShow(true)} className="cta-button confirm-button">
                ADD A SENDER ADDRESS
            </button>
            {senderList.length > 0 ? renderSenderList() : renderDescription()}
            <AddSenderModal
                onClose={() => setAddSenderModalShow(false)}
                show={showAddSenderModal}
                addSender={addSender}
                formIsCorrect={formIsCorrect}
                senderExists={senderExists}
                senderIsMentioned={senderIsMentioned}
            />
        </div>
    );
}

export default Claim;

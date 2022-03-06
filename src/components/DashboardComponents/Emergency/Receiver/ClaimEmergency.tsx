import { useCallback, useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import AddSenderModal from './Modals/AddModal';
import './ClaimEmergency.css';
import '../../Common.css';

interface EmergencyDetails {
    sender: string;
    receiver: string;
    alias: string;
    percentage: number;
    delay: number;
    status: string;
    timestamp: number;
}

const TEST_EMERGENCY_LIST: EmergencyDetails[] = [
    {
        sender: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK',
        receiver: 'HSH3LftAhgNEQmpNRuE1ghnbqVHsxt8edvid1zdLxH5C',
        alias: 'Alice',
        percentage: 30,
        delay: 4,
        status: 'claimed',
        timestamp: 300,
    },
    {
        sender: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK',
        receiver: '9sH2FTJKB9naMwYB7zRTch2bNFBpvwj',
        alias: 'Bob',
        percentage: 20,
        delay: 2,
        status: 'claimed',
        timestamp: 300,
    },
    {
        sender: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK',
        receiver: '5tt6VLycjXTaRvgLNhz6ZzRTch2bNFB',
        alias: '',
        percentage: 17,
        delay: 3,
        status: 'redeemed',
        timestamp: 0,
    },
    {
        sender: '7S3P4HxJpyyigGzodYwHtCxZyUQe9JiBMHyRWXArAaKv',
        receiver: 'HSH3LftAhgNEQmpNRuE1ghnbqVHsxt8edvid1zdLxH5C',
        alias: 'Carol',
        percentage: 5,
        delay: 7,
        status: 'unclaimed',
        timestamp: 0,
    },
];

const TEST_SENDER_LIST: EmergencyDetails[][] = [
    [
        {
            sender: '7S3P4HxJpyyigGzodYwHtCxZyUQe9JiBMHyRWXArAaKv',
            receiver: 'HSH3LftAhgNEQmpNRuE1ghnbqVHsxt8edvid1zdLxH5C',
            alias: 'Carol',
            percentage: 5,
            delay: 7,
            status: 'unclaimed',
            timestamp: 0,
        },
    ],
    [
        {
            sender: 'GR8wiP7NfHR8nihLjiADRoRM7V7aUvtTfUnkBy8Zkd5T',
            receiver: 'HSH3LftAhgNEQmpNRuE1ghnbqVHsxt8edvid1zdLxH5C',
            alias: 'Carol',
            percentage: 5,
            delay: 7,
            status: 'claimed',
            timestamp: 0,
        },
        {
            sender: 'GR8wiP7NfHR8nihLjiADRoRM7V7aUvtTfUnkBy8Zkd5T',
            receiver: 'EAC7jtzsoQwCbXj1M3DapWrNLnc3MBwXAarvWDPr2ZV9',
            alias: 'Alice',
            percentage: 10,
            delay: 7,
            status: 'claimed',
            timestamp: 0,
        },
    ],
];

const WALLET_BALANCE = 1500;

const RECEIVER_WALLET_ADDRESS = 'HSH3LftAhgNEQmpNRuE1ghnbqVHsxt8edvid1zdLxH5C';

function Claim() {
    const [senderList, setSenderList] = useState<EmergencyDetails[][]>([]);
    const [emergencyList, setEmergencyList] = useState<EmergencyDetails[]>([]);
    const [showAddSenderModal, setAddSenderModalShow] = useState(false);
    const [formIsCorrect, setFormIsCorrect] = useState(false);

    const addSender = async (inputValue: string) => {
        if (inputValue.length >= 32 && inputValue.length <= 44) {
            setFormIsCorrect(true);

            var sender = emergencyList.filter(function (emergency) {
                return emergency.sender === inputValue;
            });

            setSenderList([...senderList, sender]);
        } else {
            setFormIsCorrect(false);
        }
        console.log(senderList);
    };

    const renderSenderList = useCallback(
        () => (
            <div className="claim-emergency-list">
                {senderList.map((receiver, sender) => (
                    <div key={sender} className="claim-emergency-sub-list">
                        <h3>
                            {'Sender ' +
                                (sender + 1) +
                                ' (' +
                                senderList[sender][0].sender.substring(0, 5) +
                                '...' +
                                senderList[sender][0].sender.substring(senderList[sender][0].sender.length - 5) +
                                ')'}
                        </h3>
                        {receiver.map((sender) => (
                            <div key={sender.receiver} className="claim-emergency-item">
                                <p>
                                    {sender.receiver === RECEIVER_WALLET_ADDRESS
                                        ? 'Me '
                                        : sender.alias.length > 0
                                        ? sender.alias +
                                          ' (' +
                                          sender.receiver.substring(0, 5) +
                                          '...' +
                                          sender.receiver.substring(sender.receiver.length - 5) +
                                          ') '
                                        : sender.receiver.substring(0, 5) +
                                          '...' +
                                          sender.receiver.substring(sender.receiver.length - 5) +
                                          ' '}
                                    <i className="fa fa-arrow-left"></i>
                                    {' ' + (WALLET_BALANCE * sender.percentage) / 100 + ' SOL '}
                                    <span>{sender.status === 'claimed' ? 'in' : 'after'}</span>
                                    {' ' + sender.delay + ' days'}
                                </p>
                                {sender.receiver === RECEIVER_WALLET_ADDRESS ? (
                                    sender.status === 'claimed' ? (
                                        <button className="cta-button status-button">Claimed</button>
                                    ) : (
                                        <button className="cta-button status-button">Claim</button>
                                    )
                                ) : (
                                    <button className="cta-button status-button" disabled={sender.status !== 'claimed'}>
                                        Reject
                                    </button>
                                )}
                            </div>
                        ))}
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

    console.log(formIsCorrect)

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
            />
        </div>
    );
}

export default Claim;

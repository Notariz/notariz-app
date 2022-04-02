import { Emergency } from '../../../../../models';
import { Deed } from '../../../../../models';

import { clusterApiUrl, Connection, Transaction, PublicKey, LAMPORTS_PER_SOL, ConfirmOptions } from '@solana/web3.js';
import { web3 } from '@project-serum/anchor';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { CSSTransition } from 'react-transition-group';
import Emojis from '../../../../utils/Emojis';

import '../../../Common.css';

const dummyAddress = web3.Keypair.generate();

function AddEmergencyReceiverModal(props: {
    show: boolean;
    onClose: () => void;
    addEmergency: (inputValues: Emergency) => void;
    emergencyPk: PublicKey;
    formIsCorrect: boolean;
    emergencyIsAlreadyMentioned: boolean;
    openDeed: Deed;
    userBalance: string;
}) {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [inputValues, setInputValues] = useState<Emergency>({
        publicKey: props.emergencyPk,
        upstreamDeed: props.openDeed.publicKey,
        owner: props.openDeed.owner,
        receiver: dummyAddress.publicKey,
        claimedTimestamp: 0,
        redeemTimestamp: 0,
        timeBetweenPayments: 0,
        percentage: 0,
        numberOfPayments: 0,
        paymentsLeft: 1,
    });

    const closeOnEscapeKeyDown = (e: any) => {
        if ((e.charCode || e.keyCode) === 27) {
            props.onClose();
        }
    };

    useEffect(() => {
        document.body.addEventListener('keydown', closeOnEscapeKeyDown);
        return function cleanup() {
            document.body.removeEventListener('keydown', closeOnEscapeKeyDown);
        };
        //eslint-disable-next-line
    }, []);

    const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;

        setInputValues((prevState) => ({ ...prevState, [name]: value }));
    };

    const renderLeftToBeShared = useMemo(
        () => <p className="hint">{props.openDeed.leftToBeShared + '% left to be shared'}</p>,
        [props.openDeed]
    );

    return (
        <CSSTransition in={props.show} unmountOnExit timeout={{ enter: 0, exit: 300 }}>
            <div className={`notariz-modal ${props.show ? 'show' : ''}`} onClick={props.onClose}>
                <div className="notariz-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="notariz-modal-header">
                        <h3 className="notariz-modal-title">New receiving address</h3>
                        {parseFloat(props.userBalance) < 0.002 && (
                            <p className="hint">Your balance is too low to confirm the transaction.</p>
                        )}
                        {inputValues.numberOfPayments < 1 && (
                            <p className="hint">The total number of payments should be greater than 0.</p>
                        )}
                        {renderLeftToBeShared}
                    </div>
                    <div className="notariz-modal-body">
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                {
                                    setIsSubmitted(true);
                                    props.formIsCorrect && !props.emergencyIsAlreadyMentioned
                                        ? (setInputValues({
                                              publicKey: props.emergencyPk,
                                              upstreamDeed: props.openDeed.publicKey,
                                              owner: props.openDeed.owner,
                                              receiver: inputValues.receiver,
                                              claimedTimestamp: 0,
                                              redeemTimestamp: 0,
                                              timeBetweenPayments: inputValues.timeBetweenPayments,
                                              percentage: inputValues.percentage,
                                              numberOfPayments: inputValues.numberOfPayments,
                                              paymentsLeft: inputValues.paymentsLeft
                                          }),
                                          props.onClose(),
                                          setIsSubmitted(false))
                                        : null;
                                }
                            }}
                        >
                            {isSubmitted && props.emergencyIsAlreadyMentioned ? (
                                <span className="hint">This emergency is already mentioned in your list.</span>
                            ) : null}
                            {isSubmitted && !props.formIsCorrect ? (
                                <span className="hint">
                                    Your emergency's public address should be 32-to-44-character long.
                                </span>
                            ) : null}
                            <input
                                name="receiver"
                                type="text"
                                placeholder="Your emergency's public address"
                                value={inputValues.receiver.toString() === dummyAddress.publicKey.toString() ? "" : inputValues.receiver.toString()}
                                onChange={handleInputChange}
                                required
                            />
                            {isSubmitted && !props.formIsCorrect ? (
                                <span className="hint">A share should be an integer comprised between 1 and 100.</span>
                            ) : null}
                            <input
                                name="percentage"
                                type="number"
                                placeholder="Your emergency's claimable share"
                                value={inputValues.percentage === 0 ? undefined : inputValues.percentage}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                name="numberOfPayments"
                                type="number"
                                placeholder="Total number of payments"
                                value={inputValues.numberOfPayments === 0 ? undefined : inputValues.numberOfPayments}
                                onChange={handleInputChange}
                                required
                            />
                            {inputValues.numberOfPayments > 1 &&
                            <input
                                name="timeBetweenPayments"
                                type="number"
                                placeholder="Delay between each payment (in days)"
                                value={inputValues.timeBetweenPayments === 0 ? undefined : inputValues.timeBetweenPayments}
                                onChange={handleInputChange}
                                required
                            />}
                            <button
                                type="submit"
                                onClick={() => {
                                    inputValues.receiver = new PublicKey(inputValues.receiver);
                                    inputValues.paymentsLeft = inputValues.numberOfPayments;
                                    props.addEmergency(inputValues);
                                }}
                                className="cta-button edit-button"
                                disabled={
                                    !inputValues.percentage ||
                                    !inputValues.receiver ||
                                    inputValues.receiver === dummyAddress.publicKey ||
                                    inputValues.numberOfPayments < 1 ||
                                    inputValues.timeBetweenPayments < 0 ||
                                    parseFloat(props.userBalance) < 0.002
                                }
                            >
                                <div>
                                    <Emojis symbol="✔️" label="check" /> {' Submit'}
                                </div>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}

export default AddEmergencyReceiverModal;

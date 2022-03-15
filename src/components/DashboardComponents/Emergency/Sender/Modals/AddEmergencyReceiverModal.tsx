import { Emergency } from '../../../../../models';
import { Deed } from '../../../../../models';

import { clusterApiUrl, Connection, Transaction, PublicKey, LAMPORTS_PER_SOL, ConfirmOptions } from '@solana/web3.js';
import { web3 } from '@project-serum/anchor';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { CSSTransition } from 'react-transition-group';
import Emojis from '../../../../utils/Emojis';

import '../../../Common.css';

function AddEmergencyReceiverModal(props: {
    show: boolean;
    onClose: () => void;
    addEmergency: (inputValues: Emergency) => void;
    emergencyPk: PublicKey;
    formIsCorrect: boolean;
    emergencyIsAlreadyMentioned: boolean;
    openDeed: Deed;
}) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [inputValues, setInputValues] = useState<Emergency>({
        publicKey: props.emergencyPk,
        upstreamDeed: props.openDeed.publicKey,
        owner: props.openDeed.owner,
        receiver: web3.Keypair.generate().publicKey,
        percentage: 0,
        claimedTimestamp: 0,
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

    const renderLeftToBeShared = useMemo(() => (<div className='hint'>{props.openDeed.leftToBeShared + '% left to be shared'}</div>), [props.openDeed])

    return (
        <CSSTransition in={props.show} unmountOnExit timeout={{ enter: 0, exit: 300 }}>
            <div className={`notariz-modal ${props.show ? 'show' : ''}`} onClick={props.onClose}>
                <div className="notariz-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="notariz-modal-header">
                        <h3 className="notariz-modal-title">New receiving address</h3>
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
                                              percentage: inputValues.percentage,
                                              claimedTimestamp: 0,
                                          }),
                                          props.onClose(),
                                          setIsSubmitted(false))
                                        : null;
                                }
                                /* Call program entry point here */
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
                                value={inputValues.receiver.toString()}
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
                            <button
                                type="submit"
                                onClick={() => {
                                    inputValues.receiver = new PublicKey(inputValues.receiver)
                                    props.addEmergency(inputValues);
                                }}
                                className="cta-button edit-button"
                                disabled={!inputValues.percentage || !inputValues.receiver}
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

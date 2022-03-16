import { Emergency } from '../../../../../models/Emergency';

import { clusterApiUrl, Connection, Transaction, PublicKey, LAMPORTS_PER_SOL, ConfirmOptions } from '@solana/web3.js';

import { useState, useEffect, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import Emojis from '../../../../utils/Emojis';
import '../../../Common.css';


function EditEmergencyReceiverModal(props: {
    show: boolean;
    onClose: () => void;
    selectedField: string;
    selectedEmergency: Emergency[];
    formIsCorrect: boolean;
    editEmergency: (inputValue: string) => void;
}) {
    const [inputValue, setInputValue] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

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

    return (
        <CSSTransition in={props.show} unmountOnExit timeout={{ enter: 0, exit: 300 }}>
            <div className={`notariz-modal ${props.show ? 'show' : ''}`} onClick={props.onClose}>
                <div className="notariz-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="notariz-modal-header">
                        {props.selectedField === 'alias' && (
                            <div>
                                <h3 className="notariz-modal-title">Edit nickname</h3>
                                <p className="hint">
                                    Nicknames are stored locally in your browser, off-chain.
                                </p>
                            </div>
                        )}
                        {props.selectedField === 'percentage' && (
                            <div>
                                <h3 className="notariz-modal-title">Edit percentage</h3>
                                <p className='hint'>{props.selectedEmergency.length > 0 ? ('Current percentage: ' + props.selectedEmergency[0].percentage + '%') : null}</p>
                            </div>
                        )}
                        {props.selectedField === 'cancel' && (
                            <div>
                                <h3 className="notariz-modal-title">Claim request rejection</h3>
                                <div className="hint">
                                    You are about to reject this claim request. This does not prevent this emergency address to make a new request afterwards.
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="notariz-modal-body">
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                setIsSubmitted(true);
                                {
                                    props.formIsCorrect ? (props.onClose(), setIsSubmitted(false)) : null;
                                }
                                /* Call program entry point here */
                            }}
                        >
                            {props.selectedField === 'alias' && (
                                <div>
                                    {!props.formIsCorrect && isSubmitted ? (
                                        <div>
                                            <p className="hint">
                                                Emergency address's alias should be 5-character long max.
                                            </p>
                                        </div>
                                    ) : null}
                                    <input
                                        name="alias"
                                        type="text"
                                        placeholder={"Emergency address nickname"}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        required
                                    />
                                </div>
                            )}
                            {props.selectedField === 'percentage' && (
                                <div>
                                    {!props.formIsCorrect && isSubmitted ? (
                                        <div>
                                            <span className="hint">
                                                A percentage should be an integer comprised between 1 to 100.
                                            </span>
                                        </div>
                                    ) : null}
                                    <input
                                        name="percentage"
                                        type="number"
                                        placeholder={"Your emergency's claimable percentage"}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        required
                                    />
                                </div>
                            )}
                            <button
                                type="submit"
                                onClick={() => {
                                    props.editEmergency(inputValue);
                                }}
                                className="cta-button edit-button"
                            >
                                {props.selectedField === 'cancel' ? <div><Emojis symbol="❌" label="cross" />{' Reject'}</div> : 'Submit'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}

export default EditEmergencyReceiverModal;

import { useState, useEffect, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import '../../../Common.css';

interface EmergencyDetails {
    receiver: string;
    alias: string;
    percentage: number;
    delay: number;
    status: string;
}

function EditModal(props: {
    show: boolean;
    onClose: () => void;
    selectedField: string;
    selectedReceiver: string;
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
                                <div className="notariz-modal-text">
                                    Nicknames are stored in your sole <span>browser</span>, they will not persist on another one. Make sure to write them down!
                                </div>
                            </div>
                        )}
                        {props.selectedField === 'percentage' && (
                            <div>
                                <h3 className="notariz-modal-title">Edit percentage</h3>
                            </div>
                        )}
                        {props.selectedField === 'delay' && (
                            <div>
                                <h3 className="notariz-modal-title">Edit withdrawal period</h3>
                            </div>
                        )}
                        {props.selectedField === 'cancel' && (
                            <div>
                                <h3 className="notariz-modal-title">Claim request</h3>
                                <div className="notariz-modal-text">
                                    Rejecting this claim request will also cancel the <span>others</span>.
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
                                    <span className="hint">Your emergency's public key is {props.selectedReceiver}</span>
                                    {!props.formIsCorrect && isSubmitted ? (
                                        <div>
                                            <span className="hint">
                                                Your emergency's nickname should be 5-character long max.
                                            </span>
                                        </div>
                                    ) : null}
                                    <input
                                        name="alias"
                                        type="text"
                                        placeholder={"Your emergency's nickname"}
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
                            {props.selectedField === 'delay' && (
                                <div>
                                    {!props.formIsCorrect && isSubmitted ? (
                                        <div>
                                            <span className="hint">
                                                Your withdrawal period value should be an integer greater than 0.
                                            </span>
                                        </div>
                                    ) : null}
                                    <input
                                        name="delay"
                                        type="number"
                                        placeholder={'Your withdrawal period (in days)'}
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
                                {props.selectedField === 'cancel' ? 'Reject' : 'Submit'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}

export default EditModal;

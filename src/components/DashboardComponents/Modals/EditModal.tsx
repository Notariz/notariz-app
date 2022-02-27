import { useState, useEffect, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import '../Common.css';

interface EmergencyDetails {
    pk: string;
    alias: string;
    percentage: number;
    delay: number;
    status: string;
}

function EditModal(props: {
    show: boolean;
    onClose: () => void;
    selectedField: string;
    formIsCorrect: boolean;
    editEmergency: (inputValue: string) => void;
}) {
    const [inputValue, setInputValue] = useState('');

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
                                <h3 className="notariz-modal-title">EDIT NICKNAME</h3>
                                <div className="notariz-modal-text">
                                    Nicknames are publicly stored in the <span>blockchain</span>, keep them simple to
                                    ensure your emergency's privacy.
                                </div>
                            </div>
                        )}
                        {props.selectedField === 'percentage' && (
                            <div>
                                <h3 className="notariz-modal-title">EDIT PERCENTAGE</h3>
                            </div>
                        )}
                        {props.selectedField === 'delay' && (
                            <div>
                                <h3 className="notariz-modal-title">EDIT WITHDRAWAL PERIOD</h3>
                            </div>
                        )}
                        {props.selectedField === 'cancel' && (
                            <div>
                                <h3 className="notariz-modal-title">CLAIM REQUEST</h3>
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
                                {
                                    props.formIsCorrect ? props.onClose() : null;
                                }
                                /* Call program entry point here */
                            }}
                        >
                            {props.selectedField === 'alias' &&
                                <input
                                    name="alias"
                                    type="text"
                                    placeholder={"Your emergency's nickname"}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    required
                                />
                            }
                            {props.selectedField === 'percentage' &&
                                <input
                                    name="percentage"
                                    type="number"
                                    placeholder={"Your emergency's claimable percentage"}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    required
                                />
                            }
                            {props.selectedField === 'delay' &&
                                <input
                                    name="delay"
                                    type="number"
                                    placeholder={"Your withdrawal period (in days)"}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    required
                                />
                            }
                            <button
                                type="submit"
                                onClick={() => props.editEmergency(inputValue)}
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

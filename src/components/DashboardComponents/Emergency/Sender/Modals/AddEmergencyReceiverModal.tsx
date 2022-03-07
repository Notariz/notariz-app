import { useEffect, useState, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import Emojis from '../../../../utils/Emojis';
import '../../../Common.css';

interface EmergencyDetails {
    receiver: string;
    share: number;
    claim_request_timestamp: number;
    redeem_request_timestamp: number;
}

function AddEmergencyReceiverModal(props: {
    show: boolean;
    onClose: () => void;
    addEmergency: (inputValues: EmergencyDetails) => void;
    formIsCorrect: boolean;
    emergencyIsMentioned: boolean;
}) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [inputValues, setInputValues] = useState<EmergencyDetails>({
        receiver: '',
        share: 0,
        claim_request_timestamp: 0,
        redeem_request_timestamp: 0
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

    return (
        <CSSTransition in={props.show} unmountOnExit timeout={{ enter: 0, exit: 300 }}>
            <div className={`notariz-modal ${props.show ? 'show' : ''}`} onClick={props.onClose}>
                <div className="notariz-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="notariz-modal-header">
                        <h3 className="notariz-modal-title">New receiving emergency address</h3>
                    </div>
                    <div className="notariz-modal-body">
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                {
                                    setIsSubmitted(true);
                                    props.formIsCorrect && !props.emergencyIsMentioned
                                        ? (setInputValues({
                                              receiver: '',
                                              share: 0,
                                              claim_request_timestamp: 0,
                                              redeem_request_timestamp: 0
                                          }),
                                          props.onClose(),
                                          setIsSubmitted(false))
                                        : null;
                                }
                                /* Call program entry point here */
                            }}
                        >
                            {isSubmitted && props.emergencyIsMentioned ? (
                                <span className="hint">
                                    This emergency is already mentioned in your list.
                                </span>
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
                                value={inputValues.receiver}
                                onChange={handleInputChange}
                                required
                            />
                            {isSubmitted && !props.formIsCorrect ? (
                                <span className="hint">
                                    A share should be an integer comprised between 1 to 100.
                                </span>
                            ) : null}
                            <input
                                name="share"
                                type="number"
                                placeholder="Your emergency's claimable share"
                                value={inputValues.share === 0 ? NaN : inputValues.share}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="submit"
                                onClick={() => props.addEmergency(inputValues)}
                                className="cta-button edit-button"
                            >
                                <div><Emojis symbol="✔️" label="check" /> {' Submit'}</div>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}

export default AddEmergencyReceiverModal;

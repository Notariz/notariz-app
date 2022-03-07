import { useEffect, useState, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import '../../../Common.css';

interface EmergencyDetails {
    receiver: string;
    percentage: number;
    claim_request_timestamp: number;
    redeem_request_timestamp: number;
}

function AddModal(props: {
    show: boolean;
    onClose: () => void;
    addEmergency: (inputValues: EmergencyDetails) => void;
    formIsCorrect: boolean;
    emergencyIsMentioned: boolean;
}) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [inputValues, setInputValues] = useState<EmergencyDetails>({
        receiver: '',
        percentage: 0,
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
                        <h3 className="notariz-modal-title">New emergency address</h3>
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
                                              percentage: 0,
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
                                    A percentage should be an integer comprised between 1 to 100.
                                </span>
                            ) : null}
                            <input
                                name="percentage"
                                type="number"
                                placeholder="Your emergency's claimable percentage"
                                value={inputValues.percentage === 0 ? NaN : inputValues.percentage}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="submit"
                                onClick={() => props.addEmergency(inputValues)}
                                className="cta-button edit-button"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}

export default AddModal;

import { useEffect, useState, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import '../../../Common.css';

interface EmergencyDetails {
    pk: string;
    alias: string;
    percentage: number;
    delay: number;
    status: string;
    timestamp: number;
}

function AddModal(props: {
    show: boolean;
    onClose: () => void;
    addEmergency: (inputValues: EmergencyDetails) => void;
    formIsCorrect: boolean;
}) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [inputValues, setInputValues] = useState<EmergencyDetails>({
        pk: '',
        alias: '',
        percentage: 0,
        delay: 0,
        status: 'unclaimed',
        timestamp: 0
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
                                    props.formIsCorrect
                                        ? (setInputValues({
                                              pk: '',
                                              alias: '',
                                              percentage: 0,
                                              delay: 0,
                                              status: 'unclaimed',
                                              timestamp: 0
                                          }),
                                          props.onClose(),
                                          setIsSubmitted(false))
                                        : null;
                                }
                                /* Call program entry point here */
                            }}
                        >
                            {isSubmitted && !props.formIsCorrect ? (
                                <span className="hint">
                                    Your emergency's public address should be 32-to-44-character long.
                                </span>
                            ) : null}
                            <input
                                name="pk"
                                type="text"
                                placeholder="Your emergency's public address"
                                value={inputValues.pk}
                                onChange={handleInputChange}
                                required
                            />
                            {isSubmitted && !props.formIsCorrect ? (
                                <span className="hint">
                                    For privacy reasons, your emergency's nickname should be 5-character long max.
                                </span>
                            ) : null}
                            <input
                                name="alias"
                                type="text"
                                placeholder="Your emergency's nickname (optional)"
                                value={inputValues.alias}
                                onChange={handleInputChange}
                            />
                            {isSubmitted && !props.formIsCorrect ? (
                                <span className="hint">A percentage should be an integer comprised between 1 to 100.</span>
                            ) : null}
                            <input
                                name="percentage"
                                type="number"
                                placeholder="Your emergency's claimable percentage"
                                value={inputValues.percentage === 0 ? NaN : inputValues.percentage}
                                onChange={handleInputChange}
                                required
                            />
                            {isSubmitted && !props.formIsCorrect ? (
                                <span className="hint">Your withdrawal period value should be an integer greater than 0.</span>
                            ) : null}
                            <input
                                name="delay"
                                type="number"
                                placeholder="Your withdrawal period (in days)"
                                value={inputValues.delay === 0 ? NaN : inputValues.delay}
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

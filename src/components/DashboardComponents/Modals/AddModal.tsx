import { useEffect, useState, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import '../Common.css';

interface EmergencyDetails {
    id: number;
    pk: string;
    alias: string;
    percentage: number;
    delay: number;
    status: string;
}

function AddModal(props: { show: boolean; onClose: () => void }) {
    const [formIsCorrect, setFormIsCorrect] = useState(true);
    const [inputValues, setInputValues] = useState({ pk: '', percentage: 0, delay: 2 });

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

    const sendEmergency = async () => {
        console.log(formIsCorrect);
        if (
            inputValues.pk != '' &&
            inputValues.percentage > 0 &&
            inputValues.percentage <= 100 &&
            inputValues.delay >= 3600
        ) { 
            setFormIsCorrect(true);
            /* setEmergencyList(); */
            props.onClose();
            console.log('Emergency:', inputValues); 
        }
        else {
            setFormIsCorrect(false);
            console.log('Empty input.');
        }
    };

    return (
        <CSSTransition in={props.show} unmountOnExit timeout={{ enter: 0, exit: 300 }}>
            <div className={`notariz-modal ${props.show ? 'show' : ''}`} onClick={props.onClose}>
                <div className="notariz-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="notariz-modal-header">
                        <h3 className="notariz-modal-title">NEW EMERGENCY ADDRESS</h3>
                        <div>
                            Please fulfill the following fields to <span>add</span> a new emergency.
                        </div>
                    </div>
                    <div className="notariz-modal-body">
                        {!formIsCorrect && <p>Some fields are empty or contain impossible values.</p>}
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                sendEmergency();
                                /* Call program entry point here */
                            }}
                        >
                            <input
                                name="pk"
                                type="text"
                                placeholder="Your emergency contact's public address"
                                value={inputValues.pk}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                name="percentage"
                                type="number"
                                placeholder="Your emergency contact's claimable percentage"
                                value={inputValues.percentage}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                name="delay"
                                type="number"
                                placeholder="Your withdrawal period (in days)"
                                value={inputValues.delay}
                                onChange={handleInputChange}
                                required
                            />
                            <button type="submit" className="cta-button edit-button">
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

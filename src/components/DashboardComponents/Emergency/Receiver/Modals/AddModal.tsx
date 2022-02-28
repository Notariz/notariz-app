import { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import '../../../Common.css';

interface EmergencyDetails {
    sender: string;
    receiver: string;
    alias: string;
    percentage: number;
    delay: number;
    status: string;
    timestamp: number;
}

function AddSenderModal(props: { show: boolean; onClose: () => void; formIsCorrect: boolean; addSender: (inputValue: string) => void }) {
    const [isSubmitted, setIsSubmitted] = useState(false);
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
                        <h3 className="notariz-modal-title">New sender address</h3>
                    </div>
                    <div className="notariz-modal-body">
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                {
                                    setIsSubmitted(true);
                                    props.formIsCorrect
                                        ? (setInputValue(''), props.onClose(), setIsSubmitted(false))
                                        : null;
                                }
                                /* Call program entry point here */
                            }}
                        >
                            <input
                                name="pk"
                                type="text"
                                placeholder="Your sender's public address"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                required
                            />
                            <button
                                onClick={() => {
                                    props.addSender(inputValue);
                                    props.onClose();
                                }}
                                className="cta-button edit-button"
                            >
                                Confirm
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}

export default AddSenderModal;

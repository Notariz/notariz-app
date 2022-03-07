import { useState, useEffect, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import Emojis from '../../../../utils/Emojis';
import '../../../Common.css';

interface EmergencyDetails {
    sender: string;
    receiver: string;
    alias: string;
    share: number;
    delay: number;
    status: string;
    timestamp: number;
}

function AddEmergencySenderModal(props: {
    show: boolean;
    onClose: () => void;
    formIsCorrect: boolean;
    senderExists: boolean;
    senderIsMentioned: boolean;
    addSender: (inputValue: string) => void;
}) {
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

    const renderFormErrorMessage = useCallback(
        () => <span className="hint">Your sender's public address should be 32-to-44-character long.</span>,
        [inputValue]
    );

    const renderSenderDoesNotExistErrorMessage = useCallback(
        () => <span className="hint">You are not mentioned on this sender's emergency list.</span>,
        [inputValue]
    );

    const renderSenderIsAlreadyMentionedErrorMessage = useCallback(
        () => <span className="hint">This sender is already mentioned in your senders list.</span>,
        [inputValue]
    );

    return (
        <CSSTransition in={props.show} unmountOnExit timeout={{ enter: 0, exit: 300 }}>
            <div className={`notariz-modal ${props.show ? 'show' : ''}`} onClick={props.onClose}>
                <div className="notariz-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="notariz-modal-header">
                        <span>
                            <h3 className="notariz-modal-title">New sending emergency address</h3>
                        </span>
                    </div>
                    <div className="notariz-modal-body">
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                {
                                    setIsSubmitted(true);
                                    props.formIsCorrect && props.senderExists && !props.senderIsMentioned
                                        ? (setInputValue(''), props.onClose(), setIsSubmitted(false))
                                        : null;
                                }
                                /* Call program entry point here */
                            }}
                        >
                            {!props.formIsCorrect && isSubmitted && renderFormErrorMessage()}
                            {!props.senderExists &&
                                props.formIsCorrect &&
                                isSubmitted &&
                                renderSenderDoesNotExistErrorMessage()}
                            {props.senderIsMentioned && isSubmitted && renderSenderIsAlreadyMentionedErrorMessage()}
                            <input
                                name="pk"
                                type="text"
                                placeholder="Your sender's public address"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                onClick={() => {
                                    props.addSender(inputValue);
                                }}
                                className="cta-button edit-button"
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

export default AddEmergencySenderModal;

import { useEffect, useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { CSSTransition } from 'react-transition-group';
import '../../../Common.css';


interface RecoveryAddress {
    sender: string;
    receiver: string;
}

function AddRecoveryModal(props: {
    show: boolean;
    onClose: () => void;
    formIsCorrect: boolean;
    isMentioned: boolean;
    addRecovery: (inputValue: RecoveryAddress) => void;
}) {
    const { publicKey } = useWallet();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [inputValue, setInputValue] = useState<RecoveryAddress>({
        sender: '',
        receiver: publicKey?.toString() ? publicKey.toString() : '',
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
        setInputValue((prevState) => ({ ...prevState, [name]: value }));
    };

    return (
        <CSSTransition in={props.show} unmountOnExit timeout={{ enter: 0, exit: 300 }}>
            <div className={`notariz-modal ${props.show ? 'show' : ''}`} onClick={props.onClose}>
                <div className="notariz-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="notariz-modal-header">
                        <h3 className="notariz-modal-title">New recovery address</h3>
                    </div>
                    <div className="notariz-modal-body">
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                {
                                    setIsSubmitted(true);
                                    props.formIsCorrect && !props.isMentioned
                                        ? (setInputValue({
                                              sender: '',
                                              receiver: publicKey?.toString() ? publicKey.toString() : '',
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
                                    Your recovery address address should be 32-to-44-character long.
                                </span>
                            ) : null}
                            {isSubmitted && props.isMentioned ? (
                                <span className="hint">
                                    This recovery address already exists.
                                </span>
                            ) : null}
                            <input
                                name="sender"
                                type="text"
                                placeholder="Your recovery address"
                                value={inputValue.sender}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="submit"
                                onClick={() => (props.addRecovery(inputValue))}
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

export default AddRecoveryModal;

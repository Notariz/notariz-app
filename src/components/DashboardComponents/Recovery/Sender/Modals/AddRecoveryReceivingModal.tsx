import { useEffect, useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { CSSTransition } from 'react-transition-group';
import Emojis from '../../../../utils/Emojis';
import '../../../Common.css';

interface RecoveryAddress {
    sender: string;
    receiver: string;
    redeemed: boolean;
}

function AddRecoveryReceivingModal(props: {
    show: boolean;
    onClose: () => void;
    formIsCorrect: boolean;
    isMentioned: boolean;
    addRecovery: (inputValue: RecoveryAddress) => void;
}) {
    const { publicKey } = useWallet();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [inputValue, setInputValue] = useState<RecoveryAddress>({
        sender: publicKey?.toString() ? publicKey.toString() : '',
        receiver: '',
        redeemed: false
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
                        <h3 className="notariz-modal-title">New receiving address</h3>
                    </div>
                    <div className="notariz-modal-body">
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                {
                                    setIsSubmitted(true);
                                    props.formIsCorrect && !props.isMentioned
                                        ? (setInputValue({
                                              sender: publicKey?.toString() ? publicKey.toString() : '',
                                              receiver: '',
                                              redeemed: false
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
                                    Your receiving recovery address should be 32-to-44-character long.
                                </span>
                            ) : null}
                            {isSubmitted && props.isMentioned ? (
                                <span className="hint">This recovery address already exists.</span>
                            ) : null}
                            <input
                                name="receiver"
                                type="text"
                                placeholder="Your receiving recovery address"
                                value={inputValue.receiver}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="submit"
                                onClick={() => props.addRecovery(inputValue)}
                                className="cta-button edit-button"
                            >
                                <div>
                                    <Emojis symbol="✔️" label="check" /> {' Submit'}
                                </div>{' '}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}

export default AddRecoveryReceivingModal;

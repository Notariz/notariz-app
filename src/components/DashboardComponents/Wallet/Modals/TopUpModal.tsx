import { useEffect, useState, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import Emojis from '../../../utils/Emojis';
import '../../Common.css';

function TopUpModal(props: {
    show: boolean;
    onClose: () => void;
    formIsCorrect: boolean;
    topUp: (inputValue: number) => void;
    userBalance: string;
}) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [inputValue, setInputValue] = useState(0);

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
        const { value } = e.currentTarget;
        setInputValue(parseInt(value));
    };

    const renderUserBalance = useCallback(() => (<div>{'Wallet balance: ' + props.userBalance + ' SOL'}</div>), [props.userBalance])

    return (
        <CSSTransition in={props.show} unmountOnExit timeout={{ enter: 0, exit: 300 }}>
            <div className={`notariz-modal ${props.show ? 'show' : ''}`} onClick={props.onClose}>
                <div className="notariz-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="notariz-modal-header">
                        <h3 className="notariz-modal-title">{renderUserBalance()}</h3>
                        <div className='hint'>Think of keeping some SOL left to pay for withdraw transactions.</div>
                    </div>
                    <div className="notariz-modal-body">
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                {
                                    setIsSubmitted(true);
                                    props.formIsCorrect
                                        ? (setInputValue(0), props.onClose(), setIsSubmitted(false))
                                        : null;
                                }
                                /* Call program entry point here */
                            }}
                        >
                            {isSubmitted && !props.formIsCorrect ? <span className="hint">Invalid amount.</span> : null}
                            <input
                                name="balance"
                                type="number"
                                placeholder="Your sending recovery address"
                                value={inputValue}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="submit"
                                onClick={() => props.topUp(inputValue)}
                                className="cta-button confirm-button"
                            >
                                Submit
                            </button>
                            <button type="button" onClick={() => setInputValue(parseFloat(props.userBalance))} className="cta-button edit-button">Max</button>
                        </form>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}

export default TopUpModal;

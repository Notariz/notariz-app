import { useEffect, useState, useCallback, useMemo } from 'react';
import { CSSTransition } from 'react-transition-group';
import Emojis from '../../../utils/Emojis';
import '../../Common.css';

function WithdrawModal(props: {
    show: boolean;
    onClose: () => void;
    formIsCorrect: boolean;
    withdraw: (inputValue: number) => void;
    deedBalance: number;
    userBalance: string;
}) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [inputValue, setInputValue] = useState(0.0);

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
        setInputValue(parseFloat(value));
    };

    const renderDeedBalance = useMemo(
        () => (
            <div>
                <h3 className="notariz-modal-title">{'Withdraw from deed account'}</h3>
                <p className="hint">{'Deed balance: ' + props.deedBalance + ' SOL'}</p>
            </div>
        ),
        [props.deedBalance]
    );

    return (
        <CSSTransition in={props.show} unmountOnExit timeout={{ enter: 0, exit: 300 }}>
            <div className={`notariz-modal ${props.show ? 'show' : ''}`} onClick={props.onClose}>
                <div className="notariz-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="notariz-modal-header">{renderDeedBalance}</div>
                    {parseFloat(props.userBalance) < 0.002 && (
                        <p className="hint">Your balance is too low to confirm the transaction.</p>
                    )}
                    {inputValue === props.deedBalance && (
                        <p className="hint">
                            Think of keeping some lamports on your deed account to keep it alive; the Solana blockchain
                            will delete it otherwise.
                        </p>
                    )}
                    {inputValue > props.deedBalance && <p className="hint">Insufficient deed balance.</p>}

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
                            {isSubmitted && !props.formIsCorrect ? (
                                <span className="hint">
                                    Invalid amount. It is likely that you asked for more lamports than what your deed
                                    account actually holds.
                                </span>
                            ) : null}
                            <input
                                name="balance"
                                type="number"
                                step="0.00000001"
                                placeholder="SOL amount to transfer"
                                value={inputValue}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="submit"
                                onClick={() => props.withdraw(inputValue)}
                                className="cta-button confirm-button"
                                disabled={inputValue >= props.deedBalance || parseFloat(props.userBalance) < 0.002}
                            >
                                Submit
                            </button>
                            <button
                                type="button"
                                onClick={() => setInputValue(props.deedBalance - 0.001)}
                                className="cta-button edit-button"
                            >
                                Max
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}

export default WithdrawModal;

import { useEffect, useState, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import '../../Common.css';

function EditWithdrawalPeriodModal(props: {
    show: boolean;
    onClose: () => void;
    formIsCorrect: boolean;
    editWithdrawalPeriod: (inputValue: number) => void;
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

    return (
        <CSSTransition in={props.show} unmountOnExit timeout={{ enter: 0, exit: 300 }}>
            <div className={`notariz-modal ${props.show ? 'show' : ''}`} onClick={props.onClose}>
                <div className="notariz-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="notariz-modal-header">
                        <h3 className="notariz-modal-title">Withdrawal period edition</h3>
                        {parseFloat(props.userBalance) < 0.002 && (
                        <p className="hint">Your balance is too low to confirm the transaction.</p>
                    )}
                    </div>
                    <div className="notariz-modal-body">
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                {
                                    setIsSubmitted(true);
                                    setInputValue(0);
                                    props.onClose();
                                    setIsSubmitted(false);
                                }
                            }}
                        >
                            {!isNaN(inputValue) && <p className="hint">
                                {'Your emergencies will be allowed to redeem their share ' +
                                    inputValue +
                                    ' hours after their claim.'}
                            </p>}
                            {inputValue < 24 && <p className="hint">{inputValue + ' hours is maybe a tad short for a withdrawal period.'}</p>}
                            <input
                                name="withdrawal"
                                type="number"
                                step="0.0001"
                                placeholder="Withdrawal period (in hours)"
                                value={inputValue}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="submit"
                                onClick={() => props.editWithdrawalPeriod(inputValue)}
                                className="cta-button confirm-button"
                                disabled={parseFloat(props.userBalance) < 0.002}
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

export default EditWithdrawalPeriodModal;

import { useEffect, useState, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import '../../Common.css';

function EditWithdrawalPeriodModal(props: {
    show: boolean;
    onClose: () => void;
    formIsCorrect: boolean;
    editWithdrawalPeriod: (inputValue: number) => void;
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
        setInputValue(parseInt(value));
    };

    return (
        <CSSTransition in={props.show} unmountOnExit timeout={{ enter: 0, exit: 300 }}>
            <div className={`notariz-modal ${props.show ? 'show' : ''}`} onClick={props.onClose}>
                <div className="notariz-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="notariz-modal-header">
                        <h3 className="notariz-modal-title">Withdrawal period edition</h3>
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
                            }}
                        >
                            {isSubmitted && !props.formIsCorrect ? <span className="hint">Given withdrawal period should be at least 2 days long.</span> : null}
                            <input
                                name="balance"
                                type="number"
                                step="1"
                                placeholder="Withdrawal period (in days)"
                                value={inputValue}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="submit"
                                onClick={() => props.editWithdrawalPeriod(inputValue)}
                                className="cta-button confirm-button"
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

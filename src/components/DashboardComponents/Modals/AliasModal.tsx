import { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import '../Common.css';

interface EmergencyDetails {
    pk: string;
    alias: string;
    percentage: number;
    delay: number;
    status: string;
}

function AliasModal(props: { show: boolean; onClose: () => void; formIsCorrect: boolean; editEmergencyAlias: (inputValue: string) => void;
}) {
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
                        <h3 className="notariz-modal-title">DEFINE A NICKNAME</h3>
                        <div>
                            Nicknames are stored in your <span>browser</span>, not in the blockchain.
                        </div>
                    </div>
                    <div className="notariz-modal-body">
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                {props.formIsCorrect ? props.onClose() : null}
                                /* Call program entry point here */
                            }}
                        >
                            <input
                                name="alias"
                                type="text"
                                placeholder={"Your emergency's nickname"}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                onClick={() => props.editEmergencyAlias(inputValue)}
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

export default AliasModal;

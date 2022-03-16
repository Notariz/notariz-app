import { Emergency } from '../../../../models';
import { Deed } from '../../../../models';

import { clusterApiUrl, Connection, Transaction, PublicKey, LAMPORTS_PER_SOL, ConfirmOptions } from '@solana/web3.js';
import { web3 } from '@project-serum/anchor';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { CSSTransition } from 'react-transition-group';
import Emojis from '../../../utils/Emojis';

import '../../Common.css';

function SendDeedModal(props: {
    show: boolean;
    onClose: () => void;
    formIsCorrect: boolean;
    sendDeed: (receiver: PublicKey) => void;
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

    const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        const { value } = e.currentTarget;

        setInputValue(value);
    };

    return (
        <CSSTransition in={props.show} unmountOnExit timeout={{ enter: 0, exit: 300 }}>
            <div className={`notariz-modal ${props.show ? 'show' : ''}`} onClick={props.onClose}>
                <div className="notariz-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="notariz-modal-header">
                        <h3 className="notariz-modal-title">Send deed</h3>
                        <p className="hint">
                            Sending a deed to another user will transfer your deed's rights and ownership to this user.
                        </p>
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
                            {isSubmitted && !props.formIsCorrect ? (
                                <span className="hint">
                                    Your emergency's public address should be 32-to-44-character long.
                                </span>
                            ) : null}
                            <input
                                name="receiver"
                                type="text"
                                placeholder="Your emergency's public address"
                                value={inputValue}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="submit"
                                onClick={() => {
                                    props.sendDeed(new PublicKey(inputValue));
                                }}
                                className="cta-button edit-button"
                                disabled={!inputValue}
                            >
                                    <Emojis symbol="✉️" label="letter" /> {' Send'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}

export default SendDeedModal;

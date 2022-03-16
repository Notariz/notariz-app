import { useState, useEffect, useCallback } from 'react';
import Emojis from '../../../../utils/Emojis';
import { CSSTransition } from 'react-transition-group';
import '../../../Common.css';
import { Recovery } from '../../../../../models';

function ClaimRecoveryModal(props: {
    show: boolean;
    onClose: () => void;
    redeem: () => void;
    selectedSender: Recovery[];
}) {
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
                        <span>
                            <h3 className="notariz-modal-title">Redeem</h3>
                            <p><div className='hint'>You are about to receive 100% of this sending address assets.</div></p>
                        </span>
                    </div>
                    <div className="notariz-modal-body">
                        <button
                            type="submit"
                            onClick={() => {
                                props.onClose();
                                props.redeem();
                            }}
                            className="cta-button edit-button"
                        >
                            <div>
                                <Emojis symbol="✔️" label="check" /> {' Claim'}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}

export default ClaimRecoveryModal;

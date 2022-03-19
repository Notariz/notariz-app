import { Emergency } from '../../../../../models';
import { Deed } from '../../../../../models';

import { useState, useEffect, useCallback } from 'react';
import Emojis from '../../../../utils/Emojis';
import { CSSTransition } from 'react-transition-group';
import '../../../Common.css';

function RedeemEmergencyModal(props: {
    show: boolean;
    onClose: () => void;
    redeem: () => void;
    selectedSender: Emergency[];
    userBalance: string;
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
                        <h3 className="notariz-modal-title">Redeem</h3>
                        {parseFloat(props.userBalance) < 0.002 && (
                        <p className="hint">Your balance is too low to confirm the transaction.</p>
                    )}
                        <p className="hint">
                            {props.selectedSender[0] ? 'You are about to redeem ' +
                                props.selectedSender[0].percentage +
                                '% of this sender total deposit.' : null}
                        </p>
                    </div>
                    <div className="notariz-modal-body">
                        <button
                            type="submit"
                            onClick={() => {
                                props.onClose();
                                props.redeem();
                            }}
                            disabled={parseFloat(props.userBalance) < 0.002}
                            className="cta-button edit-button"
                        >
                            <div>
                                <Emojis symbol="✔️" label="check" /> {' Redeem'}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}

export default RedeemEmergencyModal;

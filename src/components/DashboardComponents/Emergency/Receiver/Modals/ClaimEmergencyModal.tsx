import { Emergency } from '../../../../../models';
import { Deed } from '../../../../../models';

import { useState, useEffect, useCallback } from 'react';
import Emojis from '../../../../utils/Emojis';
import { CSSTransition } from 'react-transition-group';
import '../../../Common.css';

function ClaimEmergencyModal(props: {
    show: boolean;
    onClose: () => void;
    claimRequest: () => void;
    cancelClaimRequest: () => void;
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
                        <span>
                            <h3 className="notariz-modal-title">Claim request</h3>
                            {parseFloat(props.userBalance) < 0.002 && (
                        <p className="hint">Your balance is too low to confirm the transaction.</p>
                    )}
                        </span>
                    </div>
                    <p className="hint">
                        {props.selectedSender.length > 0 && props.selectedSender[0].claimedTimestamp > 0
                            ? 'You are about to cancel this claim request.'
                            : 'Only use in case of emergency.'}
                    </p>
                    <div className="notariz-modal-body">
                    {props.selectedSender.length > 0 && props.selectedSender[0].claimedTimestamp > 0 ?
                        <button
                            type="submit"
                            onClick={() => {
                                props.onClose();
                                props.cancelClaimRequest();
                            }}
                            disabled={parseFloat(props.userBalance) < 0.002}
                            className="cta-button edit-button"
                        >
                                <div>
                                    <Emojis symbol="❌" label="cross" /> {' Cancel'}
                                </div>
                                </button>
                            : <button
                            type="submit"
                            onClick={() => {
                                props.onClose();
                                props.claimRequest();
                            }}
                            disabled={parseFloat(props.userBalance) < 0.002}
                            className="cta-button edit-button"
                        >
                                <div>
                                    <Emojis symbol="✔️" label="check" /> {' Claim'}
                                </div></button>}
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}

export default ClaimEmergencyModal;

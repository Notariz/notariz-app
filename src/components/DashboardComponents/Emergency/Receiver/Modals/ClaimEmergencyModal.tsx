import { useState, useEffect, useCallback } from 'react';
import Emojis from '../../../../utils/Emojis';
import { CSSTransition } from 'react-transition-group';
import '../../../Common.css';

interface EmergencyDetails {
    sender: string;
    receiver: string;
    share: number;
    claim_request_timestamp: number;
    redeem_request_timestamp: number;
}

function ClaimEmergencyModal(props: {
    show: boolean;
    onClose: () => void;
    claimRequest: () => void;
    selectedSender: EmergencyDetails[];
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
                        </span>
                    </div>
                    <span className="hint">
                        {props.selectedSender.length > 0 && props.selectedSender[0].claim_request_timestamp > 0
                            ? 'You are about to cancel this claim request.'
                            : 'Only use in case of emergency.'}
                    </span>
                    <div className="notariz-modal-body">
                        <button
                            type="submit"
                            onClick={() => {
                                props.onClose();
                                props.claimRequest();
                            }}
                            className="cta-button edit-button"
                        >
                            {props.selectedSender.length > 0 && props.selectedSender[0].claim_request_timestamp > 0 ? (
                                <div>
                                    <Emojis symbol="❌" label="cross" /> {' Cancel'}
                                </div>
                            ) : (
                                <div>
                                    <Emojis symbol="✔️" label="check" /> {' Claim'}
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}

export default ClaimEmergencyModal;

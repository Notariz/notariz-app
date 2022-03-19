import { useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Emergency, Recovery } from '../../../../models';
import Emojis from '../../../utils/Emojis';
import '../../Common.css';

function DeleteDeedModal(props: {
    emergencyList: Emergency[] | undefined;
    recoveryList: Recovery[] | undefined;
    show: boolean;
    onClose: () => void;
    deleteDeed: () => void;
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
                        <h3 className="notariz-modal-title">Deed deletion</h3>
                        {parseFloat(props.userBalance) < 0.002 && (
                        <p className="hint">Your balance is too low to confirm the transaction.</p>
                    )}
                    </div>
                    {(props.emergencyList && props.emergencyList.length > 0) ||
                        (props.recoveryList && props.recoveryList.length > 0) ? (
                            <div>
                                {props.recoveryList && props.recoveryList.length > 0 ? (
                                    <p className="hint">
                                        You still have recovery addresses set in your deed account, delete
                                        them first before deleting this deed.
                                    </p>
                                ) : null}

                                {props.emergencyList && props.emergencyList.length > 0 ? (
                                    <p className="hint">
                                        You still have emergency addresses set in your deed account, delete
                                        them first before deleting this deed.
                                    </p>
                                ) : null}
                            </div>
                        ) : (
                            <p className="hint">
                                You are about to delete your deed. You will be able to re-open a new deed account
                                afterwards.
                            </p>
                        )}
                    <div className="notariz-modal-body">
                        <button
                            onClick={() => {
                                props.deleteDeed();
                                props.onClose();
                            }}
                            className="cta-button edit-button"
                            disabled={
                                (props.emergencyList && props.emergencyList.length > 0) ||
                                (props.recoveryList && props.recoveryList.length > 0) || parseFloat(props.userBalance) < 0.002
                            }
                        >
                            <Emojis symbol="🗑️" label="wastebasket" /> Delete
                        </button>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}

export default DeleteDeedModal;

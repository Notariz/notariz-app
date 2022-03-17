import { useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import Emojis from '../../../../utils/Emojis';
import '../../../Common.css';

function DeleteRecoveryModal(props: {
    show: boolean;
    onClose: () => void;
    deleteRecovery: () => void;
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
                        <h3 className="notariz-modal-title">Delete recovery address</h3>
                        <p className="hint">
                            You are about to delete this recovery address.
                        </p>
                    </div>
                    <div className="notariz-modal-body">
                        <button onClick={() => { props.deleteRecovery(); props.onClose() }} className="cta-button edit-button">
                            <Emojis symbol="🗑️" label="wastebasket" /> Delete
                        </button>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}

export default DeleteRecoveryModal;

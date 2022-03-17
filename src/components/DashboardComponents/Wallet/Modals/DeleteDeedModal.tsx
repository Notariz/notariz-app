import { useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import Emojis from '../../../utils/Emojis';
import '../../Common.css';

function DeleteDeedModal(props: { show: boolean; onClose: () => void; deleteDeed: () => void }) {
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
                        <p><div className="hint">You are about to delete your deed. Once your deed deleted, you will not be able to recover your current emergencies and recoveries ever again.</div></p>
                    </div>
                    <div className="notariz-modal-body">
                        <button
                            onClick={() => {
                                props.deleteDeed();
                                props.onClose();
                            }}
                            className="cta-button edit-button"
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

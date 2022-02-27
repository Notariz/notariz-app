import { useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import '../Common.css';

function DeleteModal(props: {
    show: boolean;
    onClose: () => void;
    selectedField: string;
    deleteEmergency: () => void;
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
                        <h3 className="notariz-modal-title">DELETE EMERGENCY</h3>
                        <div className="modal-text">
                            You are about to <span>delete</span> this emergency.
                        </div>
                    </div>
                    <div className="notariz-modal-body">
                        <button onClick={() => { props.deleteEmergency(); props.onClose() }} className="cta-button edit-button">
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}

export default DeleteModal;

import { useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'
import './EmergencyModal.css'
import './Common.css'

function EmergencyModal(props: {show: boolean, onClose: () => void}) {
    
    const closeOnEscapeKeyDown = (e: any) => {
        if ((e.charCode || e.keyCode) === 27) {
            props.onClose()
        }
    }

    useEffect(() => {
        document.body.addEventListener('keydown', closeOnEscapeKeyDown)
        return function cleanup() {
            document.body.removeEventListener('keydown', closeOnEscapeKeyDown)
        }
          //eslint-disable-next-line
    }, [])

    return (
        <CSSTransition
            in={props.show}
            unmountOnExit
            timeout={{ enter: 0, exit: 300}}
        >

        <div className={`emergency-modal ${props.show ? 'show' : ''}`} onClick={props.onClose}>
            <div className="emergency-modal-content" onClick={e => e.stopPropagation()}>
                <div className="emergency-modal-header">
                    <h3 className="emergency-modal-title">Add an emergency</h3>
                </div>
                <div className="emergency-modal-body">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            /* Call program entry point here */
                        }}  
                    >
                        <input 
                            type='text'
                            placeholder="Emergency's public address"
                            required
                        />
                        <input 
                            type='number'
                            placeholder="Claimable amount"
                            required
                        />
                        <input 
                            type='number'
                            placeholder="Days before transfer"
                            required
                        />
                        <button onClick={props.onClose} type="submit" className="cta-button confirm-button">Submit</button>
                        <button onClick={props.onClose} className="cta-button cancel-button">Cancel</button>
                    </form>
                </div>
            </div>
        </div>

        </CSSTransition>
    )
}

export default EmergencyModal;
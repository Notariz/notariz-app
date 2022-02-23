import { useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'
import '../Common.css'

function AddModal(props: {show: boolean, onClose: () => void}) {

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

        <div className={`notariz-modal ${props.show ? 'show' : ''}`} onClick={props.onClose}>
            <div className="notariz-modal-content" onClick={e => e.stopPropagation()}>
                <div className="notariz-modal-header">
                    <h3 className="notariz-modal-title">NEW EMERGENCY ADDRESS</h3>
                </div>
                <div className="notariz-modal-body">
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

export default AddModal;
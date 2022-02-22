import { useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'
import '../Common.css'

function CancelModal(props: {show: boolean, onClose: () => void}) {
    console.log('cancel modal');

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
                    <h3 className="notariz-modal-title">CANCEL CLAIM REQUEST</h3>
                </div>
                <div className="notariz-modal-body">
                    <p>Hello</p>
                </div>
            </div>
        </div>

        </CSSTransition>
    )
}

export default CancelModal;
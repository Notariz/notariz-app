import './ToggleButton.css'

function ToggleButton(props: {profile: string; setToggle: () => void}) {
    return(
        <div onClick={props.setToggle}  className={`wrg-toggle ${props.profile === 'sender' ? 'wrg-toggle--checked' : ''}`}>
            <div className="wrg-toggle-container">
                <div className="wrg-toggle-check">
                    <span>Sender</span>
                </div>
                <div className="wrg-toggle-uncheck">
                    <span>Receiver</span>
                </div>
            </div>
            <div className="wrg-toggle-circle"></div>
            <input className="wrg-toggle-input" type="checkbox" aria-label="Toggle Button" />
        </div>
    )
}

export default ToggleButton;
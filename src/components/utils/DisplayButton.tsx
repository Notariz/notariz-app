import './DisplayButton.css';
import Emojis from './Emojis';

function DisplayButton(props: {dark: boolean; setToggle: () => void}) {
    return(
        <div className='display-button'>
            <div onClick={props.setToggle}  className={`wrg-toggle ${props.dark ? 'wrg-toggle--checked' : ''}`}>
                <div className="wrg-toggle-container">
                    <div className="wrg-toggle-check">
                        <span><Emojis symbol="☀️" label="sun" /></span>
                    </div>
                    <div className="wrg-toggle-uncheck">
                        <span><Emojis symbol="🌙" label="moon" /></span>
                    </div>
                </div>
                <div className="wrg-toggle-circle"></div>
                <input className="wrg-toggle-input" type="checkbox" aria-label="Toggle Button" />
            </div>
            </div>
    )
}

export default DisplayButton;
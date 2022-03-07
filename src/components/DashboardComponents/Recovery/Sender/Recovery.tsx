import { useCallback } from 'react';
import './Recovery.css'

function Recovery() {
    const renderDescription = useCallback(
        () => (
            <h3>Your recovery addresses will lie here once added.</h3>
        ),
        []
    );

    return(
        <div className='recovery-container'>
            {renderDescription()}
        </div>
    )
}

export default Recovery;
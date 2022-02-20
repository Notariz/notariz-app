import React, { FC } from 'react';
import './Claim.css'
import './Common.css'

export const Claim: FC = () => {
    return (
        <div className="claim-container">
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    /* Call program entry point here */
                }}  
            >
                <input 
                    type='text'
                    placeholder="Giver's public address"
                    required
                />
                <button type="submit" className="cta-button confirm-button">Submit</button>
            </form>
        </div>
    )
}

import { useCallback } from 'react';
import './Common.css';
import './About.css';

function About() {
    const renderIntro = () => (
        <div className="item-background">
            <div className="item">
                <h3>Notariz</h3>
                <p>Hey</p>
            </div>
        </div>
    );

    const renderEmergency = () => (
        <div className="item-background">
            <div className="item">
                <h3>Emergencies</h3>
                <p>Hey</p>
            </div>
        </div>
    );

    const renderRecovery = () => (
        <div className="item-background">
            <div className="item">
                <h3>Recoveries</h3>
                <p>Hey</p>
            </div>
        </div>
    );

    const renderWithdrawalPeriod = () => (
        <div className="item-background">
            <div className="item">
                <h3>Withdrawal period</h3>
                <p>Hey</p>
            </div>
        </div>
    );

    return (
        <div className="about-container">
            {renderIntro()}
            {renderEmergency()}
            {renderRecovery()}
            {renderWithdrawalPeriod()}
        </div>
    )
}

export default About;

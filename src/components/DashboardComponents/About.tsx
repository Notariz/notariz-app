import NotarizLogo from '../../img/logo.png';
import './Common.css';
import './About.css';

function About() {
    const renderIntro = () => (
        <div className="item-background">
            <div className="item">
                <h3>What is Notariz?</h3>
                <img height="100px" width="200px" alt="Notariz" src={NotarizLogo}></img>
                <p className='hint'>
                        <span>Notariz</span> is a decentralized application based on the Solana blockchain. Its purpose is to solve
                        one of the main issues with holding assets in a decentralized way: funds being lost forever when
                        holders cannot access their wallets anymore.
                </p>
                <p className="hint">Thanks to <span>Notariz</span>, no held assets can be lost anymore.
                </p>
            </div>
        </div>
    );

    const renderDeed = () => (
        <div className="item-background">
            <div className="item">
                <h3>What is a deed?</h3>
                <p className="hint">
                        Notariz allows its users to open <span>deeds</span>. Deeds basically keep track of users' asset-related
                        choices like an IRL notarial deed would do. They are necessary to define emergency and recovery
                        addresses and to send assets accordingly.
                </p>
                <p className="hint">
                        Each user can open up to <span>one</span> deed; emergency and recovery addresses do <span>not</span> need to open a deed
                        to redeem funds.
                </p>
                <p className="hint">
                        Once their deed deleted, users will recover their deposit but will lose their emergency and
                        recovery lists <span>forever</span>.
                </p>
            </div>
        </div>
    );

    const renderEmergency = () => (
        <div className="item-background">
            <div className="item">
                <h3>What is an emergency address?</h3>
                <p  className="hint">
                        Notariz users can define emergency addresses. Emergency address are basically user-whitelisted
                        Solana wallet public addresses allowed to receive a <span>percentage</span> of the user's deposit.
                   
                </p>
                <p className="hint">
                        To redeem this percentage, whitelisted addresses need to claim it and wait for the user's <span>withdrawal period</span> to
                        expire. Therefore, defined emergency addresses should solely belong to trusted users. However, they can be
                        removed from deed owners' list at any time; besides users get a website notification when a percentage is claimed.
                    
                </p>
                <p className="hint">
                        Once deed owners delete their deed, emergency address owners will not be able to redeem
                        anything.
                </p>
            </div>
        </div>
    );

    const renderWithdrawalPeriod = () => (
        <div className="item-background">
            <div className="item">
                <h3>What is a withdrawal period?</h3>
                <p className="hint">
                        The withdrawal period is a kind of <span>Proof-of-Life</span> mechanism ensuring emergency address owners
                        cannot redeem assets outside of actual emergency cases. This mechanism is inspired by password
                        managers in which users can send their credentials to other trusted users in case of emergency.
                </p>
                <p className="hint">
                        Furthermore, Notariz keep track of deed owners' <span>on-chain activity</span> to prevent any abusive asset
                        redemption.
                </p>
            </div>
        </div>
    );

    const renderRecovery = () => (
        <div className="item-background">
            <div className="item">
                <h3>What is a recovery address?</h3>
                <p  className="hint">
                        Notariz users can define recovery addresses. Recovery addresses supposedly belong to the
                        users who defined them. They are meant to recover <span>100%</span> of users' deposit in case, for instance,
                        users lose their main wallet seed phrase.
                </p>
                <p className="hint">They can be removed from deed owners' list at any time.</p>
                <p className="hint">
                        Once deed owners delete their deed, they will not be able to redeem anything through their
                        recovery address.
                </p>
            </div>
        </div>
    );

    const renderKeepAlive = () => (
        <div className="item-background">
            <div className="item">
                <h3>What is a keep alive?</h3>
                <p className="hint">
                        Notariz keep track of users' on-chain activity. This prevents emergency address owners from
                        redeeming their share if they claimed it before the user's last on-chain activity.
                </p>
                <p className="hint">
                        Sending a keep alive signal through the dashboard allows users to <span>update</span> their last on-chain
                        activity timestamp without having to perform any other tx.
                </p>
            </div>
        </div>
    );

    const renderAlias = () => (
        <div className="item-background">
            <div className="item">
                <h3>What is a nickname?</h3>
                <p className="hint">
                        Deed owners can define name aliases for their emergency addresses to help them remember
                        which belongs to whom. 
                </p>
                <p className="hint">
                        Since aliases are mere front-end helpers, they are stored locally and will <span>not</span> persist in another browser. 
                        Therefore, deed owners should keep track of their defined nicknames on their own.
                </p>
            </div>
        </div>
    );

    return (
        <div className="about-container">
            {renderIntro()}
            {renderDeed()}
            {renderEmergency()}
            {renderWithdrawalPeriod()}
            {renderRecovery()}
            {renderKeepAlive()}
            {renderAlias()}
        </div>
    );
}

export default About;

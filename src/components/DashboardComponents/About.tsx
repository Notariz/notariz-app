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
                        Notariz is a <span>decentralized</span> application based on the Solana blockchain. Its purpose is to solve
                        one of the main issues with holding assets in a decentralized way: funds being lost forever when
                        holders cannot access their wallets anymore.
                </p>
                <p className="hint">Thanks to Notariz, no held assets can be lost anymore.
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
                        Each user can open up to one deed; emergency and recovery addresses do not need to open a deed
                        to <span>redeem</span> funds.
                </p>
                <p className="hint">
                        Once their deed deleted, users will <span>recover</span> their deposit.
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
                        Solana wallet public addresses allowed to receive a <span>share</span> of the user's deposit.
                   
                </p>
                <p className="hint">
                        To redeem this share, whitelisted addresses need to claim it and wait for the user's <span>withdrawal period</span> to
                        expire. Therefore, defined emergency addresses should solely belong to trusted users. However, they can be
                        removed from deed owners' list at any time; besides users get a website <span>notification</span> when a percentage is claimed.
                    
                </p>
                <p className="hint">
                        Once deed owners delete their deed, emergency address owners will obviously not be able to redeem
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
                        Furthermore, Notariz keeps track of deed owners' <span>on-chain activity</span> to prevent any abusive asset
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
                        Notariz users can define <span>recovery</span> addresses. Recovery addresses supposedly belong to the
                        users who defined them. They are meant to recover <span>100%</span> of users' deposit in case, for instance,
                        users lose their main wallet seed phrase.
                </p>
                <p className="hint">They can be removed from deed owners' list at any time.</p>
                <p className="hint">
                        Once deed owners delete their deed, they will obviously not be able to redeem anything through their
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
                        Notariz keeps track of users' contract <span>interactions</span>. This prevents emergency address owners from
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
                        To ensure privacy, they are stored locally and will not persist in another browser. 
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

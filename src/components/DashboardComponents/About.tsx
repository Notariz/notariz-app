import NotarizLogo from '../../img/logo.png'
import './Common.css';
import './About.css';

function About() {
    const renderIntro = () => (
        <div className="item-background">
            <div className="item">
                <h3>What is Notariz?</h3>
                <img height="100px" width="200px" alt="Notariz" src={NotarizLogo}></img>
                <p>
                    <div className="hint">
                        Notariz is a decentralized application based on the Solana blockchain. Its purpose is to solve
                        one of the main issues with holding assets in a decentralized way: funds being lost forever when
                        holders cannot access their wallets anymore.
                    </div>{' '}
                </p>
                <p>
                    <div className="hint">Thanks to Notariz, no held assets can be lost.</div>
                </p>
            </div>
        </div>
    );

    const renderDeed = () => (
        <div className="item-background">
            <div className="item">
                <h3>What is a deed?</h3>
                <p>
                    <div className="hint">
                        Notariz allows its users to open deeds. Deeds basically keep track of users' asset-related
                        choices like an IRL notarial deed would do. They are necessary to define emergency and recovery
                        addresses and to send assets accordingly.
                    </div>{' '}
                </p>
                <p>
                    <div className="hint">
                        Each user can open up to one deed; emergency and recovery addresses to not need to open a deed
                        to redeem funds.
                    </div>
                </p>
                <p>
                    <div className="hint">
                        Once their deed deleted, users will recover their deposit but will lose their emergency and
                        recovery lists forever.
                    </div>
                </p>
            </div>
        </div>
    );

    const renderEmergency = () => (
        <div className="item-background">
            <div className="item">
                <h3>What is an emergency address?</h3>
                <p>
                    <div className="hint">
                        Notariz users can define emergency addresses. Emergency address are basically user-whitelisted
                        Solana wallet public addresses allowed to receive a percentage of the user's deposit.
                    </div>{' '}
                </p>
                <p>
                    <div className="hint">
                        To redeem this percentage, whitelisted addresses wait for the user's withdrawal period to
                        expire. Therefore, defined emergency addresses should belong to trusted users. They can be
                        removed from deed owners' list at any time.
                    </div>
                </p>
                <p>
                    <div className="hint">
                        Once deed owners delete their deed, emergency address owners will not be able to redeem
                        anything.
                    </div>
                </p>
            </div>
        </div>
    );

    const renderWithdrawalPeriod = () => (
        <div className="item-background">
            <div className="item">
                <h3>What is a withdrawal period?</h3>
                <p>
                    <div className="hint">
                        The withdrawal period is a kind of Proof-of-Life mechanism ensuring emergency address owners
                        cannot redeem assets outside of actual emergency cases. This mechanism is inspired by password
                        managers in which users can send their credentials to other trusted users in case of emergency.
                    </div>
                </p>
                <p>
                    <div className="hint">
                        Furthermore, Notariz keep track of deed owners' on-chain activity to prevent any abusive asset
                        redemption.
                    </div>
                </p>
            </div>
        </div>
    );

    const renderRecovery = () => (
        <div className="item-background">
            <div className="item">
                <h3>What is a recovery address?</h3>
                <p>
                    <div className="hint">
                        Notariz users can define recovery addresses. Recovery addresses theoretically belong to the
                        users who defined them. They are meant to recover 100% of users' deposit in case, for instance,
                        users lose their main wallet seed phrase.
                    </div>
                </p>
                <p>
                    <div className="hint">They can be removed from deed owners' list at any time.</div>
                </p>
                <p>
                    <div className="hint">
                        Once deed owners delete their deed, they will not be able to redeem anything through their
                        recovery address.
                    </div>
                </p>
            </div>
        </div>
    );

    const renderKeepAlive = () => (
        <div className="item-background">
            <div className="item">
                <h3>What is a keep alive?</h3>
                <p>
                    <div className="hint">
                        Notariz keep track of users' on-chain activity. This prevents emergency address owners from
                        redeeming their share if they claimed it before the user's last on-chain activity.
                    </div>
                </p>
                <p>
                    <div className="hint">
                        Sending a keep alive signal through the dashboard allows users to refresh their last on-chain
                        activity timestamp without having to perform any other tx.
                    </div>
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
        </div>
    );
}

export default About;

import Emergency from './DashboardComponents/Emergency';
import Claim from './DashboardComponents/Claim';
import Pending from './DashboardComponents/Pending';
import { Tab, Tabs } from 'react-bootstrap';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import './DashboardComponents/Common.css';

function Dashboard() {
    const { publicKey } = useWallet();

    const renderWalletNotConnected = () => {
        return (
            <div className='not-connected-container'>
                <p>Think of tomorrow.</p>
                <WalletMultiButton />
            </div>
        )
    }

    const renderWalletConnected = () => {
        return (
            <Tabs defaultActiveKey="emergency" id="tabs" className="mb-3">
                <Tab eventKey="emergency" title="Emergency list" className='tab-content'>
                    <Emergency />
                </Tab>
                <Tab eventKey="claim" title="Lists mentioning you" className='tab-content'>
                    <Claim />
                </Tab>
                <Tab eventKey="pending" title="Pending requests" className='tab-content'>
                    <Pending />
                </Tab>
            </Tabs>
        )
    }

    return (
        <div className='dashboard-container'>
            {!publicKey && renderWalletNotConnected()}
            {publicKey && renderWalletConnected()}
        </div>
    )
}

export default Dashboard;
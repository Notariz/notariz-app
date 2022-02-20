import React, { FC } from 'react';
import { Emergency } from './DashboardComponents/Emergency';
import { Claim } from './DashboardComponents/Claim';
import { Pending } from './DashboardComponents/Pending';
import { Tab, Tabs } from 'react-bootstrap';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';

export const Dashboard: FC = () => {
    return (
        <div className='dashboard-container'>

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
        </div>
    )
}

export default Dashboard;
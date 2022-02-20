import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import React, { FC, useCallback, useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './DashboardComponents/Common.css';
import './Header.css';

export const Header: FC = () => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [airdropping, setAirdropping] = useState(false);

    const claimAirdrop = useCallback(() => {
        if (airdropping) return;

        setAirdropping(true);
        if (!publicKey) throw new WalletNotConnectedError();

        let connection = new Connection(clusterApiUrl('testnet'));

        connection
            .requestAirdrop(publicKey, LAMPORTS_PER_SOL)
            .then((confirmation) => connection.confirmTransaction(confirmation, 'processed'))
            .catch(() => alert('Airdrop failed!'))
            .finally(() => setAirdropping(false));
    }, [publicKey, connection]);

    return (
        <Navbar expand="lg" variant="dark" fixed="top">
            <Container>
                <Navbar.Brand className="fs-3" href="/">
                    <p>Notariz</p>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink className="nav-link" to="/Dashboard">
                            <p>Dashboard</p>
                        </NavLink>
                        <NavLink className="nav-link" to="/About">
                            <p>About</p>
                        </NavLink>
                    </Nav>
                    {publicKey && (
                        <button className="cta-button airdrop-button" onClick={claimAirdrop} disabled={airdropping}>
                            Airdrop
                        </button>
                    )}
                    <WalletMultiButton className="cta-button" />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

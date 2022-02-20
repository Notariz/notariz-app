import React, { FC } from 'react';
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import "./Header.css";

export const Header: FC = () => {
    return(
        <Navbar expand="lg" variant="dark" fixed="top">
            <Container>
                <Navbar.Brand className = "fs-3" href="/">
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
                    <WalletMultiButton />
                </Navbar.Collapse> 
            </Container>
        </Navbar>
    );
}
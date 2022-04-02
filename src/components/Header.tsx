import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useCallback, useState } from 'react';
import { Container, Nav, Navbar, ToggleButton } from 'react-bootstrap';
import AirdropModal from './AirdropModal';
import NotarizLogo from '../img/logo.png'
import './DashboardComponents/Common.css';
import './Header.css';

function Header(props: {dark: boolean}) {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [airdropping, setAirdropping] = useState(false);
    const [show, setShow] = useState(false);
    const [dark, setDark] = useState(true);

    const claimAirdrop = useCallback(() => {
        if (airdropping) return;

        setAirdropping(true);
        setShow(true);
        if (!publicKey) return;

        const connection = new Connection(clusterApiUrl('devnet'));

        connection
            .requestAirdrop(publicKey, LAMPORTS_PER_SOL)
            .then((confirmation) => connection.confirmTransaction(confirmation, 'processed'))
            .catch(() => alert('Airdrop failed!'))
            .finally(() => {
                 setAirdropping(false);
                 setShow(false);
                })
    }, [publicKey, airdropping, connection]);

    const setDisplayToggle = () => {
        setDark(!dark)
    };

    return (
        <Navbar expand="lg" variant="dark" fixed="top">
            <Container>
                <Navbar.Brand className="fs-3" href="/">
                    <img height="50px" width="100px" alt="Notariz" src={NotarizLogo}></img>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        
                    </Nav>
                    {/*<DisplayButton dark={dark} setToggle={setDisplayToggle} />*/}
                    {publicKey && (
                        <button className="cta-button airdrop-button" onClick={claimAirdrop} disabled={airdropping}>
                            Airdrop
                        </button>
                    )}
                    <AirdropModal onClose={() => setShow(false)} show={show} />
                    <WalletMultiButton />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;

import { Col, Container, Row } from 'react-bootstrap';
import './Footer.css';

function Footer(props: { dark: boolean }) {
    return (
        <Container fluid className="footer">
            <Row>
                <Col></Col>
                <Col xs={12}>
                    <div className="footer-text">
                        {/* 
                        <span><a target="_blank" rel="noreferrer"
                            href="https://github.com/Notariz/notariz-whitepaper">Whitepaper</a>
                        </span>*/}
                        <span>
                            {' '}
                            <i className="fa fa-github"></i>
                            <a target="_blank" rel="noreferrer" href="https://github.com/Notariz">
                                {' Github'}
                            </a>
                        </span>
                        <span>Copyright Notariz {new Date().getFullYear()}</span>
                    </div>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    );
}

export default Footer;

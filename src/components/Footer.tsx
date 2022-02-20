import React, { FC } from 'react';
import { Col, Container, Row } from "react-bootstrap";
import "./Footer.css";

export const Footer: FC = () => {
    return (
        <Container fluid className="footer">
            <Row>
                <Col></Col>
                <Col>
                    <div className="footer-text">
                        <span><a target="_blank" rel="noreferrer"
                            href="https://github.com/Notariz/notariz-whitepaper">Whitepaper</a>
                        </span>
                        <span><a target="_blank" rel="noreferrer" href="https://github.com/Notariz">Github</a></span>
                        <span>Copyright Notariz {new Date().getFullYear()}</span>
                    </div>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    );
}
import React, { FC } from 'react';
import { useCallback, useState } from "react"
import EmergencyModal from './EmergencyModal'
import { Container, Col, Row } from 'react-bootstrap';
import './Emergency.css'
import './Common.css'

interface EmergencyDetails {
    id: number,
    pk: string;
    amount: number;
    symbol: string;
    delay: number;
}

const TEST_EMERGENCY_LIST: EmergencyDetails[] = [
    {
        id: 1,
        pk: "4cjmQjJuB4WzUqqtt6VLycjXTaRvgL",
        amount: 1,
        symbol: "SOL",
        delay: 959623689
    },
    {
        id: 2,
        pk: "sH2FTJKB9naMwYB7zRTch2bNFBpvwj",
        amount: 2,
        symbol: "SOL",
        delay: 4088984
    },
    {
        id: 3,
        pk: "tt6VLycjXTaRvgLNhz6ZzRTch2bNFB",
        amount: 3,
        symbol: "SOL",
        delay: 366000
    },
    {
        id: 4,
        pk: "tt6VLycjfefTaRvgLNhz6ZzRTch2bNFB",
        amount: 3,
        symbol: "SOL",
        delay: 366000
    },
    {
        id: 5,
        pk: "tt6VLycjfefTaRvgfe89z6ZzRTch2bNFB",
        amount: 3,
        symbol: "SOL",
        delay: 366000
    }
]

function Emergency() {
    const [show, setShow] = useState(false)

    function secondsToDhms(seconds: number) {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600 * 24));

        return d > 0 ? d + (d === 1 ? " day " : " days ") : "";
    }

    const renderEmergencyList = useCallback(() => (
        <div className="emergency-list">
            {TEST_EMERGENCY_LIST.map(value => 
                <div key={value.pk}>
                    <Container>
                        <Row>
                            <Col xs={9}>
                                <p>{value.pk.substring(1, 6) + "..." + value.pk.substring(value.pk.length - 5) + " "}
                                <i className="fa fa-arrow-left"></i> 
                                {" " + value.amount + " " + value.symbol + " "}
                                <i className="green">{"after"}</i>
                                {" " + secondsToDhms(value.delay)}
                                </p></Col>
                            <Col>
                                <form onSubmit={(event) => {
                                    event.preventDefault();
                                    TEST_EMERGENCY_LIST.splice(value.id, 1)
                                }}>
                                    <button>REMOVE</button>
                                </form>
                            </Col>
                        </Row>
                    </Container>
                </div>
            )}
        </div>
    ), []);
    
    return (
        <div className="emergency-container">
            <button onClick={() => setShow(true)} className="cta-button confirm-button">ADD AN EMERGENCY ADDRESS</button>
            <EmergencyModal onClose={() => setShow(false)} show={show} />
            {renderEmergencyList()}
        </div>
    )
}

export default Emergency;
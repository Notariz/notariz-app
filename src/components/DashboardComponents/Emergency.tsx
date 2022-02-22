import { useCallback, useState } from "react"
import AddModal from './Modals/AddModal'
import EditModal from "./Modals/EditModal"
import CancelModal from "./Modals/CancelModal"
import DeleteModal from "./Modals/DeleteModal"
import Emojis from "../utils/Emojis"
import './Emergency.css'
import './Common.css'

interface EmergencyDetails {
    id: number,
    pk: string;
    alias: string;
    amount: number;
    symbol: string;
    delay: number;
    claimed: boolean;
    redeemed: boolean;
}

const TEST_EMERGENCY_LIST: EmergencyDetails[] = [
    {
        id: 1,
        pk: "4cjmQjJuB4WzUqqtt6VLycjXTaRvgL",
        alias: "Alice",
        amount: 1,
        symbol: "SOL",
        delay: 95962,
        claimed: false,
        redeemed: false
    },
    {
        id: 2,
        pk: "sH2FTJKB9naMwYB7zRTch2bNFBpvwj",
        alias: "Bob",
        amount: 2,
        symbol: "SOL",
        delay: 4088984,
        claimed: true,
        redeemed: false
    },
    {
        id: 3,
        pk: "tt6VLycjXTaRvgLNhz6ZzRTch2bNFB",
        alias: "Jeff",
        amount: 3,
        symbol: "SOL",
        delay: 366000,
        claimed: true,
        redeemed: true
    },
]

function Emergency() {
    const [showAddModal, setAddModalShow] = useState(false);
    const [showCancelModal, setCancelModalShow] = useState(false);
    const [showEditModal, setEditModalShow] = useState(false);
    const [showDeleteModal, setDeleteModalShow] = useState(false);

    function secondsToDhms(seconds: number) {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600 * 24));

        return d > 0 ? d + (d === 1 ? " day " : " days ") : "";
    }

    const renderEmergencyList = useCallback(
        () => (
            <div className="emergency-list">
                {TEST_EMERGENCY_LIST.map((value) => (
                    <div key={value.pk} className="emergency-item">
                        <p>
                            {value.pk.substring(1, 6) + '...' + value.pk.substring(value.pk.length - 5) + ' ' + (value.alias.length > 0 ? '(' + value.alias + ')' : '') + ' '}
                            <i className="fa fa-arrow-left"></i>
                            {' ' + value.amount + ' ' + value.symbol + ' '}
                            <i className="green">{'after'}</i>
                            {' ' + secondsToDhms(value.delay)}
                        </p>
                        <button onClick={() => setCancelModalShow(true)} className="cta-button status-button" disabled={!value.claimed || value.redeemed}>
                            {value.claimed === true ? (
                                value.redeemed === true ? (
                                    "REDEEMED"
                                ) : (
                                    <div>
                                        <Emojis symbol="⏳" label="sheep" />
                                        CLAIMED
                                    </div>
                                )
                            ) : (
                                "UNCLAIMED"
                            )}
                        </button>
                        <button onClick={() => setEditModalShow(true)} className="modify-button">MODIFY</button>
                        <button onClick={() => setDeleteModalShow(true)} className="delete-button">DELETE</button>
                    </div>
                ))}
            </div>
        ),
        []
    );
    
    return (
        <div className="emergency-container">
            <button onClick={() => setAddModalShow(true)} className="cta-button confirm-button">ADD AN EMERGENCY ADDRESS</button>
            <AddModal onClose={() => setAddModalShow(false)} show={showAddModal} />
            <CancelModal onClose={() => setCancelModalShow(false)} show={showCancelModal} />
            <EditModal onClose={() => setEditModalShow(false)} show={showEditModal} />
            <DeleteModal onClose={() => setDeleteModalShow(false)} show={showDeleteModal} />
            {renderEmergencyList()}
        </div>
    )
}

export default Emergency;
import { useCallback, useState } from 'react';
import AddSenderModal from './Modals/AddModal';
import './ClaimEmergency.css'
import '../../Common.css'

function Claim() {
    const [showAddSenderModal, setAddSenderModalShow] = useState(false);
    const [formIsCorrect, setFormIsCorrect] = useState(false);
    const [senderList, setSenderList] = useState<string[]>([]);

    const addSender = async (inputValue: string) => {
        if (
            inputValue.length >= 32 && inputValue.length <= 44
        ) {
            setFormIsCorrect(true);
            setSenderList([...senderList, inputValue]);
        } else {
            setFormIsCorrect(false);
        }
    };

    const renderSenderList = useCallback(
        () => (
            <div className="emergency-list">
                {senderList.map((value) => (
                    <div key={value} className="emergency-item">
                        <p>
                            Hello
                        </p>

                    </div>
                ))}
            </div>
        ),
        [senderList]
    );

    console.log(senderList);

    return (
        <div className="claim-container">
            <button onClick={() => setAddSenderModalShow(true)} className="cta-button confirm-button">ADD A SENDER ADDRESS</button>
            {senderList.length > 0 ? renderSenderList() : null}
            <AddSenderModal
                onClose={() => setAddSenderModalShow(false)}
                show={showAddSenderModal}
                addSender={addSender}
                formIsCorrect={formIsCorrect}
            />
        </div>
    )
}

export default Claim;
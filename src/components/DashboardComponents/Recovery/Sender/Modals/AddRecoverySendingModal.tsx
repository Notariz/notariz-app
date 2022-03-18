import { Deed, Recovery } from '../../../../../models';

import { useEffect, useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { CSSTransition } from 'react-transition-group';
import Emojis from '../../../../utils/Emojis';
import '../../../Common.css';
import { PublicKey } from '@solana/web3.js';
import { web3 } from '@project-serum/anchor';

let dummyAddress = web3.Keypair.generate();

function AddRecoverySendingModal(props: {
    show: boolean;
    onClose: () => void;
    isMentioned: boolean;
    addRecovery: (inputValue: Recovery) => void;
    openDeed: Deed;
    recoveryPk: PublicKey;
}) {
    const { publicKey } = useWallet();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [inputValue, setInputValue] = useState<Recovery>({
        publicKey: props.recoveryPk,
        upstreamDeed: props.openDeed.publicKey,
        owner: props.openDeed.owner,
        receiver: dummyAddress.publicKey,
    });

    const closeOnEscapeKeyDown = (e: any) => {
        if ((e.charCode || e.keyCode) === 27) {
            props.onClose();
        }
    };

    useEffect(() => {
        document.body.addEventListener('keydown', closeOnEscapeKeyDown);
        return function cleanup() {
            document.body.removeEventListener('keydown', closeOnEscapeKeyDown);
        };
        //eslint-disable-next-line
    }, []);

    const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setInputValue((prevState) => ({ ...prevState, [name]: value }));
    };

    return (
        <CSSTransition in={props.show} unmountOnExit timeout={{ enter: 0, exit: 300 }}>
            <div className={`notariz-modal ${props.show ? 'show' : ''}`} onClick={props.onClose}>
                <div className="notariz-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="notariz-modal-header">
                        <h3 className="notariz-modal-title">New receiving address</h3>
                    </div>
                    {inputValue.receiver.toString() === dummyAddress.publicKey.toString() ? <p className='hint'>Replace default dummy address with your actual recovery's.</p>:null}
                    <div className="notariz-modal-body">
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                {
                                    setIsSubmitted(true);
                                    !props.isMentioned
                                        ? (setInputValue({
                                              publicKey: props.recoveryPk,
                                              upstreamDeed: props.openDeed.publicKey,
                                              owner: props.openDeed.owner,
                                              receiver: inputValue.receiver,
                                          }),
                                          props.onClose(),
                                          setIsSubmitted(false))
                                        : null;
                                }
                                /* Call program entry point here */
                            }}
                        >
                            {isSubmitted ? (
                                <span className="hint">
                                    Your receiving recovery address should be 32-to-44-character long.
                                </span>
                            ) : null}
                            {isSubmitted && props.isMentioned ? (
                                <span className="hint">This recovery address is already mentioned in your deed.</span>
                            ) : null}
                            <input
                                name="receiver"
                                type="text"
                                placeholder="Your receiving recovery address"
                                value={inputValue.receiver.toString()}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="submit"
                                onClick={() => {
                                    inputValue.receiver = new PublicKey(inputValue.receiver)
                                    props.addRecovery(inputValue)
                                }}
                                className="cta-button edit-button"
                            >
                                <div>
                                    <Emojis symbol="✔️" label="check" /> {' Submit'}
                                </div>{' '}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}

export default AddRecoverySendingModal;

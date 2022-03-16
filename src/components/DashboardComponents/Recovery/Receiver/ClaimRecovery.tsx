import { Deed } from '../../../../models';
import { Recovery } from '../../../../models';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, Provider, Wallet, web3, BN } from '@project-serum/anchor';
import { clusterApiUrl, Connection, Transaction, PublicKey, LAMPORTS_PER_SOL, ConfirmOptions } from '@solana/web3.js';
import idl from '../../../../idl.json';

import { useCallback, useEffect, useMemo, useState } from 'react';
import ClaimRecoveryModal from './Modals/ClaimRecoveryModal';
import '../Sender/SendRecovery.css';

const { SystemProgram, Keypair } = web3;

const opts: ConfirmOptions = {
    commitment: 'processed',
};

const programID = new PublicKey(idl.metadata.address);

function ClaimRecovery(props: {
    recoverySendersList: Recovery[] | undefined;
    setRecoverySendersList: (emergencies: Recovery[] | undefined) => void;
    refreshRecoverySendersData: () => any;
    upstreamDeeds: Deed[] | undefined;
}) {
    const wallet = useWallet();
    const { publicKey, sendTransaction } = wallet;
    const { connection } = useConnection();
    const provider = new Provider(connection, wallet as any, opts);
    const program = new Program(idl as any, programID, provider);

    const [showClaimModal, setClaimModalShow] = useState(false);
    const [selectedSender, setSelectedSender] = useState<Recovery | undefined>();

    const selectedRecovery = props.recoverySendersList?.filter(function (recovery) {
        return recovery === selectedSender;
    });

    const selectedUpstreamDeed = props.upstreamDeeds?.filter(function (deed) {
        if (!selectedRecovery || !selectedSender) return;
        return deed.owner === selectedRecovery[0].owner;
    });

    const renderDescription = useMemo(
        () => (
            <div className="recovery-item-background">
                <div className="recovery-item">
                    <h3>Addresses who defined you as a recovery will lie here.</h3>
                    <p><div className="hint">As a recovery address, you may redeem 100% of what these addresses deposited in their deed account.</div></p>
                </div>
            </div>
        ),
        []
    );

    const renderRecoveryList = useMemo(
        () => (
            <div>
                {props.recoverySendersList &&
                    props.recoverySendersList.map((value, index) => (
                        <div key={index} className="recovery-item-background">
                            <div className="recovery-item">
                                <h3>{'Recovery address ' + (index + 1)}</h3>
                                <p>
                                    {value.owner.toString().substring(0, 5) +
                                        '..' +
                                        value.owner.toString().substring(value.owner.toString().length - 5) +
                                        ' '}
                                    <span>
                                        <i className="fa fa-arrow-right"></i>
                                    </span>
                                    {' 100% '}
                                    <span>
                                        <i className="fa fa-arrow-right"></i>
                                    </span>
                                    {' Me'}
                                </p>
                                <button
                                    onClick={() => (setSelectedSender(value), setClaimModalShow(true))}
                                    className="cta-button status-button"
                                >
                                    Redeem
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
        ),
        [props.recoverySendersList]
    );

    const redeem = async () => {
        if (!selectedRecovery || !props.recoverySendersList) return;

        const recovery = selectedRecovery[0];

        await program.rpc.redeemRecovery({
            accounts: {
                recovery: recovery.publicKey,
                receiver: recovery.receiver,
                deed: recovery.upstreamDeed,
                systemProgram: SystemProgram.programId,
            },
        });

        props.refreshRecoverySendersData();
    };

    return (
        <div className="recovery-container">
            {props.recoverySendersList && (
                <ClaimRecoveryModal
                    onClose={() => setClaimModalShow(false)}
                    show={showClaimModal}
                    redeem={redeem}
                    selectedSender={props.recoverySendersList.filter((recovery) => {
                        return selectedSender === recovery;
                    })}
                />
            )}
            <div className="recovery-list">
                {props.recoverySendersList && props.recoverySendersList.length > 0
                    ? renderRecoveryList
                    : renderDescription}
            </div>
        </div>
    );
}

export default ClaimRecovery;

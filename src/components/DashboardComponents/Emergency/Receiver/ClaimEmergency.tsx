import { Emergency } from '../../../../models/Emergency';
import { Deed } from '../../../../models/Deed';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, Provider, Wallet, web3, BN } from '@project-serum/anchor';
import { clusterApiUrl, Connection, Transaction, PublicKey, LAMPORTS_PER_SOL, ConfirmOptions } from '@solana/web3.js';

import { useCallback, useState, useEffect } from 'react';
import Countdown from 'react-countdown';
import ClaimEmergencyModal from './Modals/ClaimEmergencyModal';
import RedeemEmergencyModal from './Modals/RedeemEmergencyModal';
import Emojis from '../../../utils/Emojis';
import './ClaimEmergency.css';
import '../../Common.css';
import { useMemo } from 'react';
import idl from '../../../../idl.json';

const { SystemProgram, Keypair } = web3;

const opts: ConfirmOptions = {
    commitment: 'processed',
};

const programID = new PublicKey(idl.metadata.address);
interface DeedBalance {
    deed: PublicKey;
    balance: number;
}

const WITHDRAWAL_PERIOD = 4;

function ClaimEmergency(props: {
    upstreamDeedsBalance: DeedBalance[] | undefined;
    getUpstreamDeedsBalance: () => void;
    emergencySenderList: Emergency[] | undefined;
    setEmergencySenderList: (emergencies: Emergency[] | undefined) => void;
    refreshEmergencySendersData: () => any;
    upstreamDeeds: Deed[] | undefined;
}) {
    const [showRedeemModal, setRedeemModalShow] = useState(false);
    const [showClaimModal, setClaimModalShow] = useState(false);
    const [selectedSender, setSelectedSender] = useState<Emergency | undefined>();
    const [formIsCorrect, setFormIsCorrect] = useState(false);
    const [senderExists, setSenderExists] = useState(false);
    const [senderIsMentioned, setSenderIsMentioned] = useState(false);

    const wallet = useWallet();
    const { publicKey, sendTransaction } = wallet;
    const { connection } = useConnection();

    const provider = new Provider(connection, wallet as any, opts);
    const program = new Program(idl as any, programID, provider);

    const selectedEmergency = props.emergencySenderList?.filter(function (emergency) {
        return emergency.owner === selectedSender?.owner;
    });

    const selectedUpstreamDeed = props.upstreamDeeds?.filter(function (deed) {
        if (!selectedEmergency || !selectedSender) return;
        return deed.owner === selectedEmergency[0].owner;
    });

    const upstreamDeedBalance = props.upstreamDeedsBalance?.filter(function (upstreamDeed) {
        if (!props.upstreamDeedsBalance) return;

        return props.upstreamDeedsBalance[0].deed === upstreamDeed.deed;
    });

    const claimRequest = async () => {
        if (!selectedEmergency || !props.emergencySenderList) return;

        const emergency = selectedEmergency[0];

        await program.rpc.claimEmergency({
            accounts: {
                emergency: emergency.publicKey,
                receiver: emergency.receiver,
            },
        });

        props.refreshEmergencySendersData();
    };

    const redeem = async () => {
        if (!selectedEmergency || !props.emergencySenderList) return;

        const emergency = selectedEmergency[0];

        await program.rpc.redeemEmergency({
            accounts: {
                emergency: emergency.publicKey,
                receiver: emergency.receiver,
                deed: emergency.upstreamDeed,
                systemProgram: SystemProgram.programId,
            },
        });

        props.refreshEmergencySendersData();
    };

    const renderSenderList = useMemo(
        () => (
            <div className="claim-emergency-list">
                {props.emergencySenderList
                    ? props.emergencySenderList.map((value, index) => (
                          <div key={index} className="claim-emergency-background">
                              <div className="claim-emergency-item">
                                  <h3>{'Sender ' + (index + 1)}</h3>
                                  <p>
                                      {value.owner.toString().substring(0, 5) +
                                          '..' +
                                          value.owner.toString().substring(value.owner.toString().length - 5) +
                                          ' '}
                                      <i className="fa fa-arrow-right"></i>
                                      {' ' + value.percentage + '% '}
                                      <i className="fa fa-arrow-right"></i>
                                      {' Me '}
                                      <a
                                          href={
                                              'https://explorer.solana.com/address/' +
                                              value.publicKey.toString() +
                                              '?cluster=devnet'
                                          }
                                      >
                                          <Emojis symbol="📜" label="scroll" />
                                      </a>
                                  </p>
                                  {value.owner && props.upstreamDeeds && value.claimedTimestamp > 0 ? (
                                      <div>
                                          {props.upstreamDeeds.length > 0 && Date.now() < value.claimedTimestamp * 1000 + props.upstreamDeeds[index].withdrawalPeriod * 1000 && value.claimedTimestamp > props.upstreamDeeds[index].lastSeen ? (
                                              <div>
                                                  <button
                                                      className="cta-button confirm-button"
                                                      onClick={() => {
                                                          setClaimModalShow(true); setSelectedSender(value);
                                                      }}
                                                  >
                                                      Claimed
                                                  </button>
                                                  <button className="cta-button delete-button">
                                                      <div>
                                                          <Emojis symbol="⏳" label="hourglass" />
                                                          <Countdown
                                                              date={value.claimedTimestamp * 1000 + props.upstreamDeeds[index].withdrawalPeriod * 1000}
                                                          />
                                                      </div>
                                                  </button>
                                              </div>
                                          ) : (
                                              <div>
                                                  <button
                                                      className="cta-button confirm-button"
                                                      onClick={() => (
                                                          setRedeemModalShow(true), setSelectedSender(value)
                                                      )}
                                                  >
                                                      Redeem
                                                  </button>
                                                  <button className="cta-button delete-button">
                                                          <Emojis symbol="⏳" label="hourglass" /> {'00:00:00:00'}
                                                  </button>
                                              </div>
                                          )}
                                      </div>
                                  ) : (
                                      <div>
                                          {value.owner && props.upstreamDeeds ? (
                                              <div>
                                                  <button
                                                      className="cta-button status-button"
                                                      onClick={() => (
                                                          setClaimModalShow(true), setSelectedSender(value)
                                                      )}
                                                  >
                                                      Claim
                                                  </button>
                                                  <button className="cta-button delete-button">
                                                      <Emojis symbol="⏳" label="hourglass" />
                                                      {props.upstreamDeeds.length > 0 && ' ' + props.upstreamDeeds[index].withdrawalPeriod / 3600 / 24 + ' days'}
                                                  </button>
                                              </div>
                                          ) : null}
                                      </div>
                                  )}
                              </div>
                          </div>
                      ))
                    : null}
            </div>
        ),
        [props.emergencySenderList, selectedUpstreamDeed]
    );

    const renderDescription = useMemo(
        () => (
            <div className="claim-emergency-item">
                <h3>Your senders will lie here.</h3>
            </div>
        ),
        []
    );

    return (
        <div className="claim-emergency-container">
            {props.emergencySenderList && props.emergencySenderList.length > 0 ? (
                <div>
                    {renderSenderList}
                    <ClaimEmergencyModal
                        onClose={() => setClaimModalShow(false)}
                        show={showClaimModal}
                        claimRequest={claimRequest}
                        selectedSender={props.emergencySenderList.filter((emergency) => {
                            return selectedSender?.owner === emergency.owner;
                        })}
                    />
                    <RedeemEmergencyModal
                        onClose={() => setRedeemModalShow(false)}
                        show={showRedeemModal}
                        redeem={redeem}
                        selectedSender={props.emergencySenderList.filter((emergency) => {
                            return selectedSender?.owner === emergency.owner;
                        })}
                    />
                </div>
            ) : (
                renderDescription
            )}
        </div>
    );
}

export default ClaimEmergency;

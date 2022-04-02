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

function ClaimEmergency(props: {
    upstreamDeedsBalance: DeedBalance[] | undefined;
    getUpstreamDeedsBalance: () => void;
    emergencySenderList: Emergency[] | undefined;
    setEmergencySenderList: (emergencies: Emergency[] | undefined) => void;
    refreshEmergencySendersData: () => any;
    upstreamDeeds: Deed[] | undefined;
    userBalance: string;
    getUserBalance: () => string | undefined;
}) {
    const [showRedeemModal, setRedeemModalShow] = useState(false);
    const [showClaimModal, setClaimModalShow] = useState(false);
    const [selectedSender, setSelectedSender] = useState<Emergency | undefined>();

    const wallet = useWallet();
    const { publicKey, sendTransaction } = wallet;
    const { connection } = useConnection();

    const provider = new Provider(connection, wallet as any, opts);
    const program = new Program(idl as any, programID, provider);

    const selectedEmergency = props.emergencySenderList?.filter(function (emergency) {
        if (!selectedSender) return;
        return emergency.owner === selectedSender?.owner;
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

    const cancelClaimRequest = async () => {
        if (!selectedEmergency || !props.emergencySenderList) return;

        const emergency = selectedEmergency[0];

        await program.rpc.cancelClaimRequest({
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
                                  <button className="cta-button status-button">
                                      {value.paymentsLeft > 1
                                          ? value.paymentsLeft + ' payments left'
                                          : value.paymentsLeft + ' payment left'}
                                  </button>
                                  {value.owner &&
                                  props.upstreamDeeds &&
                                  props.upstreamDeeds[index] &&
                                  value.claimedTimestamp > 0 ? (
                                      <div>
                                          {Date.now() <
                                              value.claimedTimestamp * 1000 +
                                                  props.upstreamDeeds[index].withdrawalPeriod * 1000 &&
                                          value.redeemTimestamp == 0 ? (
                                              <button
                                                  className="cta-button delete-button"
                                                  onClick={() => {
                                                      setClaimModalShow(true);
                                                      setSelectedSender(value);
                                                      props.getUserBalance();
                                                  }}
                                              >
                                                  <Emojis symbol="⏳" label="hourglass" />
                                                  <Countdown
                                                      date={
                                                          value.claimedTimestamp * 1000 +
                                                          props.upstreamDeeds[index].withdrawalPeriod * 1000
                                                      }
                                                  />
                                              </button>
                                          ) : (
                                                value.redeemTimestamp > 0 &&
                                              Date.now() <
                                                  value.redeemTimestamp * 1000 + value.timeBetweenPayments * 1000 && (
                                                  <button
                                                      className="cta-button delete-button"
                                                      onClick={() => {
                                                          setClaimModalShow(true);
                                                          setSelectedSender(value);
                                                          props.getUserBalance();
                                                      }}
                                                  >
                                                      <Emojis symbol="⏳" label="hourglass" />
                                                      <Countdown
                                                          date={
                                                              value.redeemTimestamp * 1000 +
                                                              value.timeBetweenPayments * 1000
                                                          }
                                                      />
                                                  </button>
                                              )
                                          )}
                                          {((value.redeemTimestamp > 0 &&
                                              Date.now() >
                                                  value.redeemTimestamp * 1000 + value.timeBetweenPayments * 1000) ||
                                              (Date.now() >
                                                  value.claimedTimestamp * 1000 +
                                                      props.upstreamDeeds[index].withdrawalPeriod * 1000 &&
                                                  value.redeemTimestamp == 0)) && (
                                                      <button
                                                          className="cta-button airdrop-button"
                                                          onClick={() => {
                                                              setRedeemModalShow(true);
                                                              setSelectedSender(value);
                                                              props.getUserBalance();
                                                          }}
                                                      >
                                                          Redeem
                                                      </button>
                                                  )}
                                      </div>
                                  ) : (
                                      <button
                                          className="cta-button airdrop-button"
                                          onClick={() => {
                                              setClaimModalShow(true);
                                              setSelectedSender(value);
                                              props.getUserBalance();
                                          }}
                                      >
                                          Claim
                                      </button>
                                  )}
                              </div>
                          </div>
                      ))
                    : null}
            </div>
        ),
        [props]
    );

    const renderDescription = useMemo(
        () => (
            <div className="claim-emergency-background">
                <div className="claim-emergency-item">
                    <h3>Addresses who defined yours as an emergency will lie here once added.</h3>
                    <p>
                        <div className="hint">
                            As an emergency, you may claim a given percentage of what these addresses deposited in their
                            deed account.
                        </div>
                    </p>
                </div>
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
                        cancelClaimRequest={cancelClaimRequest}
                        selectedSender={props.emergencySenderList.filter((emergency) => {
                            return selectedSender?.owner === emergency.owner;
                        })}
                        userBalance={props.userBalance}
                    />
                    <RedeemEmergencyModal
                        onClose={() => setRedeemModalShow(false)}
                        show={showRedeemModal}
                        redeem={redeem}
                        selectedSender={props.emergencySenderList.filter((emergency) => {
                            return selectedSender?.owner === emergency.owner;
                        })}
                        userBalance={props.userBalance}
                    />
                </div>
            ) : (
                renderDescription
            )}
        </div>
    );
}

export default ClaimEmergency;

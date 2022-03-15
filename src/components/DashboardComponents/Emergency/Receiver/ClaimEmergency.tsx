import { Emergency } from '../../../../models';
import { Deed } from '../../../../models';

import { useCallback, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Countdown from 'react-countdown';
import { PublicKey } from '@solana/web3.js';
import ClaimEmergencyModal from './Modals/ClaimEmergencyModal';
import Emojis from '../../../utils/Emojis';
import './ClaimEmergency.css';
import '../../Common.css';
import { useMemo } from 'react';

const WALLET_BALANCE = 1500;

const WITHDRAWAL_PERIOD = 4;

function ClaimEmergency(props: {
    emergencySenderList: Emergency[] | undefined;
    setEmergencySenderList: (emergencies: Emergency[] | undefined) => void;
    refreshEmergencySendersData: () => any;
}) {
    const { publicKey } = useWallet();

    const [showAddSenderModal, setAddSenderModalShow] = useState(false);
    const [showClaimModal, setClaimModalShow] = useState(false);
    const [selectedSender, setSelectedSender] = useState<Emergency | undefined>();
    const [formIsCorrect, setFormIsCorrect] = useState(false);
    const [senderExists, setSenderExists] = useState(false);
    const [senderIsMentioned, setSenderIsMentioned] = useState(false);

    const selectedEmergency = props.emergencySenderList?.filter(function (emergency) {
        return emergency.owner === selectedSender?.owner;
    });

    const claimRequest = async () => {
        if (!selectedEmergency || !props.emergencySenderList) return;

        const id = selectedEmergency[0].owner;
        const newSenders = [...props.emergencySenderList];

        /*
        
        newSenders.map((value) =>
            value.owner === id
                ? value.claimedTimestamp > 0
                    ? (value.claim_request_timestamp = 0)
                    : (value.claim_request_timestamp = 10)
                : value.claim_request_timestamp
        );

        */

        // props.setEmergencySenderList(newSenders);
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
                                      {' ' + (WALLET_BALANCE * value.percentage) / 100 + ' SOL '}
                                      <i className="fa fa-arrow-right"></i>
                                      {' Me'}
                                  </p>
                                  {value.owner && value.claimedTimestamp > 0 ? (
                                      <div>
                                          <button
                                              className="cta-button status-button"
                                              onClick={() => (setClaimModalShow(true), setSelectedSender(value))}
                                          >
                                              Claimed
                                          </button>
                                          <button className="cta-button status-button">
                                              <div>
                                                  <Emojis symbol="⏳" label="hourglass" />
                                                  <Countdown date={Date.now() + WITHDRAWAL_PERIOD * 3600 * 24 * 1000} />
                                              </div>
                                          </button>
                                      </div>
                                  ) : (
                                      <div>
                                          {value.owner ? (
                                              <div>
                                                  <button
                                                      className="cta-button status-button"
                                                      onClick={() => (
                                                          setClaimModalShow(true), setSelectedSender(value)
                                                      )}
                                                  >
                                                      Claim
                                                  </button>
                                                  <button className="cta-button status-button">
                                                      <Emojis symbol="⏳" label="hourglass" />
                                                      {' ' + WITHDRAWAL_PERIOD + ' days'}
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
        [props.emergencySenderList]
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
            <button onClick={props.refreshEmergencySendersData} className="cta-button confirm-button">
                REFRESH
            </button>
            {props.emergencySenderList ? (
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
                </div>
            ) : renderDescription}
        </div>
    );
}

export default ClaimEmergency;

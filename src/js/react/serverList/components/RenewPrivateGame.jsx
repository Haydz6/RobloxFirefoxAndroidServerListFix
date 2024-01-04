import React, { Fragment, useCallback } from 'react';
import PropTypes from 'prop-types';
import { withTranslations } from 'react-utilities';
import serverListConstants from '../constants/serverListConstants';
import translationConfig from '../translation.config';
import RenewServerModal from './RenewServerModal';
import gameDetailMetaData from '../../gameData/utils/gameDetailMetaData';
import serverListService from '../services/serverListService';

const { getCurrentGameMetaData } = gameDetailMetaData;

const { resources } = serverListConstants;

function RenewPrivateGame({
  translate,
  privateServerId,
  isPaymentCancelled,
  isInsufficientFunds,
  isServerInactive,
  canRenew,
  setSubscription,
  isLoading,
  systemFeedbackService
}) {
  const {
    gameDetailPlaceName: placeName,
    gameDetailPrivateServerPrice: price,
    gameDetailSellerName: creatorName
  } = getCurrentGameMetaData();

  const renewPrivateServer = useCallback(() => {
    return new Promise(resolve => {
      serverListService
        .updateVipServerSubscription(privateServerId, true, price)
        .then(
          ({ data }) => {
            setSubscription(data);
            systemFeedbackService.success(
              translate(resources.renewSubscriptionSuccess) || 'Successfully renewed private server'
            );
          },
          ({ data }) => {
            if (data.errors?.length > 0) {
              const error = data.errors[0];
              systemFeedbackService.warning(error.userFacingMessage ?? error.message);
            } else {
              systemFeedbackService.warning(
                translate(resources.renewSubscriptionError) || 'Unable to renew subscription.'
              );
            }
          }
        )
        .finally(() => {
          resolve();
        });
    });
  }, [privateServerId, price, setSubscription, translate, systemFeedbackService]);

  return (
    <Fragment>
      {isPaymentCancelled && (
        <div className='rbx-private-server-subscription-alert text-alert'>
          <span className='icon-remove' />
          <span className='rbx-private-server-subscription-alert-text'>
            {translate(resources.paymentCancelledText)}
          </span>
        </div>
      )}

      {isInsufficientFunds && (
        <div className='rbx-private-server-insufficient-funds text-alert'>
          <span className='icon-remove' />
          {translate(resources.insufficientFunds)}
        </div>
      )}

      {isServerInactive && (
        <div className='rbx-private-server-inactive'>
          <span className='icon-turn-off' />
          {translate(resources.inactiveServerText)}
        </div>
      )}

      {canRenew && (
        <RenewServerModal {...{ placeName, creatorName, price, renewPrivateServer, isLoading }} />
      )}
    </Fragment>
  );
}

RenewPrivateGame.propTypes = {
  translate: PropTypes.func.isRequired,
  privateServerId: PropTypes.number.isRequired,
  isPaymentCancelled: PropTypes.bool.isRequired,
  isInsufficientFunds: PropTypes.bool.isRequired,
  isServerInactive: PropTypes.bool.isRequired,
  canRenew: PropTypes.bool.isRequired,
  setSubscription: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  systemFeedbackService: PropTypes.shape({
    success: PropTypes.func.isRequired,
    warning: PropTypes.func.isRequired
  }).isRequired
};

export default withTranslations(RenewPrivateGame, translationConfig.serverList);

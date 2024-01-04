import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslations } from 'react-utilities';
import { Button } from 'react-style-guide';
import { createItemPurchase, errorTypeIds, TransactionVerb } from 'roblox-item-purchase';
import {
  Thumbnail2d,
  ThumbnailTypes,
  DefaultThumbnailSize,
  ThumbnailFormat
} from 'roblox-thumbnails';
import translationConfig from '../translation.config';

import serverListConstants from '../constants/serverListConstants';
import urlConstants from '../constants/urlConstants';
import createServerModalFactory from '../util/CreateServerModalFactory';
import serverListService from '../services/serverListService';
import gameDetailMetaData from '../../gameData/utils/gameDetailMetaData';

const { resources } = serverListConstants;
const [
  customPurchaseVerificationModal,
  customPurchaseVerificationModalService
] = createServerModalFactory();

const [ItemPurchase, itemPurchaseService] = createItemPurchase({
  customPurchaseVerificationModal,
  customPurchaseVerificationModalService
});

const { getCurrentGameMetaData } = gameDetailMetaData;

function CreatePrivateGame({
  privateServerTranslate,
  translate,
  refreshServers,
  universeId,
  price,
  placeName,
  canCreatePrivateServer,
  productId,
  currency,
  sellerId,
  sellerName
}) {
  const [serverName, setServerName] = useState('');
  const {
    gameDetailPreopenCreatePrivateServerModal: preopenCreatePrivateGame
  } = getCurrentGameMetaData();

  if (preopenCreatePrivateGame) {
    itemPurchaseService.start();
  }

  const clearForm = () => {
    setServerName('');
    return true;
  };

  const createPrivateServer = ({ handleError, setLoading, openConfirmation, closeAll }) => {
    setLoading(true);
    serverListService.createPrivateServer(universeId, serverName, price).then(
      ({ data }) => {
        setLoading(false);
        closeAll();
        const { vipServerId } = data;

        openConfirmation({
          transactionVerb: TransactionVerb.Bought,
          onAccept: () => {
            window.location.href = urlConstants.getPrivateServerConfigUrl(vipServerId);
          },
          onDecline: () => {
            refreshServers();
            clearForm();
            return true;
          }
        });
      },
      ({ data }) => {
        setLoading(false);
        closeAll();

        const errorMsg = data.errors?.[0].userFacingMessage ?? translate(resources.purchaseError);
        handleError({
          showDivId: errorTypeIds.transactionFailure,
          title: translate(resources.transactionFailedHeading),
          errorMsg,
          onDecline: () => {
            refreshServers();
            return true;
          }
        });
      }
    );
  };

  const onServerNameChange = ({ target: { value } }) => setServerName(value);

  const placeThumbnail = (
    <Thumbnail2d
      type={ThumbnailTypes.gameIcon}
      size={DefaultThumbnailSize}
      targetId={universeId}
      containerClass='modal-thumb'
      imgClassName='original-image'
      format={ThumbnailFormat.jpeg}
    />
  );

  return (
    <span className='rbx-private-server-create'>
      <Button
        className='btn-more rbx-private-server-create-button'
        size={Button.sizes.medium}
        variant={Button.variants.secondary}
        onClick={itemPurchaseService.start}
        isDisabled={!canCreatePrivateServer}>
        {privateServerTranslate(resources.createPrivateServerTitle)}
      </Button>
      <ItemPurchase
        {...{
          productId,
          expectedPrice: price,
          thumbnail: placeThumbnail,
          assetName: placeName,
          assetType: privateServerTranslate(resources.privateServerLabel),
          sellerName,
          expectedCurrency: currency,
          expectedSellerId: sellerId,
          handlePurchase: createPrivateServer,
          customProps: {
            privateServerTranslate,
            serverName,
            onServerNameChange,
            clearForm
          }
        }}
        isPrivateServer
      />
      {!canCreatePrivateServer && (
        <span className='text-footer rbx-private-server-create-disabled-text'>
          {translate(resources.maxFreePrivateServersText)}
        </span>
      )}
    </span>
  );
}

CreatePrivateGame.defaultProps = {
  canCreatePrivateServer: true,
  currency: 1
};

CreatePrivateGame.propTypes = {
  translate: PropTypes.func.isRequired,
  privateServerTranslate: PropTypes.func.isRequired,
  refreshServers: PropTypes.func.isRequired,
  universeId: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  placeName: PropTypes.string.isRequired,
  canCreatePrivateServer: PropTypes.bool,
  currency: PropTypes.number,
  productId: PropTypes.number.isRequired,
  sellerId: PropTypes.number.isRequired,
  sellerName: PropTypes.string.isRequired
};

export default withTranslations(CreatePrivateGame, translationConfig.vipServersResources);

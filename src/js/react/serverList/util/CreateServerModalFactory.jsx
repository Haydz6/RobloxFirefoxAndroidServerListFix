/* eslint-disable react/jsx-no-literals */
import React from 'react';
import { renderToString } from 'react-dom/server';
import PropTypes from 'prop-types';
import { withTranslations } from 'react-utilities';
import { createModal } from 'react-style-guide';
import { BalanceAfterSaleText, PriceLabel } from 'roblox-item-purchase';
import translationConfig from '../translation.config';
import serverListConstants from '../constants/serverListConstants';

const [Modal, modalService] = createModal();

const { resources, serverNameMaxLength } = serverListConstants;
export default () => {
  function CreateServerModal({
    translate,
    privateServerTranslate,
    assetName,
    expectedPrice,
    thumbnail,
    serverName,
    onAction,
    onServerNameChange,
    clearForm,
    loading
  }) {
    const modalFooterText = (
      <span className='purchase-private-server-modal-footer-text'>
        <BalanceAfterSaleText expectedPrice={expectedPrice} />{' '}
        {privateServerTranslate(resources.createServerFooterDescription) ||
          'This is a subscription-based feature. It will auto-renew once a month until you cancel the subscription.'}
      </span>
    );

    const modalBody = (
      <div className='private-server-purchase'>
        <div
          className='modal-list-item private-server-main-text'
          dangerouslySetInnerHTML={{
            __html: privateServerTranslate(resources.createPrivateServerPriceText, {
              target: renderToString(<PriceLabel {...{ price: expectedPrice }} />)
            })
          }}
        />
        <div className='modal-list-item'>
          <span className='text-label private-server-game-name'>
            {privateServerTranslate(resources.gameNameText)}
          </span>
          <span className='game-name'>{assetName}</span>
        </div>
        <div className='modal-list-item private-server-name-input'>
          <span className='text-label'>{privateServerTranslate(resources.serverNameText)}</span>
          <div className='form-group form-has-feedback'>
            <input
              type='text'
              value={serverName}
              onChange={onServerNameChange}
              maxLength={serverNameMaxLength}
              className='form-control input-field private-server-name'
              id='private-server-name-text-box'
            />
            {serverName.length > 0 && (
              <p className='form-control-label text-secondary'>
                {serverName.length}/{serverNameMaxLength}
              </p>
            )}
          </div>
        </div>
        <div className='modal-image-container'>{thumbnail}</div>
      </div>
    );

    return (
      <Modal
        id='purchase-private-server-modal'
        title={privateServerTranslate(resources.createPrivateServerTitle)}
        body={modalBody}
        actionButtonText={translate(resources.buyNowText)}
        neutralButtonText={translate(resources.cancelAction)}
        footerText={modalFooterText}
        onAction={onAction}
        onNeutral={clearForm}
        loading={loading}
        actionButtonShow
        disableActionButton={serverName.length === 0}
      />
    );
  }

  CreateServerModal.defaultProps = {
    serverName: '',
    createServerError: false,
    loading: false
  };

  CreateServerModal.propTypes = {
    translate: PropTypes.func.isRequired,
    privateServerTranslate: PropTypes.func.isRequired,
    thumbnail: PropTypes.node.isRequired,
    assetName: PropTypes.string.isRequired,
    expectedPrice: PropTypes.number.isRequired,
    serverName: PropTypes.string,
    onAction: PropTypes.func.isRequired,
    onServerNameChange: PropTypes.func.isRequired,
    createServerError: PropTypes.bool,
    loading: PropTypes.bool,
    clearForm: PropTypes.func.isRequired
  };

  return [withTranslations(CreateServerModal, translationConfig.purchaseDialog), modalService];
};

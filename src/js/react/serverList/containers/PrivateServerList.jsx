import React, { Fragment, useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';
import PropTypes from 'prop-types';
import { Tooltip, Button } from 'react-style-guide';
import { withTranslations } from 'react-utilities';
import { PriceLabel } from 'roblox-item-purchase';
import useServerList from './useServerList';
import CreatePrivateGame from './CreatePrivateGame';
import translationConfig from '../translation.config';
import serverListConstants from '../constants/serverListConstants';
import serverListService from '../services/serverListService';
import GameListSection from '../components/GameListSection';
import { canCreatePrivateGameServer } from '../util/gameInstanceUtil';
import urlConstants from '../constants/urlConstants';
import bedev2Services from '../../../../ts/react/common/services/bedev2Services';
import experimentConstants from '../../../../ts/react/common/constants/experimentConstants';

const { resources, serverListTypes } = serverListConstants;
const { layerNames, defaultValues } = experimentConstants;

function PrivateServerList({ translate, showServers, intl, isAboutTab }) {
  const {
    servers,
    loadMoreServers,
    refreshServers,
    clearServerAtIndex,
    hasNext,
    isBusy,
    setIsBusy,
    hasError,
    metaData: {
      universeId,
      placeId,
      placeName,
      canCreateServer,
      price,
      userCanManagePlace,
      sellerId,
      sellerName,
      privateServerProductId
    }
  } = useServerList(serverListService.getVipGameInstances, showServers);

  const canCreatePrivateServer = canCreatePrivateGameServer(servers);
  const doesGameSupportPrivateServers = privateServerProductId !== 0;

  const serversLink = `<a class="text-link" href="#!/game-instances">${translate(
    resources.serversText
  )}</a>`;

  const privateServerHelpLink = `<a class="text-link" href="${urlConstants.privateServerHelpUrl(
    intl.getRobloxLocale()
  )}">${translate(resources.privateServerHeader)}</a>`;

  const [hidePrivateServersInAboutTabExp, setHidePrivateServersInAboutTabExp] = useState(null);

  useEffect(() => {
    if (isAboutTab) {
      (async () => {
        const data = await bedev2Services.getExperimentationValues(
          layerNames.gameDetails,
          defaultValues.gameDetails
        );

        const result = !!data?.ShouldHidePrivateServersInAboutTab;

        setHidePrivateServersInAboutTabExp(result);
      })();
    }
  }, [isAboutTab]);

  return hidePrivateServersInAboutTabExp && isAboutTab && !doesGameSupportPrivateServers ? null : (
    <div id='rbx-private-servers' className='stack'>
      <div className='container-header'>
        <h2>{translate(resources.privateServerHeader)}</h2>

        {showServers && doesGameSupportPrivateServers && (
          <Button
            size={Button.sizes.extraSmall}
            variant={Button.variants.control}
            className='btn-more rbx-refresh refresh-link-icon'
            onClick={() => refreshServers()}
            isDisabled={isBusy}>
            {translate(resources.privateServerRefreshText)}
          </Button>
        )}

        <Tooltip
          id='private-server-tooltip'
          placement='bottom'
          content={translate(resources.privateServerTooltip)}>
          <span className='icon-moreinfo' />
        </Tooltip>
      </div>
      {!doesGameSupportPrivateServers ? (
        <div
          className='section-content-off'
          dangerouslySetInnerHTML={{
            __html: translate(resources.privateServersNotSupported, {
              vipServersLink: privateServerHelpLink
            })
          }}
        />
      ) : (
        <Fragment>
          <div className='create-server-banner section-content remove-panel'>
            <div className='create-server-banner-text text'>
              {canCreateServer && (
                <span
                  className='private-server-price'
                  dangerouslySetInnerHTML={{
                    __html: translate(resources.privateServerPrice, {
                      price: renderToString(<PriceLabel {...{ price }} />)
                    })
                  }}
                />
              )}
              <span className='play-with-others-text'>
                {translate(resources.privateServerPlayWithOthers)}
                <br />
                {!showServers && (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: translate(resources.seeAllPrivateServersText, {
                        serversLink
                      })
                    }}
                  />
                )}
              </span>
            </div>
            {canCreateServer && (
              <CreatePrivateGame
                privateServerTranslate={translate}
                refreshServers={refreshServers}
                {...{
                  placeName,
                  universeId,
                  price,
                  canCreatePrivateServer,
                  sellerId,
                  sellerName,
                  productId: privateServerProductId
                }}
              />
            )}
          </div>
          <div className='section tab-server-only'>
            {showServers && (
              <GameListSection
                {...{
                  type: serverListTypes.Vip.key,
                  placeId,
                  gameInstances: servers,
                  showLoadMoreButton: hasNext,
                  loadMoreGameInstances: loadMoreServers,
                  handleGameInstanceShutdownAtIndex: clearServerAtIndex,
                  userCanManagePlace,
                  isLoading: isBusy,
                  setIsLoading: setIsBusy,
                  loadingError: hasError
                }}
              />
            )}
          </div>
        </Fragment>
      )}
    </div>
  );
}
PrivateServerList.defaultProps = {
  showServers: true,
  isAboutTab: false
};
PrivateServerList.propTypes = {
  translate: PropTypes.func.isRequired,
  showServers: PropTypes.bool,
  intl: PropTypes.shape({ getRobloxLocale: PropTypes.func.isRequired }).isRequired,
  isAboutTab: PropTypes.bool
};

export default withTranslations(PrivateServerList, translationConfig.privateServer);

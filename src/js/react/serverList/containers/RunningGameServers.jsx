import React from 'react';
import PropTypes from 'prop-types';
import { withTranslations } from 'react-utilities';
import useServerList from './useServerList';
import translationConfig from '../translation.config';
import GameListSection from '../components/GameListSection';

function RunningGameServers({ type, translate, headerTitleResource, getGameServers }) {
  const {
    servers,
    loadMoreServers,
    refreshServers,
    removeServerAtIndex,
    hasNext,
    isBusy,
    setIsBusy,
    hasError,
    metaData: { placeId, userCanManagePlace }
  } = useServerList(getGameServers);

  return (
    <GameListSection
      {...{
        type,
        placeId,
        gameInstances: servers,
        headerTitle: translate(headerTitleResource),
        showLoadMoreButton: hasNext,
        loadMoreGameInstances: loadMoreServers,
        refreshGameInstances: refreshServers,
        handleGameInstanceShutdownAtIndex: removeServerAtIndex,
        userCanManagePlace,
        isLoading: isBusy,
        setIsLoading: setIsBusy,
        loadingError: hasError
      }}
    />
  );
}

RunningGameServers.defaultProps = {
  type: ''
};

RunningGameServers.propTypes = {
  type: PropTypes.string,
  translate: PropTypes.func.isRequired,
  headerTitleResource: PropTypes.string.isRequired,
  getGameServers: PropTypes.func.isRequired
};

export default withTranslations(RunningGameServers, translationConfig.serverList);

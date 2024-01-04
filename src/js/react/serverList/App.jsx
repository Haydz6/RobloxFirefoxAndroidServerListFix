import React, { Fragment, useEffect, useState } from 'react';
import serverListConstants from './constants/serverListConstants';
import RunningGameServers from './containers/RunningGameServers';
import PrivateServerList from './containers/PrivateServerList';
import serverListService from './services/serverListService';
import useCurrentTab from '../gameData/hooks/useCurrentTab';
import gameDetailConstants from '../gameData/constants/gameDetailConstants';
import { ExperimentContextComponent } from '../../../ts/react/common/utils/ExperimentContext';

const { serverListTypes, resources } = serverListConstants;
const { gameDetailTabs } = gameDetailConstants;

function App() {
  const [shouldRender, setShouldRender] = useState(false);
  const currentTab = useCurrentTab();

  // The mobile page for server list doesn't have a horizontal tab bar
  // We should ensure we are allowing these to display if no tabs are found
  useEffect(() => {
    // Once we render once, render forever :) No need to un-mount this
    // when the page hash changes.
    if (!shouldRender) {
      // Check if we should mount now!
      if (currentTab === gameDetailTabs.servers) {
        setShouldRender(true);
      }
    }
  }, [currentTab, shouldRender]);

  // Conditional rendering / mounting only happens in a tabbed view
  // If there is not a current tab, we should render the page.
  if (currentTab && !shouldRender) {
    return <Fragment />;
  }

  return (
    <ExperimentContextComponent>
      <PrivateServerList />
      <RunningGameServers
        type={serverListTypes.friend.key}
        getGameServers={serverListService.getFriendsGameInstances}
        headerTitleResource={resources.friendsServersTitle}
      />
      <RunningGameServers
        getGameServers={serverListService.getPublicGameInstances}
        headerTitleResource={resources.publicServersTitle}
      />
    </ExperimentContextComponent>
  );
}

App.propTypes = {};

export default App;

import { ready } from 'core-utilities';
import React, { useState } from 'react';
import { render } from 'react-dom';
import App from './App';
import PrivateServerList from './containers/PrivateServerList';
import '../../../css/serverList/serverList.scss';

const serverListContainerId = 'running-game-instances-container';
const privateServerAboutTabContainerId = 'private-server-container-about-tab';
const guidelines = 'game-age-recommendation-container';

ready(() => {
  if (document.getElementById(serverListContainerId)) {
    render(<App />, document.getElementById(serverListContainerId));
  }

  if (document.getElementById(privateServerAboutTabContainerId)) {
    render(
      <PrivateServerList showServers={false} isAboutTab />,
      document.getElementById(privateServerAboutTabContainerId)
    );
  }
});

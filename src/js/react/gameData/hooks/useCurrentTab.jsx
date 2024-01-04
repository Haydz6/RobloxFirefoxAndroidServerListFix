import { useEffect, useState } from 'react';
import gameDetailTabsMetaData from '../utils/gameDetailTabsMetaData';
import gameDetailConstants from '../constants/gameDetailConstants';

const { gameDetailTabs, gameDetailHashesToTabs } = gameDetailConstants;
const { isTabbedView } = gameDetailTabsMetaData;

const getCurrentTab = () => {
  if (!isTabbedView()) {
    return null;
  }

  const activeTab = gameDetailHashesToTabs[window.location.hash];
  if (activeTab) {
    return activeTab;
  }

  // The about tab is the only one that can be set without a hash.
  // If tabs exist, and there wasn't a hash, we are on the about tab.
  return gameDetailTabs.about;
};

function useCurrentTab() {
  const [currentTab, setCurrentTab] = useState(getCurrentTab());

  const onHashChange = () => {
    setCurrentTab(getCurrentTab());
  };

  useEffect(() => {
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  return currentTab;
}

export default useCurrentTab;

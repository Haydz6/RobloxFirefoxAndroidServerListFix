import gameDetailConstants from '../constants/gameDetailConstants';

const { gameDetailTabs } = gameDetailConstants;

const isTabbedView = () => {
  const gameDetailTabsElement = document.getElementById('horizontal-tabs');
  if (gameDetailTabsElement) {
    const tabIds = Object.values(gameDetailTabs);
    try {
      tabIds.forEach(tabId => {
        if (!gameDetailTabsElement.querySelector(`#${tabId}`)) {
          throw new Error(`Unable to find horizontal tab with id ${tabId}`);
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error.message);
      return false;
    }

    // If each of the expected tabs exist, we can consider this our tabbed view
    return true;
  }
  return false;
};

export default {
  isTabbedView
};

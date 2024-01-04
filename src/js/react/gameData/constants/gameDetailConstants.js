const gameDetailTabs = {
  about: 'tab-about',
  store: 'tab-store',
  servers: 'tab-game-instances'
};

const gameDetailHashesToTabs = {
  '#!/about': gameDetailTabs.about,
  '#!/store': gameDetailTabs.store,
  '#!/game-instances': gameDetailTabs.servers
};

export default { gameDetailTabs, gameDetailHashesToTabs };

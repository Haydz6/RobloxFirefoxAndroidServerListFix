export default {
  playerTruncationSize: 5, // will not truncate if set to -1
  slowGameFpsThreshold: 15,
  serverNameMaxLength: 50,
  numGameInstancesPerRow: 4,
  serverListTypes: {
    friend: {
      key: 'friends',
      value: 'Friend'
    },
    public: {
      value: 'Public'
    },
    Vip: {
      key: 'private',
      value: 'VIP'
    }
  },
  sortOrders: {
    descending: 'Desc',
    ascending: 'Asc'
  },
  defaultOptions: {
    sortOrder: 'Desc',
    excludeFullGames: false
  },
  resources: {
    friendsServersTitle: 'Heading.ServersMyFriendsAreIn',
    publicServersTitle: 'Heading.OtherServers',
    loadMoreButtonText: 'Action.LoadMore',
    playerCountText: 'Label.CurrentPlayerCount',
    noServersFoundText: 'Label.NoServersFound',
    configureServerText: 'Action.ConfigureServer',
    shutdownServerText: 'Label.ShutDownServer',
    shutdownServerSuccess: 'Message.ShutdownServerSuccess',
    shutdownServerError: 'Message.ShutdownServerError',
    slowGameWarning: 'Label.SlowGame',
    joinServerText: 'Label.ServerListJoin',
    serversText: 'Label.Servers',
    privateServerHeader: 'Heading.PrivateServers',
    privateServerTooltip: 'Label.PrivateServersAbout',
    privateServerRefreshText: 'Action.Refresh',
    privateServerPrice: 'Label.Price',
    privateServerPlayWithOthers: 'Label.PlayWithOthers',
    seeAllPrivateServersText: 'Label.SeeAllPrivateServers',
    privateServersNotSupported: 'Label.VipServersNotSupported',
    freeGameText: 'Label.Free',
    maxFreePrivateServersText: 'Description.MaxFreePrivateServers',
    createPrivateServerText: 'Action.CreatePrivateServer',
    paymentCancelledText: 'Label.PaymentCancelled',
    insufficientFunds: 'Label.InsufficientFunds',
    inactiveServerText: 'Label.Inactive',
    renewServerListText: 'Label.Renew',
    renewPrivateServerTitle: 'Label.RenewPrivateServer',
    renewSubscriptionSuccess: 'Message.RenewSubscriptionSuccess',
    renewSubscriptionError: 'Message.RenewSubscriptionError',
    confirmEnableFuturePaymentsText: 'Label.ConfirmEnableFuturePayments',
    startRenewingPrivateServerPrice: 'Label.StartRenewingPrivateServerPrice',
    cancelText: 'Label.Cancel',
    createPrivateServerPriceText: 'Label.CreatePrivateServerFor',
    gameNameText: 'Label.GameName',
    serverNameText: 'Label.ServerName',
    createPrivateServerTitle: 'Action.CreatePrivateServer',
    buyNowText: 'Action.BuyNow',
    createServerFooterText: 'Label.FooterText',
    privateServerLabel: 'Label.PrivateServer',
    cancelAction: 'Action.Cancel',
    transactionFailedHeading: 'Heading.TransactionFailed',
    createServerFooterDescription: 'Description.RecurringSubscriptionRenewal',
    friendInServerLabel: 'Label.FriendInServer',
    twoFriendsInServerLabel: 'Label.TwoFriendsInServer',
    manyFriendsInServerLabel: 'Label.ManyFriendsInThisServer',
    loadServersError: 'Message.LoadServersFailure',
    purchaseError: 'Message.InternalErrorPurchaseError',
    numberOfPlayers: 'Label.NumberOfPlayers',
    hideFullServers: 'Label.ExcludeFullServers',
    descending: 'Action.Descending',
    ascending: 'Action.Ascending'
  }
};

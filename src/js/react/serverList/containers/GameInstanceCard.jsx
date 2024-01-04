import React, { Fragment, useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, Link } from 'react-style-guide';
import { Thumbnail2d, ThumbnailTypes } from 'roblox-thumbnails';
import { authenticatedUser } from 'header-scripts';
import { getJoinScript } from '../util/gameInstanceUtil';
import serverListService from '../services/serverListService';
import GameInstanceMenu from '../components/GameInstanceMenu';
import serverListConstants from '../constants/serverListConstants';
import RenewPrivateGame from '../components/RenewPrivateGame';
import PrivateServerOwner from '../components/PrivateServerOwner';
import urlConstants from '../constants/urlConstants';
import FriendsInServerLabel from '../components/FriendsInServerLabel';
import ExperimentContext from '../../../../ts/react/common/utils/ExperimentContext';

const { getUserProfileUrl } = urlConstants;
const { resources, playerTruncationSize, serverListTypes } = serverListConstants;

function ServerSizeGauge({ maxPlayerCount, currentPlayerCount }) {
  if (!maxPlayerCount) return <Fragment />;
  const percent = Math.round((currentPlayerCount / maxPlayerCount) * 100);

  return (
    <div className='server-player-count-gauge border'>
      <div className='gauge-inner-bar border' style={{ width: `${percent}%` }} />
    </div>
  );
}

function PlayerThumbnailContainer({ player }) {
  return (
    <span key={player.playerToken} className='avatar avatar-headshot-md player-avatar'>
      {player.id == null ? (
        <Thumbnail2d
          type={ThumbnailTypes.avatarHeadshot}
          token={player.playerToken}
          containerClass='avatar-card-image'
        />
      ) : (
        <Link className='avatar-card-link' href={getUserProfileUrl(player.id)}>
          <Thumbnail2d
            type={ThumbnailTypes.avatarHeadshot}
            targetId={player.id}
            containerClass='avatar-card-image'
            altName={player.displayName}
          />
        </Link>
      )}
    </span>
  );
}

function GameInstanceCard({
  id,
  translate,
  cssKey,
  serverListType,
  placeId,
  gameServerStatus,
  canManagePlace,
  name,
  vipServerId,
  vipServerSubscription,
  accessCode,
  showSlowGameMessage,
  owner,
  players,
  onShutdownServerSuccess,
  systemFeedbackService,
  isLoading,
  setIsLoading,
  maxPlayers,
  currentPlayersCount
}) {
  const [subscription, setSubscription] = useState(vipServerSubscription);
  const isOwner = owner?.id === authenticatedUser.id;
  const isPrivateServer = !!vipServerId;

  // If the access code does not exist, the server is inactive.
  const isServerInactive = isPrivateServer && !accessCode;

  const experiments = useContext(ExperimentContext);

  useEffect(() => {
    setSubscription(vipServerSubscription);
  }, [vipServerSubscription]);

  const shutdownServer = () => {
    // This should not be possible due to the disabling of the button,
    // but you can never be too careful :)
    if (isLoading) {
      systemFeedbackService.warning(translate(resources.shutdownServerError));
    }

    setIsLoading(true);
    serverListService
      .shutdownGameInstance(placeId, id, vipServerId)
      .then(
        () => {
          systemFeedbackService.success(translate(resources.shutdownServerSuccess));
          onShutdownServerSuccess();
        },
        () => {
          systemFeedbackService.warning(translate(resources.shutdownServerError));
        }
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

  const truncatedPlayers =
    playerTruncationSize && playerTruncationSize > 0
      ? players?.slice(0, playerTruncationSize)
      : players;

  const isVipServer = vipServerId > 0;
  const canConfigure = isVipServer && isOwner;
  const isActiveGameInstance = id !== null;
  // Shutdowns can occur on
  // -- live game instances that are *not* private servers by any user who can manage the place
  // -- live game instances that are private servers by the owner of the private server
  const canShutdown = isActiveGameInstance && ((!isVipServer && canManagePlace) || canConfigure);
  const shouldRenderGameInstanceMenu = canConfigure || canShutdown;

  const remainingPlayersText =
    currentPlayersCount - truncatedPlayers.length > 0 &&
    `+${currentPlayersCount - truncatedPlayers.length}`;

  return (
    <li className={`rbx-${cssKey}game-server-item col-md-3 col-sm-4 col-xs-6`}>
      <div className='card-item'>
        <div className='player-thumbnails-container'>
          {truncatedPlayers.map(player => (
            <PlayerThumbnailContainer key={player.playerToken} player={player} />
          ))}
          {!!remainingPlayersText && (
            <span className='avatar avatar-headshot-md player-avatar hidden-players-placeholder'>
              {remainingPlayersText}
            </span>
          )}
        </div>

        <div
          className={classNames(`rbx-${cssKey}game-server-details`, 'game-server-details', {
            'border-right': serverListType === serverListTypes.Vip.key
          })}>
          {(!!name || !!shouldRenderGameInstanceMenu) && (
            <div className='section-header'>
              {name && <span className='font-bold'>{name}</span>}
              <GameInstanceMenu
                {...{
                  className: `link-menu rbx-${cssKey}game-server-menu`,
                  translate,
                  placeId,
                  gameId: id,
                  vipServerId,
                  isOwner,
                  canManagePlace,
                  shutdownServer,
                  isLoading
                }}
              />
            </div>
          )}
          {isPrivateServer && (
            <PrivateServerOwner
              {...{
                ownerUserId: owner.id,
                ownerName: owner.displayName,
                ownerHasVerifiedBadge: owner.hasVerifiedBadge
              }}
            />
          )}
          <div
            className={`text-info rbx-game-status rbx-${cssKey}game-server-status text-overflow`}>
            {gameServerStatus}
          </div>
          <ServerSizeGauge maxPlayerCount={maxPlayers} currentPlayerCount={currentPlayersCount} />
          {!isPrivateServer && <FriendsInServerLabel {...{ translate, players }} />}
          {showSlowGameMessage && (
            <div className={`rbx-${cssKey}game-server-alert`}>
              <span className='icon-remove' />
              {translate(resources.slowGameWarning)}
            </div>
          )}
          {isPrivateServer && (
            <RenewPrivateGame
              {...{
                privateServerId: vipServerId,
                isPaymentCancelled: !subscription?.active && subscription?.price > 0,
                isInsufficientFunds: subscription?.hasInsufficientFunds,
                isServerInactive,
                canRenew: subscription?.canRenew && !subscription?.active,
                setSubscription,
                isLoading,
                systemFeedbackService
              }}
            />
          )}
          {!isServerInactive && !subscription?.isExpired && (
            <span data-placeid={placeId}>
              <Button
                className={`btn-full-width btn-control-xs rbx-${cssKey}game-server-join game-server-join-btn`}
                onClick={getJoinScript(placeId, { instanceId: id, accessCode }, serverListType)}
                isDisabled={
                  isLoading ||
                  (experiments.disableJoinButtonForFullServers && currentPlayersCount >= maxPlayers)
                }>
                {translate(resources.joinServerText)}
              </Button>
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

GameInstanceCard.defaultProps = {
  id: null,
  cssKey: '',
  serverListType: '',
  canManagePlace: false,
  name: '',
  vipServerId: 0,
  accessCode: '',
  showSlowGameMessage: false,
  owner: undefined,
  vipServerSubscription: undefined,
  players: [],
  maxPlayers: 0,
  currentPlayersCount: 0
};

GameInstanceCard.propTypes = {
  id: PropTypes.string,
  translate: PropTypes.func.isRequired,
  cssKey: PropTypes.string,
  serverListType: PropTypes.string,
  placeId: PropTypes.number.isRequired,
  name: PropTypes.string,
  vipServerId: PropTypes.number,
  maxPlayers: PropTypes.number,
  currentPlayersCount: PropTypes.number,
  vipServerSubscription: {
    canRenew: PropTypes.bool.isRequired,
    active: PropTypes.bool.isRequired,
    hasInsufficientFunds: PropTypes.bool.isRequired,
    price: PropTypes.number.isRequired,
    expired: PropTypes.bool.isRequired
  },
  accessCode: PropTypes.string,
  gameServerStatus: PropTypes.string.isRequired,
  canManagePlace: PropTypes.bool,
  showSlowGameMessage: PropTypes.bool,
  owner: {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    hasVerifiedBadge: PropTypes.bool.isRequired
  },
  players: PropTypes.arrayOf(PropTypes.any),
  onShutdownServerSuccess: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
  systemFeedbackService: PropTypes.shape({
    success: PropTypes.func.isRequired,
    warning: PropTypes.func.isRequired
  }).isRequired
};

export default GameInstanceCard;

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Popover, Link, IconButton } from 'react-style-guide';
import serverListConstants from '../constants/serverListConstants';
import urlConstants from '../constants/urlConstants';

const { resources } = serverListConstants;
const { getPrivateServerConfigUrl } = urlConstants;

function GameInstanceMenu({
  className,
  translate,
  gameId,
  vipServerId,
  isOwner,
  canManagePlace,
  shutdownServer,
  isLoading
}) {
  const isVipServer = vipServerId > 0;
  const canConfigure = isVipServer && isOwner;
  const isActiveGameInstance = gameId !== null;
  // Shutdowns can occur on
  // -- live game instances that are *not* private servers by any user who can manage the place
  // -- live game instances that are private servers by the owner of the private server
  const canShutdown = isActiveGameInstance && ((!isVipServer && canManagePlace) || canConfigure);

  if (!canConfigure && !canShutdown) {
    return <Fragment />;
  }

  return (
    <div className={className}>
      <Popover
        id='game-instance-dropdown-menu'
        button={<IconButton iconName='more' size={IconButton.sizes.small} isDisabled={isLoading} />}
        trigger='click'
        placement='bottom'>
        <ul className='dropdown-menu' role='menu'>
          {canConfigure && (
            <li>
              <Link
                url={getPrivateServerConfigUrl(vipServerId)}
                className='rbx-private-server-configure'>
                {translate(resources.configureServerText)}
              </Link>
            </li>
          )}

          {canShutdown && (
            <li>
              <button
                type='button'
                onClick={shutdownServer}
                className='rbx-private-server-shutdown rbx-private-server-shutdown'>
                {translate(resources.shutdownServerText)}
              </button>
            </li>
          )}
        </ul>
      </Popover>
    </div>
  );
}

GameInstanceMenu.defaultProps = {
  className: '',
  gameId: null,
  vipServerId: 0,
  isOwner: false,
  canManagePlace: false
};

GameInstanceMenu.propTypes = {
  className: PropTypes.string,
  translate: PropTypes.func.isRequired,
  gameId: PropTypes.string,
  vipServerId: PropTypes.number,
  isOwner: PropTypes.bool,
  canManagePlace: PropTypes.bool,
  shutdownServer: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default GameInstanceMenu;

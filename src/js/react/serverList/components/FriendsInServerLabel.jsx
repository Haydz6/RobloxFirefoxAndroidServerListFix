/* eslint-disable react/jsx-no-literals */
import React, { Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import { authenticatedUser } from 'header-scripts';
import { Link } from 'react-style-guide';
import { renderToString } from 'react-dom/server';
import serverListConstants from '../constants/serverListConstants';
import urlConstants from '../constants/urlConstants';

const { getUserProfileUrl } = urlConstants;
const { resources } = serverListConstants;

function FriendsInServerLabel({ translate, players }) {
  const friends = useMemo(() => {
    // You may be your own friend but we aren't showing you in this list
    return players.filter(player => player.id !== null && player.id !== authenticatedUser.id);
  }, [players]);

  const getLinkifiedFriendName = friend => {
    if (friend === undefined) {
      return <Fragment />;
    }

    // Display names don't allow html characters, so we don't need to escape them.
    return (
      <Link href={getUserProfileUrl(friend.id)} className='text-name'>
        {friend.displayName}
      </Link>
    );
  };

  const friendsText = useMemo(() => {
    if (friends.length === 0) {
      return '';
    }

    const firstFriendLinkHtmlString = renderToString(getLinkifiedFriendName(friends[0]));
    if (friends.length === 1) {
      return (
        translate(resources.friendInServerLabel, {
          friend: firstFriendLinkHtmlString
        }) || `Friends in this server: ${firstFriendLinkHtmlString}`
      );
    }

    const secondFriendLinkHtmlString = renderToString(getLinkifiedFriendName(friends[1]));
    if (friends.length === 2) {
      return (
        translate(resources.twoFriendsInServerLabel, {
          firstFriend: firstFriendLinkHtmlString,
          secondFriend: secondFriendLinkHtmlString
        }) ||
        `Friends in this server: ${firstFriendLinkHtmlString} and ${secondFriendLinkHtmlString}`
      );
    }

    const numOtherFriends = friends.length - 2;
    return (
      // TODO: Uncomment once appropriate translation string is generated
      // translate(resources.manyFriendsInServerLabel, {
      //   firstFriend: firstFriendLinkHtmlString,
      //   secondFriend: secondFriendLinkHtmlString,
      //   numOtherFriends
      // }) ||
      `Friends in this server: ${firstFriendLinkHtmlString}, ${secondFriendLinkHtmlString}, and ${numOtherFriends} ${
        numOtherFriends === 1 ? 'other' : 'others'
      }`
    );
  }, [friends, translate]);

  if (friends.length === 0) {
    return <Fragment />;
  }

  return (
    <div
      className='text friends-in-server-label'
      dangerouslySetInnerHTML={{
        __html: friendsText
      }}
    />
  );
}

FriendsInServerLabel.propTypes = {
  translate: PropTypes.func.isRequired,
  players: PropTypes.arrayOf(PropTypes.any).isRequired
};

export default FriendsInServerLabel;

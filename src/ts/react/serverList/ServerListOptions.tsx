import React from 'react';
import { EventStream } from 'Roblox';
import { withTranslations, WithTranslationsProps } from 'react-utilities';
import translationConfig from '../../../js/react/serverList/translation.config';
import { getPlaceIdFromUrl } from '../../../js/react/serverList/util/gameInstanceUtil';
import serverListConstants from '../../../js/react/serverList/constants/serverListConstants';

const { resources, sortOrders } = serverListConstants;

export type TServerListOptions = {
  sortOrder: string;
  excludeFullGames: boolean;
};

export type TServerListOptionsProps = {
  options: TServerListOptions;
  setOptions: React.Dispatch<React.SetStateAction<TServerListOptions>>;
  isLoading?: boolean;
};

function ServerListOptions({
  translate,
  options,
  setOptions,
  isLoading = false
}: TServerListOptionsProps & WithTranslationsProps) {
  return (
    <div className='server-list-options'>
      <div className='select-group'>
        <label className='select-label text-label' htmlFor='sort-select'>
          {translate(resources.numberOfPlayers) || 'Number of Players'}
        </label>
        <div className='rbx-select-group select-group'>
          <select
            onChange={e => {
              EventStream.SendEventWithTarget(
                'serverListOptionsInteraction',
                'sortSelect',
                {
                  pid: getPlaceIdFromUrl(),
                  sort: e.currentTarget.value
                },
                EventStream.TargetTypes.WWW
              );
              setOptions(prevState => ({ ...prevState, sortOrder: e.currentTarget.value }));
            }}
            onFocus={() => {
              EventStream.SendEventWithTarget(
                'serverListOptionsInteraction',
                'sortDropdown',
                {
                  pid: getPlaceIdFromUrl()
                },
                EventStream.TargetTypes.WWW
              );
            }}
            disabled={isLoading}
            value={options.sortOrder}
            id='sort-select'
            data-testid='sort-select'
            className='input-field rbx-select select-option'>
            <option value={sortOrders.descending}>
              {translate(resources.descending) || 'Descending'}
            </option>
            <option value={sortOrders.ascending}>
              {translate(resources.ascending) || 'Ascending'}
            </option>
          </select>
          <span className='icon-arrow icon-down-16x16' />
        </div>
      </div>
      <div className='checkbox'>
        <input
          onChange={e => {
            EventStream.SendEventWithTarget(
              'serverListOptionsInteraction',
              'filterSelect',
              {
                pid: getPlaceIdFromUrl(),
                checked: e.currentTarget.checked
              },
              EventStream.TargetTypes.WWW
            );
            setOptions(prevState => ({ ...prevState, excludeFullGames: e.currentTarget.checked }));
          }}
          disabled={isLoading}
          type='checkbox'
          id='filter-checkbox'
          data-testid='filter-checkbox'
          checked={options.excludeFullGames}
        />
        {/* The linter throws a false positive unless the input element is a child of label. 
        However, doing that breaks the :before CSS attributes. 
        The label still has the correct htmlFor prop, so it's safe. */}
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className='checkbox-label text-label' htmlFor='filter-checkbox'>
          {translate(resources.hideFullServers) || 'Hide Full Servers'}
        </label>
      </div>
    </div>
  );
}

export default withTranslations(ServerListOptions, translationConfig.serverList);

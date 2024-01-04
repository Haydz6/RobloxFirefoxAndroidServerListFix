import React, { createContext, useEffect, useState } from 'react';
import bedev2Services from '../services/bedev2Services';
import experimentConstants from '../constants/experimentConstants';

const { layerNames, defaultValues } = experimentConstants;

const experiments = {
  disableJoinButtonForFullServers: false
};

const Context = createContext(experiments);

export const ExperimentContextComponent: React.FC = ({ children }) => {
  const [experimentState, setExperimentState] = useState(experiments);

  useEffect(() => {
    bedev2Services
      .getExperimentationValues(layerNames.serverTab, defaultValues.serverTab)
      .then(data => {
        setExperimentState({
          disableJoinButtonForFullServers: !!data?.ShouldDisableJoinButtonForFullServers
        });
      })
      .catch(e => {
        // eslint-disable-next-line no-console
        console.error(e);
      });
  }, []);
  return <Context.Provider value={experimentState}>{children}</Context.Provider>;
};

export default Context;

import React, { useState, useEffect } from 'react';
import defaultResults from './splatnet-coop-results-defaults';
import { ipcRenderer } from 'electron';

const { Provider, Consumer } = React.createContext();

function useCoopResults() {
  const [state, setState] = useState(defaultResults);

  function handleResult(e, data) {
    setState(data);
  }

  useEffect(() => {
    ipcRenderer.on('apiData.coop_results', handleResult);
    return () =>
      ipcRenderer.removeListener('apiData.coop_results', handleResult);
  }, []);

  function refresh() {
    ipcRenderer.send('getApiAsyncV2', 'coop_results');
  }

  return [state, refresh];
}

function CoopResultsProvider(props) {
  const [coop_results, refresh] = useCoopResults;
  const value = { coop_results, refresh };

  return <Provider value={value}>{props.children}</Provider>;
}

export {
  CoopResultsProvider as default,
  Consumer as CoopResultsConsumer,
  useCoopResults
};

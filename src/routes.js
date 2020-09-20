import React, { useEffect } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import ApiViewer from './api-viewer';
import Schedule from './schedule';
import Salmon from './salmon';
import Records from './records';
import Results from './results';
import Meta from './meta';
import Settings from './settings';
import Navigation from './navigation';
import AnnieStore from './annie-store';
import Login from './login';
import About from './about';
import ErrorPage from './error';
import { useSplatnet } from './splatnet-provider';

const useUpdateRecords = () => {
  const splatnet = useSplatnet();
  useEffect(splatnet.comm.updateRecords, []);
};

const Routes = ({
  token,
  logoutCallback,
  setLocale,
  locale,
  loggedIn,
  setLogin,
}) => {
  useUpdateRecords();
  return (
    <>
      {loggedIn ? (
        <>
          <Navigation logoutCallback={logoutCallback} />
          <Switch>
            <Route path="/home" exact>
              <About />
            </Route>
            <Route path="/testApi" component={ApiViewer} />
            <Route path="/schedule" component={Schedule} />
            <Route path="/salmon" component={Salmon} />
            <Route path="/records" component={Records} />
            <Route path="/results" component={Results} />
            <Route path="/meta" component={Meta} />
            <Route path="/store" component={AnnieStore} />
            <Route path="/error">
              <ErrorPage logoutCallback={logoutCallback} />
            </Route>
            <Route
              path="/settings"
              component={() => (
                <Settings token={token} setLocale={setLocale} locale={locale} />
              )}
            />
          </Switch>
        </>
      ) : (
        <Login setLogin={setLogin} setLocale={setLocale} locale={locale} />
      )}
      <Switch>
        <Route
          exact
          path="/"
          render={() =>
            loggedIn ? (
              <Redirect from="/" to="/home" />
            ) : (
              <Redirect from="/" to="/login" />
            )
          }
        />
      </Switch>
    </>
  );
};

export default Routes;

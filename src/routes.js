import React from 'react';
import { Route } from 'react-router-dom';

import ApiViewer from './api-viewer';
import Schedule from './schedule';
import Records from './records';
import Results from './results';
import Settings from './settings';
import Navigation from './navigation';
import AnnieStore from './annie-store';
import About from './about';

const Routes = ({ token, logoutCallback, setLocale, locale }) =>
  <div>
    <Navigation />
    <Route path="/" exact component={About} />
    <Route path="/testApi" component={ApiViewer} />
    <Route path="/schedule" component={Schedule} />
    <Route path="/records" component={Records} />
    <Route path="/results" component={Results} />
    <Route path="/store" component={AnnieStore} />
    <Route
      path="/settings"
      component={() =>
        <Settings
          token={token}
          logoutCallback={logoutCallback}
          setLocale={setLocale}
          locale={locale}
        />}
    />
  </div>;

export default Routes;

import React from 'react';
import { Grid, Row, Col, Jumbotron } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const { shell, app } = window.require('electron').remote;
const { openExternal } = shell;
const appVersion = app.getVersion();

const AboutPage = () =>
  <Grid fluid>
    <Row>
      <Col md={12}>
        <Jumbotron style={{ textAlign: 'center' }}>
          <h1>Squid Tracks</h1>
          <h2>A Splatnet 2 Client for your Desktop</h2>
          <h5>{`Version ${appVersion}`}</h5>
        </Jumbotron>
        <h2>Stat.ink Integration</h2>
        <h4>Setup</h4>
        <ol>
          <li>
            Get your <strong>API token</strong> from{' '}
            <a onClick={() => openExternal('https://stat.ink/profile')}>
              https://stat.ink/profile
            </a>
          </li>
          <li>
            Go to{' '}
            <Link to="/settings">
              <strong>Settings</strong>
            </Link>{' '}
            tab and paste token into <strong>stat.ink API Token</strong>
          </li>
          <li>
            Click <strong>Save</strong>
          </li>
        </ol>
        <h4>Automatic Uploading</h4>
        <p>
          SquidTracks can poll for new games and automatically upload them when
          there is a new game. The poll timer is set at 2 minutes.
        </p>
        <ol>
          <li>
            Go to{' '}
            <Link to="/results">
              <strong>Results</strong>
            </Link>
          </li>
          <li>
            Click on <strong>Auto-upload to stat.ink</strong>
          </li>
          <li>
            Button text will switch to <strong>Polling</strong>
          </li>
          <li>
            When a new game comes in Button text will read{' '}
            <strong>Wrote battle X</strong> for 10 seconds
          </li>
          <li>When done playing click on the button again to stop polling</li>
          <li>
            Button text will change back to{' '}
            <strong>Auto-upload to stat.ink</strong>
          </li>
        </ol>
        <p>
          <em>
            Note: Autouploading is only active while Results tab is showing.
          </em>
        </p>
        <h4>Manual Uploading</h4>
        <p>
          Automatic uploading only uploads new games. If there are older games
          that have not been uploaded, you can use manual uploading.
        </p>
        <ol>
          <li>
            Go to{' '}
            <Link to="/results">
              <strong>Results</strong>
            </Link>
          </li>
          <li>
            Pick the game you want to upload. Either from the pulldown menu or
            clicking on the battle number in the table below
          </li>
          <li>
            Click <strong>Upload to stat.ink</strong>
          </li>
        </ol>

        <h2>For Help and Bug Filing</h2>
        <p>Send cries for help, bug reports, and feature requests to</p>
        <p>
          <a
            onClick={() =>
              openExternal('https://github.com/hymm/squid-tracks/issues')}
          >
            Github Issues
          </a>
        </p>
        <p>
          Twitter:{' '}
          <a onClick={() => openExternal('https://twitter.com/SquidTracks')}>
            @SquidTracks
          </a>
        </p>

        <h2>Releases</h2>
        <p>
          Once the program is installed, the program should autoupdate on
          startup.
        </p>
        <p>
          If there are problems with that, you can find releases at{' '}
          <a
            onClick={() =>
              openExternal('https://github.com/hymm/squid-tracks/releases')}
          >
            Github Releases
          </a>
        </p>
      </Col>
    </Row>
  </Grid>;

export default AboutPage;

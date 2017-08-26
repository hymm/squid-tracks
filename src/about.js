import React from 'react';
import { Grid, Row, Col, Jumbotron } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const { shell, app } = require('electron').remote;
const { openExternal } = shell;
const appVersion = app.getVersion();

const AboutPage = () =>
  <Grid fluid style={{ marginTop: 65 }}>
    <Row>
      <Col md={12}>
        <Jumbotron style={{ textAlign: 'center' }}>
          <h1>SquidTracks</h1>
          <h2>A Splatnet 2 Client for your Desktop</h2>
          <h5>
            {`Beta Version ${appVersion} `}
            <a
              onClick={() =>
                openExternal(
                  'https://github.com/hymm/squid-tracks/blob/master/CHANGELOG.md'
                )}
              style={{ cursor: 'pointer' }}
            >
              Change Log
            </a>
          </h5>
        </Jumbotron>
        <h2>Introduction</h2>
        <p>
          SquidTracks is a desktop program for tracking your Splatnet 2
          statistics. It reads the data from the Nintendo Splatnet API and
          presents it in an alternative format that is hopefully more easy to
          digest. There is also some data that the Nintendo App does not show.
          SquidTracks offers that data up too.
        </p>
        <p>
          Another feature of SquidTracks is that it can back up your data to
          stat.ink. Splatnet only records your most recent 50 games. SquidTracks
          offers integration with stat.ink where you can backup all of your
          games and also offers them for public viewing on the web.
        </p>
        <p>
          The records tab shows your win-loss records by stage and by weapon.
          The battle history tab shows your indidual battles. With a summary
          table and exact details.
        </p>
        <h2>Stat.ink Integration</h2>
        <p>
          <a
            onClick={() => openExternal('https://stat.ink/')}
            style={{ cursor: 'pointer' }}
          >
            Stat.ink
          </a>{' '}
          is a website that aggregates splatoon battle data and presents it on
          the web. Splatnet only saves the last 50 games, so this is a way to{' '}
        </p>
        <h4>Setup</h4>
        <ol>
          <li>
            Go to {' '}
            <Link to="/settings">
              <strong>Settings</strong>
            </Link>{' '}
          </li>
          <li>
            Click on the link to <strong>https://stat.ink/profile</strong> and
            copy your <strong>API Token</strong>. Stat.ink will open in another
            window.
          </li>
          <li>
            Come back to SquidTracks and paste token into{' '}
            <strong>stat.ink API Token</strong>
          </li>
          <li>
            Click <strong>Save Token</strong>
          </li>
        </ol>
        <h4>Automatic Uploading</h4>
        <p>
          SquidTracks can poll for new games and automatically upload them when
          there is a new game. The poll timer is set at 2 minutes.
        </p>
        <p>
          <em>
            Note: Autouploading is only active while Results tab is showing.
          </em>
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
            When a new game is detected, the button text changes to{' '}
            <strong>Wrote battle X</strong> for 10 seconds
          </li>
          <li>
            When done playing, click on the button again to stop auto uploads.
          </li>
        </ol>
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
            Pick the game you want to upload. Either from the dropdown menu or
            clicking on the battle number in the **Last 50 Battles** Table.
          </li>
          <li>
            Click <strong>Upload to stat.ink</strong>
          </li>
        </ol>
        <h2>Tracking and Privacy</h2>
        This program uses google analytics to track version uptake, activity,
        bugs, and crashing. Your information is anonymized before sending and
        will not be shared with any third party. If you find this creepy you can
        disable tracking in{' '}
        <Link to="/settings">
          <strong>Settings</strong>
        </Link>.
        <h2>For Help and Bug Filing</h2>
        <p>Send cries for help, bug reports, and feature requests to</p>
        <p>
          <a
            onClick={() =>
              openExternal('https://github.com/hymm/squid-tracks/issues')}
            style={{ cursor: 'pointer' }}
          >
            Github Issues
          </a>
        </p>
        <p>
          Twitter:{' '}
          <a
            onClick={() => openExternal('https://twitter.com/SquidTracks')}
            style={{ cursor: 'pointer' }}
          >
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
            style={{ cursor: 'pointer' }}
          >
            Github Releases
          </a>
        </p>
        <p>
          <a
            onClick={() =>
              openExternal(
                'https://github.com/hymm/squid-tracks/blob/master/README.md'
              )}
            style={{ cursor: 'pointer' }}
          >
            Click Here for More information
          </a>{' '}
          including the Roadmap for future Releases
        </p>
      </Col>
    </Row>
  </Grid>;

export default AboutPage;

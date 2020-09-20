import React from 'react';
import { Navbar, Nav, NavDropdown, Dropdown, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { FormattedMessage } from 'react-intl';
import { ipcRenderer } from 'electron';
import { event } from './analytics';
import { useSplatnet } from './splatnet-provider';
import Logo from './images/icon.png';

const Navigation = ({ logoutCallback }) => {
  const splatnet = useSplatnet();
  return (
    <Navbar bg="light" sticky="top">
      <Navbar.Brand className="squid-tracks">
        <Link to="/">
          <Image src={Logo} style={{ maxHeight: 40 }} />
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Nav className="mr-auto">
          <LinkContainer to="/schedule">
            <Nav.Link>
              <FormattedMessage
                id={'nav.schedule'}
                defaultMessage={'Schedule'}
              />
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to="/salmon">
            <Nav.Link>
              <FormattedMessage id={'nav.salmon'} defaultMessage={'Salmon'} />
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to="/records">
            <Nav.Link>
              <FormattedMessage id={'nav.records'} defaultMessage={'Records'} />
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to="/results">
            <Nav.Link>
              <FormattedMessage
                id={'nav.results'}
                defaultMessage={'Battle History'}
              />
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to="/store">
            <Nav.Link>
              <FormattedMessage id={'nav.store'} defaultMessage={'Store'} />
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to="/meta">
            <Nav.Link>
              <FormattedMessage
                id={'nav.league'}
                defaultMessage={'League Stats'}
              />
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to="/settings">
            <Nav.Link>
              <FormattedMessage
                id={'nav.settings'}
                defaultMessage={'Settings'}
              />
            </Nav.Link>
          </LinkContainer>
        </Nav>
        <Nav>
          <NavDropdown
            title={splatnet.current.records.records.player.nickname}
            id="basic-nav-dropdown"
          >
            <Dropdown.Item
              onClick={() => {
                event('user', 'logout');
                ipcRenderer.sendSync('logout');
                logoutCallback();
              }}
            >
              Logout
            </Dropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;

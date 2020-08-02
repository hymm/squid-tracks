import React from 'react';
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
  Image,
} from 'react-bootstrap';
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
    <Navbar fluid fixedTop collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand className="squid-tracks">
          <Link to="/">
            <Image src={Logo} style={{ maxHeight: 40 }} />
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <LinkContainer to="/schedule">
            <NavItem eventKey={3}>
              <FormattedMessage
                id={'nav.schedule'}
                defaultMessage={'Schedule'}
              />
            </NavItem>
          </LinkContainer>
          <LinkContainer to="/salmon">
            <NavItem eventKey={3.1}>
              <FormattedMessage id={'nav.salmon'} defaultMessage={'Salmon'} />
            </NavItem>
          </LinkContainer>
          <LinkContainer to="/records">
            <NavItem eventKey={3}>
              <FormattedMessage id={'nav.records'} defaultMessage={'Records'} />
            </NavItem>
          </LinkContainer>
          <LinkContainer to="/results">
            <NavItem eventKey={4}>
              <FormattedMessage
                id={'nav.results'}
                defaultMessage={'Battle History'}
              />
            </NavItem>
          </LinkContainer>
          <LinkContainer to="/store">
            <NavItem eventKey={5}>
              <FormattedMessage id={'nav.store'} defaultMessage={'Store'} />
            </NavItem>
          </LinkContainer>
          <LinkContainer to="/meta">
            <NavItem eventKey={6}>
              <FormattedMessage
                id={'nav.league'}
                defaultMessage={'League Stats'}
              />
            </NavItem>
          </LinkContainer>
          <LinkContainer to="/settings">
            <NavItem eventKey={7}>
              <FormattedMessage
                id={'nav.settings'}
                defaultMessage={'Settings'}
              />
            </NavItem>
          </LinkContainer>
        </Nav>
        <Nav pullRight>
          <NavDropdown
            eventKey={10}
            title={splatnet.current.records.records.player.nickname}
            id="basic-nav-dropdown"
          >
            <MenuItem
              eventKey={10.1}
              onClick={() => {
                event('user', 'logout');
                ipcRenderer.sendSync('logout');
                logoutCallback();
              }}
            >
              Logout
            </MenuItem>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;

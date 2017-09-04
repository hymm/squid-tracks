import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { FormattedMessage } from 'react-intl';
const isDev = require('electron-is-dev');

const Navigation = () =>
  <Navbar fluid fixedTop collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">Home</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        {/* <NavItem eventKey={1} onClick={() => loadSplatnet()}>
          Official Site
      </NavItem> */}
        {isDev
          ? <LinkContainer to="/testApi">
              <NavItem eventKey={2}>Api Checker</NavItem>
            </LinkContainer>
          : null}
        <LinkContainer to="/schedule">
          <NavItem eventKey={3}>
            <FormattedMessage id={'nav.schedule'} defaultMessage={'Schedule'} />
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
        <LinkContainer to="/settings">
          <NavItem eventKey={5}>
            <FormattedMessage id={'nav.settings'} defaultMessage={'Settings'} />
          </NavItem>
        </LinkContainer>
      </Nav>
    </Navbar.Collapse>
  </Navbar>;

export default Navigation;

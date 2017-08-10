import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
const isDev = window.require('electron-is-dev');

const Navigation = () =>
  <Navbar fixedTop>
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
        <LinkContainer to="/records">
          <NavItem eventKey={3}>Records</NavItem>
        </LinkContainer>
        <LinkContainer to="/results">
          <NavItem eventKey={4}>Battle History</NavItem>
        </LinkContainer>
        <LinkContainer to="/settings">
          <NavItem eventKey={5}>Settings</NavItem>
        </LinkContainer>
      </Nav>
    </Navbar.Collapse>
  </Navbar>;

export default Navigation;

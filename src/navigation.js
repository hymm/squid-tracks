import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

const Navigation = () =>
  <Navbar fluid>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">Home</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <NavItem eventKey={1}>Official Site</NavItem>
        <LinkContainer to="/testApi">
          <NavItem eventKey={2}>Api Checker</NavItem>
        </LinkContainer>
        <LinkContainer to="/records">
          <NavItem eventKey={3}>Records</NavItem>
        </LinkContainer>
        <LinkContainer to="/results">
          <NavItem eventKey={3}>Results</NavItem>
        </LinkContainer>
      </Nav>
    </Navbar.Collapse>
  </Navbar>;

export default Navigation;

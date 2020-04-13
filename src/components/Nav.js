/**
 * nav.js
 */

import React from "react";
import Navbar from "react-bootstrap/lib/Navbar";
import Nav from "react-bootstrap/lib/Nav";
import NavItem from "react-bootstrap/lib/NavItem";
import NavDropdown from "react-bootstrap/lib/NavDropdown";
import MenuItem from "react-bootstrap/lib/MenuItem";
import Image from "react-bootstrap/lib/Image";
import Logout from "./Logout";
import ControlLabel from 'react-bootstrap/lib/ControlLabel';

// import { Link } from 'react-router';

import {LinkContainer} from "react-router-bootstrap";

//import Logout from './logout';
import {messages} from "../js/messages";
import {appinfo} from "../js/appinfo";

import navimg from '../styles/img/shopping48.png';
// var navimg = require ("/styles/img/gynclinic48.png");

export default class HeaderNavigation extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
        <Navbar fluid>
			<Navbar.Header>
				<Navbar.Brand className="my-navbar-brand">
					{/*  <Link to='#' className="navbar-brand">{messages.appname}</Link>*/} {/*
					<LinkContainer to="/" className="my-navbar-brand-image">
						<NavItem eventKey={0} href="#">{}</NavItem>
					</LinkContainer>
					*/}
					<Image src={navimg}/>
					<LinkContainer to="/" className="navbar-brand">
						<NavItem eventKey={0} href="#">
							{messages.appname}
						</NavItem>
					</LinkContainer>
				</Navbar.Brand>
			</Navbar.Header>
			<Navbar.Toggle/>
			<Nav>
				<LinkContainer to="/products">
					<NavItem eventKey={1} href="#">
						{messages.products}
					</NavItem>
				</LinkContainer>
				<NavDropdown eventKey={2} title={messages.staticdata} id="staticdata-dropdown">
					<LinkContainer to="/users">
						<NavItem eventKey={2.1} href="#">
							{messages.users}
						</NavItem>
					</LinkContainer>
				</NavDropdown>
			</Nav>

			{/* <span>version {appinfo.version}</span> */}

			<Logout username={this.props.username}/>

		</Navbar>
		);
  }
}

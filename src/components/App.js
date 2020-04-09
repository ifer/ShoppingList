'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import {Switch, Route, Link, Redirect } from 'react-router-dom'

import '../styles/app.css';

import HeaderNavigation from "./Nav";
import PatientsManage from './PatientsManage';
import PatientsNotify from './PatientsNotify';
import Home from './Home';
import LoginForm from './LoginForm';
// import Footer from './Footer';
import Patient from './Patient';
import Users from './Users';
import {authentication} from '../js/authentication';
import {eventManager} from '../js/eventmanager';

var loggedIn = false;
var currentPath = null;




export default class App extends React.Component {
    constructor(props) {
      super(props);
      this._isMounted = false;
      this.state = {
        loggedIn: false,
        username: null
      };
      this.onAuthChange = this.onAuthChange.bind(this);
    }

    componentDidMount() {
      this._isMounted = true;
      this.subscription = eventManager.getEmitter().addListener(eventManager.authChannel, this.onAuthChange);
      // console.log("App componentDidMount: checking cookie...");
      authentication.checkLoginByCookie(this.onAuthChange);
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    onAuthChange(result, username) {
      // console.log ("App onAuthChange: " + result + ", " + username);
      this.setState({
        loggedIn: result,
        username: username
      });
      loggedIn = result;
      // console.log("App onAuthChange: set loggedIn to: " + loggedIn);
    }



    render() {
    	if (this._isMounted == false)
    		return null;

    	// console.log("App render: loggedIn = " + loggedIn);
    	return (<div >
    		<HeaderNavigation username={authentication.getCurrentUser()}/>
    		<div id="appcontent" className="app-content">
    			<Switch>
    				<PrivateRoute exact="exact" path="/" component={PatientsManage}/>
    				<Route path="/login" component={LoginForm}/>
    				<PrivateRoute path="/patients" component={PatientsManage}/>
    				<PrivateRoute path="/patient/:patid" component={Patient}/>
    				<PrivateRoute path="/users" component={Users}/>
                    <PrivateRoute path="/patientsnotif" component={PatientsNotify}/>
    			</Switch>
    		</div>
    		{/* <Footer /> */}

    	</div>);
    }
}



const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    loggedIn ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
				state: { from: props.location }
      }}/>

    )
  )}/>
)

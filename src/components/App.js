'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import {Switch, Route, Link, Redirect } from 'react-router-dom'

import '../styles/app.css';

import HeaderNavigation from "./Nav";

import Home from './Home';
import ProductsManage from './ProductsManage';
import LoginForm from './LoginForm';
import Categories from './Categories';

// import Footer from './Footer';
import Users from './Users';
import {authentication} from '../js/authentication';
import {eventManager} from '../js/eventmanager';
// import UserConfirmation from "../js/userConfirmation";

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
    				<PrivateRoute exact={true} path="/" component={ProductsManage}/>
                    <Route path="/products" component={ProductsManage}/>
                    <Route path="/categories" component={Categories}/>
    				<Route path="/login" component={LoginForm}/>
    				<PrivateRoute path="/users" component={Users}/>
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

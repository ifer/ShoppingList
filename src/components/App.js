'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import { Switch, Route, Router, Link, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { isExpired, decodeToken } from 'react-jwt';

import '../styles/app.css';

import HeaderNavigation from './Nav';

import Home from './Home';
import ProductsManage from './ProductsManage';
import LoginForm from './LoginForm';
import Categories from './Categories';

// import Footer from './Footer';
import Users from './Users';
import { authentication } from '../js/authentication';
import { eventManager } from '../js/eventmanager';
// import UserConfirmation from "../js/userConfirmation";

var loggedIn = false;
var currentPath = null;
const history = createBrowserHistory();

export default class App extends React.Component {
    constructor(props) {
        super(props);
        // this._isMounted = false;
        this.state = {
            loggedIn: false,
            username: null,
            userobj: null,
            isMounted: false,
        };

        this.onAuthChange = this.onAuthChange.bind(this);
    }

    async componentDidMount() {
        // this._isMounted = true;
        this.setState({ isMounted: true });
        this.subscription = eventManager.getEmitter().addListener(eventManager.authChannel, this.onAuthChange);
        console.log('App componentwillMount: checking token...');
        const token = localStorage.getItem('token');
        if (token && !isExpired(token)) {
            authentication.setAuthToken(token);
            const uo = await authentication.loadCurrentUserObject();
            this.setState({ userobj: uo });
            eventManager.getEmitter().emit(eventManager.authChannel, true, this.state.userobj.name);

            // this.onAuthChange(true, 200, this.state.userobj.name);
        } else {
            this.setState({ userobj: {} });
            eventManager.getEmitter().emit(eventManager.authChannel, false, '');

            // this.onAuthChange(false, 200, null);
        }
    }

    onAuthChange(result, username) {
        // console.log ("App onAuthChange: " + result + ", " + username);
        this.setState({
            loggedIn: result,
            username: username,
        });
        loggedIn = result;
        // console.log("App onAuthChange: set loggedIn to: " + loggedIn);
    }

    render() {
        if (this.state.userobj == null) return null;

        // console.log('current user = ' + JSON.stringify(this.state.userobj));
        return (
            <div>
                <HeaderNavigation username={this.state.userobj.name} />
                {/* <div id="appcontent" className="app-content">
                    <Router history={history}>
                        <Switch>
                            <RouteGuard exact path="/" component={ProductsManage} />
                            <RouteGuard exact path="/products" component={ProductsManage} />
                            <RouteGuard exact path="/categories" component={Categories} />
                            <RouteGuard exact path="/users" component={Users} />
                            <Route path="/login" component={LoginForm} />
                            <Redirect to="/" />
                        </Switch>
                    </Router>
                </div> */}
                <div id="appcontent" className="app-content">
                    <Switch>
                        <RouteGuard exact={true} path="/" component={ProductsManage} />
                        <Route path="/products" component={ProductsManage} />
                        <Route path="/categories" component={Categories} />
                        <Route path="/login" component={LoginForm} />
                        <RouteGuard path="/users" component={Users} />
                    </Switch>
                </div>
                {/* <Footer /> */}
            </div>
        );
    }
}

const RouteGuard = ({ component: Component, ...rest }) => {
    function hasJWT() {
        let flag = false;

        //check user has JWT token
        // console.log('RouteGuard');
        const token = localStorage.getItem('token');
        if (token && !isExpired(token)) {
            flag = true;
            authentication.setAuthToken(token);
            authentication.loadCurrentUserObject();
        } else {
            flag = false;
        }
        // localStorage.getItem('token') ? (flag = true) : (flag = false);

        return flag;
    }

    return (
        <Route
            {...rest}
            render={(props) =>
                hasJWT() ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                )
            }
        />
    );
};

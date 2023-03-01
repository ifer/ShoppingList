var axios = require('axios');
// import {cookies}  from './cookies';
import Cookies from 'js-cookie';
import { eventManager } from './eventmanager';
import { crypt } from './crypt';
import { serverinfo } from './serverinfo';
import { axiosInst } from '../components/App.js';

var authentication = {
    url_login: serverinfo.url_login(),
    url_logout: serverinfo.url_logout(),
    // url_login: 'http://localhost:8083/login',
    // url_logout: "http://localhost:8083/api/logout",
    isAuthenticated: false,
    username: null,
    password: null,
    userobj: null,

    login(uname, pass, callback) {
        // console.log("Login: url=" + this.url_login + " user:" + uname + ", pass=" + pass);

        axios
            .post(this.url_login, 'username=' + uname + '&password=' + pass)
            .then((response) => {
                this.isAuthenticated = true;
                this.username = response.data.username;
                this.password = response.data.password;
                this.token = response.data.token;

                this.setAuthToken(this.token);

                localStorage.setItem('token', this.token);

                this.loadCurrentUserObject();

                eventManager.getEmitter().emit(eventManager.authChannel, true, this.username);

                callback(true, 200, null);
            })
            .catch((error) => {
                eventManager.getEmitter().emit(eventManager.authChannel, false, '');
                if (error.response && error.response.status == 401) {
                    callback(false, 401, null);
                } else {
                    callback(false, -1, error.message);
                }
            });
    },
    setAuthToken(token) {
        if (token) {
            axiosInst.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else delete axiosInst.defaults.headers.common['Authorization'];
    },

    logout(callback) {
        this.isAuthenticated = false;
        this.username = null;
        this.password = null;
        eventManager.getEmitter().emit(eventManager.authChannel, false, null);
        localStorage.removeItem('token');

        callback(true, 200, null);
    },

    async loadCurrentUserObject() {
        // let userobj;
        try {
            const response = await axiosInst({ method: 'get', url: serverinfo.url_curruserdata() });
            this.userobj = response.data;
            this.username = this.userobj.name;
            this.isAuthenticated = this.userobj.authenticated;
            console.log('Userobj=' + JSON.stringify(this.userobj));
            return this.userobj;
        } catch (error) {
            console.log('loadCurrentUserData error: ' + error.message);
        }
    },

    getCurrentUser() {
        return this.username;
    },
};

export { authentication };

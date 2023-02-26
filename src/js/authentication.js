var axios = require('axios');
// import {cookies}  from './cookies';
import Cookies from 'js-cookie';
import { eventManager } from './eventmanager';
import { crypt } from './crypt';
import { serverinfo } from './serverinfo';

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
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else delete axios.defaults.headers.common['Authorization'];
    },
    logout(callback) {
        this.isAuthenticated = false;
        this.username = null;
        this.password = null;
        eventManager.getEmitter().emit(eventManager.authChannel, false, null);
        localStorage.removeItem('token');

        callback(true, 200, null);
    },

    loadCurrentUserObject() {
        axios({
            method: 'get',
            url: serverinfo.url_curruserdata(),
        })
            .then((response) => response.data)
            .then((json) => {
                this.userobj = json;
                this.username = json.name;
                this.isAuthenticated = json.authenticated;
                console.log('Userobj=' + JSON.stringify(this.userobj));
            })
            .catch((error) => {
                console.log('loadCurrentUserData error: ' + error.message);
            });
    },

    getCurrentUser() {
        return this.username;
    },
};

export { authentication };

/* axios version 1 - form based auth*/
/*
axios.post(url_login, 'username=' +  this.userobj.username + '&password=' + this.userobj.password)
.then(response => {
     this.props.location.onLogin.onLogin(true);
     this.setState({ redirectToReferrer: true });
})
.catch(error => {
  if (error.response && error.response.status == 401) {
      this.props.location.onLogin.onLogin(false);
      this.refs.dialog.showAlert(messages.wrong_credentials);
  }
  else {
      this.refs.dialog.showAlert(messages.api_uknown_error + '\n' + error.message);
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
   }
});
*/
// this.setState({ showLoginForm: false });

/* axios version 2 -basic auth*/
/*
axios({
method: 'post',
url: url_login,
data: {
username: this.userobj.username,
password: this.userobj.password
}
})
.then(response => {
 this.props.location.onLogin(true);
})
.catch(error => {
if (error.response && error.response.status == 401) {
  this.props.location.onLogin(false);
  this.refs.dialog.showAlert(messages.wrong_credentials);
}
else {
  this.refs.dialog.showAlert(messages.api_uknown_error + '\n' + error.message);
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
}
});
this.setState({ showLoginForm: false });
*/

/* Fetch vesrion WORKING */
/*
var form = new FormData();
form.append('username', this.userobj.username);
form.append('password', this.userobj.password);

fetch(url_login, {
  method: "POST",
  body: form,
  mode: 'cors'
})
.then(response => {                       //Detect  http errors
   if (response.status == 200){
     this.props.location.onLogin(true);
   }
   else {
     this.refs.dialog.showAlert(messages.wrong_credentials);
     this.props.location.onLogin(false);
   }
});
*/

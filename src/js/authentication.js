var axios = require('axios');
// import {cookies}  from './cookies';
import Cookies from 'js-cookie';
import {eventManager} from './eventmanager';
import {crypt} from './crypt';
import {serverinfo} from './serverinfo';


var authentication = {
  url_login: serverinfo.url_login(),
  url_logout: serverinfo.url_logout(),
  // url_login: 'http://localhost:8083/login',
  // url_logout: "http://localhost:8083/api/logout",
  isAuthenticated: false,
  username: null,
  password: null,
  userobj: null,
  cookieName: 'shoplistsession',
  // cookieDuration: 1/3,   // Duration in days. If 0 leave default: until browser closes.( 1/3: 8 hours)
  cookieDuration: 30,   // Duration in days. If 0 leave default: until browser closes.

  login(uname, pass, callback) {

// console.log("Login: url=" + this.url_login + " user:" + uname + ", pass=" + pass);



    axios.post(this.url_login, 'username=' + uname + '&password=' + pass)
      .then(response => {
        this.isAuthenticated = true;
        this.username = uname;
        this.password = pass;

        this.loadCurrentUserObject();

        this.saveCookie (uname, pass);

        eventManager.getEmitter().emit(eventManager.authChannel, true, this.username);

        callback(true, 200, null);
      })
      .catch(error => {
        eventManager.getEmitter().emit(eventManager.authChannel, false, '');
        if (error.response && error.response.status == 401) {
          callback(false, 401, null);
        } else {
          callback(false, -1, error.message);

        }
      });
  },

 logout(callback){

    axios({
        method: "get",
        url: this.url_logout,
        // auth: {
        //   username: authentication.username,
        //   password: authentication.password
        // }
      })
      .then(response => {                       //Detect  http errors

          if (response.status != 200){
            this.refs.dialog.showAlert(response.statusText,'medium');
            return (null);
          }
//          console.log(response);
          return response;
        })
      .then(response => {

          this.isAuthenticated = false;
          this.username = null;
          this.password = null;
          eventManager.getEmitter().emit(eventManager.authChannel, false, null);
          Cookies.remove(this.cookieName);
          callback(true, 200, null);

      })
      .catch(error => {
        console.log("logout error: " + error.message);
      });
  },

  loadCurrentUserObject (){


    axios({
      method: "get",
      url: serverinfo.url_curruserdata(),
      auth: {
        username: this.username,
        password: this.password
      }
    })
    .then(response => response.data)
    .then(json => {
      this.userobj = json;
// console.log("Userobj=" + JSON.stringify(this.userobj));
    })
    .catch(error => {
      console.log("loadCurrentUserData error: " + error.message);
    });


  },

  getCurrentUser() {
    return this.username;
  },

  saveCookie (uname, pass){
    let credentials = {username: uname,
                       password: crypt.encrypt(pass)};
    if (this.cookieDuration == 0)
      Cookies.set (this.cookieName, credentials);
    else {
      Cookies.set (this.cookieName, credentials, {expires: this.cookieDuration });
    }
  },


  checkLoginByCookie (callback){
      var credentials = Cookies.getJSON (this.cookieName);
      if (credentials != null){
        this.isAuthenticated = true;
        this.username = credentials.username;
        this.password = crypt.decrypt(credentials.password);

// console.log("By cookie");
        this.loadCurrentUserObject();

// console.log("authentication checkLoginByCookie: emitting: true " + this.username);

        callback(true, 200, this.username);
        //Set a timeout of 1 sec so that all components are mounted
        setTimeout(() => {eventManager.getEmitter().emit(eventManager.authChannel, true, this.username);}, 1000);
      }
      else {
          callback(false, 200, null);
          setTimeout(() => {eventManager.getEmitter().emit(eventManager.authChannel, false, null);}, 1000);
      }
  }

}

export {
  authentication
};


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

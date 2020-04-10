/**
 * logout.js
 */

import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import FormControl from 'react-bootstrap/FormControl';
import ControlLabel from 'react-bootstrap/ControlLabel';
import Navbar from 'react-bootstrap/Navbar';
import { browserHistory } from 'react-router';

import {messages} from "../js/messages";
import {authentication} from '../js/authentication';
import {eventManager} from '../js/eventmanager';

import {appinfo} from "../js/appinfo";
import {withRouter} from "react-router-dom";




var username = "None";

class Logout extends React.Component {
  constructor(props) {
		super(props);

//    this.onUsernameChange = this.onUsernameChange.bind(this);
  	 this.onLogoutClicked = this.onLogoutClicked.bind(this);
     this.handleLogout = this.handleLogout.bind(this);
     this.onAuthChange = this.onAuthChange.bind(this);
  	//  this.state = {username: props.username};
     this.state = {loggedIn: false, username: null};

  	}

  componentDidMount() {
        this.subscription = eventManager.getEmitter().addListener(eventManager.authChannel, this.onAuthChange);
      // console.log ("Logout subscribed ");
	}



  onAuthChange (result, username){
// console.log ("Logout onAuthChange: " + result + ", " + username);
    this.setState({loggedIn: result,
                    username: username});
  }


	onLogoutClicked(e) {
      authentication.logout(this.handleLogout);

	}



  onSubmit(e) {
    e.preventDefault();
//    console.log('Clicked');
  }

  handleLogout (result, status, message){
    if (result == true){
        this.setState({loggedIn: false, username: null});
        this.props.history.push("/");
    }
    else {
        this.refs.dialog.showAlert(messages.api_uknown_error + '\n' + message);
    }

  }



  render() {

	 return (
     (this.state.loggedIn) ?
    	   (
           <Navbar.Collapse>
            <Navbar.Form pullRight>
              <FormGroup>
                <ControlLabel className="username-label">
                  {this.state.username}
                </ControlLabel>
                <Button
                  type="submit"
                  bsStyle="link"
                  bsSize="small"
                  onClick={this.onLogoutClicked}
                >
                  {messages.logout}
                </Button>
              </FormGroup>
              <ControlLabel className="version-label">
                έκδ. {appinfo.version}
              </ControlLabel>
            </Navbar.Form>
          </Navbar.Collapse>
         )
      :
          (<div />)

    );
  }
}
export default withRouter(Logout);

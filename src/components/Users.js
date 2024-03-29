/*
Users.js
*/

import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Table from 'react-bootstrap/lib/Table';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Dialog from 'react-bootstrap-dialog';

import UserForm from './UserForm';
import '../styles/app.css';
import { messages } from '../js/messages';
import { serverinfo } from '../js/serverinfo';
import { authentication } from '../js/authentication';
import { isUserAdmin } from '../js/utils';
import * as dbapi from '../js/dbapi';

var axios = require('axios');

export default class Users extends React.Component {
    constructor(props) {
        super(props);

        this.loadUsers = this.loadUsers.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.openAddUserForm = this.openAddUserForm.bind(this);
        this.openUpdUserForm = this.openUpdUserForm.bind(this);
        this.openDelUserForm = this.openDelUserForm.bind(this);
        this.onRowSelect = this.onRowSelect.bind(this);
        this.initUserObject = this.initUserObject.bind(this);
        this.fillUserObject = this.fillUserObject.bind(this);
        this.getSelectedUser = this.getSelectedUser.bind(this);
        // this.loadCurrentUserData = this.loadCurrentUserData.bind(this);
        // this.remeasure = this.remeasure.bind(this);

        this.selectRowProp = {
            mode: 'radio',
            bgColor: 'pink', // you should give a bgcolor, otherwise, you can't regonize which row has been selected
            hideSelectColumn: true, // enable hide selection column.
            clickToSelect: true, // you should enable clickToSelect, otherwise, you can't select column.
            tableheight: '500px' /* To dynamically change table height */,
            onSelect: this.onRowSelect,
        };

        this._isMounted = false;
        this.userobj = null;
        this.selectedUserid = null;
        this.state = { users: [], userobj: this.userobj, curruser: null };
    }

    componentDidMount() {
        /* To dynamically change table height */
        // let h = getContentHeight();
        // this.setState({tableheight: h})
        // window.addEventListener('resize', this.remeasure);

        this._isMounted = true;

        this.loadUsers();
        // this.loadCurrentUserData();
        this.setState({ curruser: authentication.userobj });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    // 	remeasure (){
    // //		console.log("HEIGHT=" + getContentHeight() );
    // 		if (this._isMounted){
    // 			let h = getContentHeight();
    // 			this.setState({tableheight: h})
    // 		}

    // 	}

    async loadUsers() {
        let data;
        try {
            data = await dbapi.loadUsers();
            this.setState({ users: data });
        } catch (error) {
            this.refs.dialog.showAlert(error, 'medium');
        }
    }

    async updateUser(userobj, closeForm) {
        let resp;
        let target_url;

        if (isUserAdmin(this.state.curruser)) target_url = serverinfo.url_upduser();
        else target_url = serverinfo.url_updpasswd(); //Normal users can only change their own password

        try {
            resp = await dbapi.updateUser(userobj, target_url);
            if (authentication.username === userobj.name) {
                //If user changes his/her own password
                authentication.password = userobj.passwd; //Update authetication object with the new password
                // authentication.saveCookie(userobj.name, userobj.passwd); //Save cookie with the new password
            }
            this.loadUsers();
            closeForm();
        } catch (error) {
            this.refs.dialog.showAlert(error, 'medium');
            console.log('updateProduct error: ' + error);
        }
    }

    async deleteUser(userid) {
        let resp;
        try {
            resp = await dbapi.deleteUser(userid);
            this.loadUsers();
        } catch (error) {
            this.refs.dialog.showAlert(error, 'medium');
            console.log('deleteUser error: ' + error);
        }
    }

    initUserObject() {
        this.userobj = {
            userid: null,
            name: '',
            passwd: '',
            roles: '',
        };
    }

    fillUserObject(u) {
        this.userobj = {
            userid: u.userid,
            name: u.name,
            passwd: u.passwdhash,
            roles: u.roles,
        };
    }

    openAddUserForm() {
        // console.log(`curuser: ${JSON.stringify(this.state.curruser)}`);
        if (!isUserAdmin(this.state.curruser)) {
            this.refs.dialog.showAlert(messages.userActionNotPermitted, 'medium');
            return;
        }
        this.initUserObject();
        this.refs.UserForm.open(this.userobj);
    }

    openUpdUserForm() {
        if (this.selectedUserid == null) return;

        if (!isUserAdmin(this.state.curruser) && this.getSelectedUser().name != this.state.curruser.name) {
            this.refs.dialog.showAlert(messages.userCanOnlyChangeOwnPassword, 'medium');
            return;
        }
        //		let curuser = this.getSelectedUser ();

        this.fillUserObject(this.getSelectedUser());
        this.refs.UserForm.open(this.userobj);
    }

    getSelectedUser() {
        for (let i = 0; i < this.state.users.length; i++) {
            if (this.state.users[i].userid == this.selectedUserid) {
                return this.state.users[i];
            }
        }
        return null;
    }

    openDelUserForm() {
        if (this.selectedUserid == null) return;

        if (!isUserAdmin(this.state.curruser)) {
            this.refs.dialog.showAlert(messages.userActionNotPermitted, 'medium');
            return;
        }

        let curuser = this.getSelectedUser();

        let customBody = (
            <div>
                <div>{messages.deleteUserConfirmBody1}</div>
                <span className="text-primary">{curuser.name} </span>
                <div>
                    <p> </p>{' '}
                </div>
                <div>{messages.deleteUserConfirmBody2}</div>
            </div>
        );

        this.refs.dialog.show({
            title: messages.deleteUserConfirmTitle,
            body: customBody,
            actions: [
                Dialog.CancelAction(),
                Dialog.OKAction(() => {
                    this.deleteUser(this.getSelectedUser());
                }),
            ],
            bsSize: 'medium',
        });

        return;
    }

    onRowSelect(row, isSelected, e) {
        if (isSelected) this.selectedUserid = row.userid;
        else this.selectedUserid = null;

        //		if (isSelected){
        //			if (row.payed === messages.no)
        //				this.setState({canBeDeleted: true});
        //			else
        //				this.setState({canBeDeleted: false});
        //		}
        //		console.log(this.selectedExpid);
    }

    render() {
        const options = {
            noDataText: messages.listEmpty,
        };

        return (
            <div>
                <Grid style={{ width: '100%' }}>
                    <Row>
                        <Col md={7}>
                            <h3 className="page-title">{messages.users}</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <ButtonGroup bsClass="userlist-button-group">
                                <Button
                                    bsStyle="success"
                                    onClick={this.openAddUserForm}
                                    className="table-action-button"
                                >
                                    {messages.action_add}
                                </Button>
                                <Button bsStyle="info" onClick={this.openUpdUserForm} className="table-action-button">
                                    {messages.action_update}
                                </Button>
                                <Button bsStyle="danger" onClick={this.openDelUserForm} className="table-action-button">
                                    {messages.action_delete}
                                </Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                </Grid>
                <div className="users-table">
                    <BootstrapTable
                        data={this.state.users}
                        options={options}
                        striped
                        hover
                        condensed
                        height={this.state.tableheight}
                        ref="userTable"
                        selectRow={this.selectRowProp}
                    >
                        <TableHeaderColumn dataField="userid" defaultValue="0" hidden isKey>
                            {messages.usersId}
                        </TableHeaderColumn>
                        <TableHeaderColumn dataField="name" width="200px">
                            {messages.usersName}
                        </TableHeaderColumn>
                        {/*
		          <TableHeaderColumn dataField='passwdhash' dataFormat={ passwdFormatter } width="100px">{messages.usersPassword}</TableHeaderColumn>
		          */}
                        <TableHeaderColumn dataField="roles" width="400px">
                            {messages.usersRoles}
                        </TableHeaderColumn>
                    </BootstrapTable>
                </div>
                <UserForm ref="UserForm" onModify={this.updateUser} isAdmin={isUserAdmin(this.state.curruser)} />
                <Dialog ref="dialog" />
            </div>
        );
    }
}

function passwdFormatter(cell) {
    return '**********';
}

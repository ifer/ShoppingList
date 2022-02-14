import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Col from 'react-bootstrap/lib/Col';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import { Redirect } from 'react-router-dom';
import Dialog from 'react-bootstrap-dialog';

import '../styles/app.css';

import { messages } from '../js/messages';
import { authentication } from '../js/authentication';
import { eventManager } from '../js/eventmanager';

var axios = require('axios');

// const url_login = 'http://localhost:8083/login';

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        // this.auth = this.props.location.auth;
        this.submit = this.submit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.getFormValidationState = this.getFormValidationState.bind(this);
        this.handleLogin = this.handleLogin.bind(this);

        this.userobj = {
            username: null,
            password: null,
        };
        this.state = {
            showLoginForm: false,
            userobj: this.userobj,
            redirectToReferrer: false,
        };

        Dialog.setOptions({
            defaultOkLabel: messages.btnOK,
            defaultCancelLabel: messages.btnCancel,
            primaryClassName: 'btn-primary',
        });
    }

    componentDidMount() {
        console.log('LoginForm mounted');
        this.setState({
            showLoginForm: true,
        });
    }

    cancel() {
        this.setState({
            redirectToReferrer: false,
            showLoginForm: false,
        });
    }

    handleLogin(result, status, message) {
        if (result == true) {
            // eventManager.getEmitter().emit(eventManager.authChannel, true, authentication.getCurrentUser());
            this.setState({
                redirectToReferrer: true,
                showLoginForm: false,
            });
        } else {
            // eventManager.getEmitter().emit(eventManager.authChannel, false, '');

            if (status == 401) {
                this.refs.dialog.showAlert(messages.wrong_credentials);
            } else {
                this.refs.dialog.showAlert(messages.api_uknown_error + '\n' + message);
            }
            this.setState({
                redirectToReferrer: false,
                showLoginForm: false,
            });
        }
    }

    submit() {
        if (this.getFormValidationState() == 'error') {
            return;
        }
        authentication.login(this.userobj.username, this.userobj.password, this.handleLogin);
    }

    getFormValidationState() {
        if (
            this.userobj.username == null ||
            this.userobj.username == '' ||
            this.userobj.password == null ||
            this.userobj.password == ''
        ) {
            // this.refs.dialog.showAlert("Username and password must be given!",'medium');
            return 'error';
        }
        return 'success';
    }

    handleInputChange(event) {
        const target = event.target;

        let value = target.value;
        const name = target.name;

        this.userobj[name] = value;

        this.setState(() => ({
            //Necessary for validation functions to work
            userobj: this.userobj,
        }));

        // console.log (name +": " + this.userobj[name]);
    }

    render() {
        if (this.props.location.state === undefined) {
            return <Redirect to={'/'} />;
        }

        const { from } = this.props.location.state || { from: { pathname: '/' } };
        const { redirectToReferrer } = this.state;

        if (redirectToReferrer) {
            return <Redirect to={from} />;
        }

        return (
            <div>
                <Modal show={this.state.showLoginForm} onHide={this.cancel} keyboard={true} dialogClassName="">
                    <Modal.Header closeButton>
                        <Modal.Title>{messages.login}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form horizontal>
                            <FormGroup controlId="username">
                                <Col componentClass={ControlLabel} sm={4}>
                                    {messages.username}
                                </Col>
                                <Col sm={8}>
                                    <FormControl name="username" type="text" onChange={this.handleInputChange} />
                                </Col>
                            </FormGroup>

                            <FormGroup controlId="password">
                                <Col componentClass={ControlLabel} sm={4}>
                                    {messages.password}
                                </Col>
                                <Col sm={6}>
                                    <FormControl name="password" type="password" onChange={this.handleInputChange} />
                                </Col>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.submit}>{messages.btnOK}</Button>
                        <Button onClick={this.cancel}>{messages.btnCancel}</Button>
                    </Modal.Footer>
                </Modal>

                <Dialog ref="dialog" />
            </div>
        );
    }
}

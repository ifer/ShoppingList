/**e
 * userform.js
 */

import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Col from 'react-bootstrap/lib/Col';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

import Dialog from 'react-bootstrap-dialog';

import '../styles/app.css';
import { messages } from '../js/messages';

const valid_roles = ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_READONLY'];

export default class UserForm extends React.Component {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
        this.open = this.open.bind(this);
        this.cancel = this.cancel.bind(this);
        this.close = this.close.bind(this);
        this.addSuccess = this.addSuccess.bind(this);
        this.addError = this.addError.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.getFormValidationState = this.getFormValidationState.bind(this);
        this.handleInputPassword = this.handleInputPassword.bind(this);
        this.getRolesValidationState = this.getRolesValidationState.bind(this);
        this.getPasswordValidationState = this.getPasswordValidationState.bind(this);
        this.getNameValidationState = this.getNameValidationState.bind(this);
        this.checkPasswordStrength = this.checkPasswordStrength.bind(this);

        this.userobj = null;
        this.state = { showUserForm: false, userobj: this.userobj };

        this.passwords = {
            passwd1: null,
            passwd2: null,
        };

        this.isNewUser = false;

        Dialog.setOptions({
            defaultOkLabel: messages.btnOK,
            defaultCancelLabel: messages.btnCancel,
            primaryClassName: 'btn-primary',
        });
    }

    componentDidMount() {
        //		this.initExpenseObject ();
    }

    cancel() {
        this.setState({ showUserForm: false });
    }

    open(userobj) {
        this.userobj = userobj;

        if (this.userobj.userid == null) this.isNewUser = true;
        else this.isNewUser = false;

        this.setState({ showUserForm: true });

        this.passwords = {
            passwd1: null,
            passwd2: null,
        };

        //		this.setState({sharemethod: this.findShareMethod(this.userobj.expensetype)});
    }

    submit() {
        if (this.getFormValidationState() == 'error') {
            return;
        }
        //		if (this.getArbitraryShareValidationState() == 'error'){
        //			return;
        //		}

        if (this.passwords.passwd1 != null) this.userobj.password = this.passwords.passwd1;
        else this.userobj.password = null;

        this.props.onModify(this.userobj, this.addSuccess, this.addError);
    }

    addSuccess() {
        this.setState({ showUserForm: false });
    }

    addError() {
        return;
    }

    close() {
        this.setState({ showUserForm: false });
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

        //	    console.log (name +": " + this.userobj[name]);
    }

    handleInputPassword(event) {
        const target = event.target;

        let value = target.value;
        let name = target.name;
        this.passwords[name] = value;

        this.setState(() => ({
            //Necessary for validation functions to work
            userobj: this.userobj,
        }));
    }

    getFormValidationState() {
        let fldlist = '';

        if (this.getNameValidationState() == 'error') return 'error';

        if (this.getPasswordValidationState() == 'error') {
            this.refs.dialog.showAlert(messages.passwordsNotFit, 'medium');
            return 'error';
        }

        if (this.checkPasswordStrength(false) == 'error') {
            this.refs.dialog.showAlert(messages.passwordNotStrong, 'medium');
            return 'error';
        }

        //		if (this.passwords.passwd1 != null){
        //			if (this.passwords.passwd2 == null || this.passwords.passwd1 != this.passwords.passwd2){
        //				this.refs.dialog.showAlert(messages.passwordsNotFit,'medium');
        //				return 'error';
        //			}
        //		}
        //		else {
        //			fldlist = (fldlist == '') ? messages.usersName : fldlist + ', ' + messages.usersPassword;
        //		}

        if (this.getRolesValidationState() == 'error') return 'error';

        //		if (fldlist != ''){
        //			let msg = messages.expensesFormError.replace ("%f", fldlist );
        //			this.refs.dialog.showAlert(msg,'medium');
        //			return 'error';
        //		}

        return 'success';
    }

    getNameValidationState() {
        if (this.userobj.name == null || this.userobj.name == '') return 'error';
    }

    getPasswordValidationState(checkStrength) {
        if (this.isNewUser) {
            if (this.passwords.passwd1 == null || this.passwords.passwd2 == null) return 'error';
        }

        if (this.passwords.passwd1 != this.passwords.passwd2) {
            return 'error';
        }

        if (checkStrength == true) {
            if (this.checkPasswordStrength() == 'error') {
                return 'error';
            }
        }

        return 'success';
    }

    checkPasswordStrength() {
        if (this.passwords.passwd1 == null)
            //Not initialized yet
            return 'error';

        let txtpass = this.passwords.passwd1;

        //must not be smaller than 8
        if (txtpass.length < 8) return 'error';

        //must have both lower and uppercase characters
        // if (!(txtpass.match(/[a-z]/) && txtpass.match(/[A-Z]/))
        // return (false);

        //must have at least one number
        if (!txtpass.match(/\d+/)) return 'error';

        //must have at least one special character
        if (!txtpass.match(/.[\!\@\#\$\%\^\&\*\?\_\~\-\,\.]/)) return 'error';

        return 'success';
    }

    getRolesValidationState() {
        if (this.userobj.roles == null || this.userobj.roles == '')
            // Cannot be empty
            return 'error';

        let roles = this.userobj.roles.split(','); // Actual roles number cannot be greater than valid roles number
        if (roles.length > valid_roles.length) return 'error';

        let valid_occurrences = new Array(valid_roles.length);
        for (let i = 0; i < valid_occurrences.length; i++) valid_occurrences[i] = 0;

        for (let j = 0; j < roles.length; j++) {
            //Match actual roles with valid ones and increase valid counters
            for (let i = 0; i < valid_roles.length; i++) {
                if (roles[j].trim() === valid_roles[i].trim()) valid_occurrences[i]++;
                if (valid_occurrences[i] > 1)
                    // A role cannot appear more than once
                    return 'error';
            }
        }

        let sum = 0;
        for (let i = 0; i < valid_occurrences.length; i++) {
            // Sum valid occurrences
            sum += valid_occurrences[i];
        }

        if (sum == roles.length)
            // All actual roles must be valid
            return 'success';

        return 'error';
    }

    render() {
        if (this.userobj == null) return <div />;

        return (
            <div>
                <Modal show={this.state.showUserForm} onHide={this.cancel} keyboard={true} dialogClassName="">
                    <Modal.Header closeButton>
                        <Modal.Title>{messages.userdata}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form horizontal>
                            <FormGroup controlId="name" validationState={this.getNameValidationState()}>
                                <Col componentClass={ControlLabel} sm={4}>
                                    {messages.usersName}
                                </Col>
                                <Col sm={8}>
                                    <FormControl
                                        name="name"
                                        readOnly={!this.props.isAdmin}
                                        type="text"
                                        defaultValue={this.userobj.name}
                                        onChange={this.handleInputChange}
                                    />
                                </Col>
                            </FormGroup>

                            <FormGroup controlId="passwd1" validationState={this.getPasswordValidationState(true)}>
                                <Col componentClass={ControlLabel} sm={4}>
                                    {messages.usersPassword}
                                </Col>
                                <Col sm={8}>
                                    <FormControl
                                        name="passwd1"
                                        type="password"
                                        defaultValue={''}
                                        onChange={this.handleInputPassword}
                                    />
                                </Col>
                            </FormGroup>

                            <FormGroup controlId="passwd2" validationState={this.getPasswordValidationState(true)}>
                                <Col componentClass={ControlLabel} sm={4}>
                                    {messages.usersPasswordRepeat}
                                </Col>
                                <Col sm={8}>
                                    <FormControl
                                        name="passwd2"
                                        type="password"
                                        defaultValue={''}
                                        onChange={this.handleInputPassword}
                                    />
                                </Col>
                            </FormGroup>

                            <FormGroup
                                controlId="roles"
                                onChange={this.handleInputChange}
                                validationState={this.getRolesValidationState()}
                            >
                                <Col componentClass={ControlLabel} sm={4}>
                                    {messages.usersRoles}
                                </Col>
                                <Col sm={8}>
                                    <FormControl
                                        name="roles"
                                        type="text"
                                        readOnly={!this.props.isAdmin}
                                        defaultValue={this.userobj.roles}
                                        onChange={this.handleInputChange}
                                    />
                                    <HelpBlock className="user-roles">{messages.rolesHelp}</HelpBlock>
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

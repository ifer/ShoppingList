import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Label from 'react-bootstrap/lib/Label';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Table from 'react-bootstrap/lib/Table';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Dialog from 'react-bootstrap-dialog';

import {withRouter} from "react-router-dom";

import '../styles/app.css';
import {messages} from "../js/messages";
import {serverinfo} from '../js/serverinfo';
import {authentication} from '../js/authentication';
// import {searchformObject} from '../model/searchformObject';
import {productObject} from '../model/productObject';
// import {getContentHeight} from "../js/utils";

import {getContentHeight, calcAge, isUserReadonly} from "../js/utils";

import {SearchTextFormControl} from './FormComponents';

// import Patient from './Patient';

var moment = require('moment');
var dateFormat = "DD/MM/YYYY";

var axios = require('axios');

class PatientsManage extends React.Component {

	constructor(props) {
		super(props);
		this.loadPatients = this.loadPatients.bind(this);
		this.clearResults = this.clearResults.bind(this);
		this.openPatient = this.openPatient.bind(this);
		this.deletePatient = this.deletePatient.bind(this);
		this.loadSearchForm = this.loadSearchForm.bind(this);
		this.saveSearchForm = this.saveSearchForm.bind(this);
		this.isSearchFormNull = this.isSearchFormNull.bind(this);

		Dialog.setOptions({defaultOkLabel: messages.btnOK, defaultCancelLabel: messages.btnCancel, primaryClassName: 'btn-primary'})

		// this.searchform = null;
		this.state = {
			searchform: null,
			patients: []
		};

		this.readonly = null;

	}

	componentDidMount() {
		let sf = this.loadSearchForm();
		if (!this.isSearchFormNull(sf)) { //Restores search form user input from session store
			//and performs the search to fill the list
			// this.searchform = sf;
			// console.log("PATIENTSMANAGE componentDidMount searchform=" + JSON.stringify(this.state.searchform));
			this.loadPatients(sf);
		}
		this.readonly = isUserReadonly(authentication.userobj);
	}

	isSearchFormNull(sf) {
		if (sf == null)
			return true;

		if (sf.lastname == null && sf.name == null && sf.phone == null && sf.profession == null && sf.email == null)
			return (true);

		return (false);
	}

	loadPatients(sf) {

		// this.searchform = sf;
		// this.saveSearchForm (sf);

		axios({
			method: 'post',
			url: serverinfo.url_patientslist(),
			data: sf,
			auth: {
				username: authentication.username,
				password: authentication.password
			}
		}).then(response => response.data).then(json => {
			this.saveSearchForm(sf);
			this.setState({searchform: sf, patients: json});

			this.readonly = isUserReadonly(authentication.userobj);
// console.log("PATIENTSMANAGE loadPatients searchform=" + JSON.stringify(this.state.searchform ));
// console.log("loadPatients: result " + JSON.stringify(json))	;
		}).catch(error => {
			console.log("loadPatients error: " + error.message);
		});
	}

	clearResults() {

		// this.state.searchform.lastname = '';
		// this.searchform.name = '';
		// this.searchform.phone = '';
		// this.searchform.profession = '';

		let sf = {
			lastname: null,
			name: null,
			phone: null,
			email: null,
			profession: null,
			region: null
		};

		this.setState({searchform: sf, patients: []});
		this.saveSearchForm(sf);
	}

	//Save search form user input to session store
	saveSearchForm(sf) {

		sessionStorage.setItem("searchform-" + authentication.username, JSON.stringify(sf));

	}

	//Load search form user input from session store
	loadSearchForm() {
		let s = sessionStorage.getItem("searchform-" + authentication.username);
		if (s == null)
			return (null);

		let sf = JSON.parse(s);
		return (sf);

	}

	openPatient(patient) {
		const patid = patient.patid;
		const path = `/patient/${patid}`;
		this.props.history.push(path);
	}

	deletePatient(patobj) {
		axios({
			method: 'post',
			url: serverinfo.url_delete_patient(),
			data: patobj,
			auth: {
				username: authentication.username,
				password: authentication.password
			}
		}).then(response => { //Detect  http errors
			if (response.status != 200) {
				this.refs.dialog.showAlert(response.statusText, 'medium');
				return (null);
			}
			//        	console.log(response);
			return response;
		}).then(response => response.data).then(responseMessage => { //Detect app or db errors
			//            console.log (responseMessage);
			if (responseMessage.status == 0) { //SUCCESS
				this.refs.patientslist.setSelectedPatid(null);
				if (this.state.searchform != null) // Refresh list
					this.loadPatients(this.state.searchform);
				}
			else {
				this.refs.dialog.showAlert(responseMessage.message, 'medium');
				//            	onError();
			}
		}).catch(error => {
			console.log("deletePatient error: " + error.message);
			this.refs.dialog.showAlert(error.message, 'medium');
		});
	}

	render() {
		// console.log("PATIENTSMANAGE render searchform=" + JSON.stringify(this.state.searchform ));
		this.readonly = isUserReadonly(authentication.userobj);
		// console.log("readonly="+this.readonly);
		return (<div >
			<Grid className="patlist-grid">
				<Row>
					<Col md={12}>
						<h3 className="page-title">{messages.patientsManage}</h3>
					</Col>
				</Row>
				<Row className="patlist-row">
					<Col md={2} className="patlist-search">
						<Search loadSearchForm={this.loadSearchForm} onSubmit={this.loadPatients} clearResults={this.clearResults}/>
					</Col>
					<Col md={10} className="patlist-table">
						<PatientsList ref="patientslist" patients={this.state.patients} openform={this.openPatient} deletePatient={this.deletePatient} readonly={this.readonly}/>
					</Col>
				</Row>
			</Grid>
			<Dialog ref='dialog'/>
		</div>);

	}
}
//Wrap into withRouter to have access to 'this.props.history'
export default withRouter(PatientsManage);

class Search extends React.Component {
	constructor(props) {
		super(props);

		this.handleInputChange = this.handleInputChange.bind(this);
		this.submit = this.submit.bind(this);
		this.clear = this.clear.bind(this);

		this.searchformObject = Object.assign({}, searchformObject);

		this.state = {
			cleared: false,
			searchform: this.searchformObject
		};
	}

	componentWillMount() {
		let sf = this.props.loadSearchForm();
		if (sf != null) {
			this.searchformObject = sf;
			this.setState({searchform: this.searchformObject});

		}

		// console.log("SEARCH componentWillMount searchform=" + JSON.stringify(this.props.searchform ));
	}

	submit() {
		if (this.getFormValidationState() == 'error') {
			return;
		}
		// console.log("submit: " + JSON.stringify(searchform))	;

		//searchform: object imported from ../model/searchform
		this.props.onSubmit(this.state.searchform);

	}

	clear() {

		if (this.refs.refLastname)
			this.refs.refLastname.clearTextInput();
		if (this.refs.refName)
			this.refs.refName.clearTextInput();
		if (this.refs.refPhone)
			this.refs.refPhone.clearTextInput();
		if (this.refs.refEmail)
			this.refs.refEmail.clearTextInput();
		if (this.refs.refProfession)
			this.refs.refProfession.clearTextInput();

		let sf = {
			lastname: null,
			name: null,
			phone: null,
			email: null,
			profession: null,
			region: null
		};

		this.searchformObject = sf;
		this.setState({searchform: this.searchformObject});

		this.props.clearResults();

		// this.setState({cleared: true});

	}

	getFormValidationState() {

		if (!this.state.searchform.lastname &&
			!this.state.searchform.name &&
			!this.state.searchform.phone &&
			!this.state.searchform.email &&
			!this.state.searchform.profession &&
			!this.state.searchform.region) {
				this.refs.dialog.showAlert(messages.errorSearchEmptyCriteria, 'medium');
			return 'error';
		}

		return ('success');
	}

	handleInputChange(event) {
		const target = event.target;

		let value = target.value;;
		const name = target.name;

		this.searchformObject[name] = value;

		this.setState(() => ({ //Necessary for validation functions to work

			searchform: this.searchformObject
		}));

		// console.log("handleInputChange: " + JSON.stringify(searchform))	;

		// console.log (name +": " + this.searchformObject[name]);
	}

	render() {

		// console.log("SEARCH render: " + JSON.stringify(this.state.searchform))	;

		return (<div>
			<Form horizontal>
				<h3 className="patlist-search-criteria">{messages.searchCriteria}</h3>
				<SearchTextFormControl name="lastname" initialValue={this.state.searchform.lastname || ''} onChange={this.handleInputChange} placeholder={messages.patientLastname} ref="refLastname"/>
				<SearchTextFormControl name="name" initialValue={this.state.searchform.name || ''} onChange={this.handleInputChange} placeholder={messages.patientFirstname} ref="refName"/>
				<SearchTextFormControl name="phone" initialValue={this.state.searchform.phone || ''} onChange={this.handleInputChange} placeholder={messages.patientPhone} ref="refPhone"/>
				<SearchTextFormControl name="email" initialValue={this.state.searchform.email || ''} onChange={this.handleInputChange} placeholder={messages.patientEmail} ref="refEmail"/>
				<SearchTextFormControl name="profession" initialValue={this.state.searchform.profession || ''} onChange={this.handleInputChange} placeholder={messages.patientProfession} ref="refProfession"/>
				<SearchTextFormControl name="region" initialValue={this.state.searchform.region || ''} onChange={this.handleInputChange} placeholder={messages.patientRegion} ref="refRegion"/>

				<FormGroup>
					<Col md={12}>
						<Button className="patlist-search-button" bsStyle="primary" onClick={this.submit}>
							{messages.action_search}
						</Button>

						<Button className="patlist-cancel-button" onClick={this.clear}>
							{messages.btnClear}
						</Button>
					</Col>
				</FormGroup>
			</Form>
			<Dialog ref="dialog"/>
		</div>);
	}
}

class PatientsList extends React.Component {
	constructor(props) {
		super(props);

		this.openAddPatientForm = this.openAddPatientForm.bind(this);
		this.openUpdPatientForm = this.openUpdPatientForm.bind(this);
		this.openDelPatientForm = this.openDelPatientForm.bind(this);
		this.onRowSelect = this.onRowSelect.bind(this);
		this.getSelectedPatient = this.getSelectedPatient.bind(this);
		this.remeasure = this.remeasure.bind(this);
		this.getSelectedPatient = this.getSelectedPatient.bind(this);
		this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
		this.setSelectedPatid = this.setSelectedPatid.bind(this);

		this.selectRowProp = {
			mode: 'radio',
			bgColor: 'pink', // you should give a bgcolor, otherwise, you can't regonize which row has been selected
			hideSelectColumn: true, // enable hide selection column.
			clickToSelect: true, // you should enable clickToSelect, otherwise, you can't select column.
			onSelect: this.onRowSelect

		}

		/* To dynamically change table height */
		this.state = {
			tableheight: "500px"
		};

		this.selectedPatid = null;

		this._isMounted = false;

		return;
	}

	componentDidMount() {
		/* To scroll to bottom automatically */
		// this.node = ReactDOM.findDOMNode(this.refs.expTable).childNodes[0].childNodes[1];

		this._isMounted = true;

		/* To dynamically change table height */
		let h = getContentHeight();
		this.setState({tableheight: h})

		window.addEventListener('resize', this.remeasure);
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	/* To scroll to bottom automatically */
	componentDidUpdate() {
		// this.node.scrollTop = this.node.scrollHeight;
		if (this.refs.resultsInfo != undefined)
			this.refs.resultsInfo.setResultsNumber(this.props.patients.length);
		}

	/* To dynamically change table height */
	remeasure() {
		// console.log("HEIGHT=" + getContentHeight() );
		if (this._isMounted) {
			let h = getContentHeight();
			this.setState({tableheight: h})
		}

	}

	onRowSelect(row, isSelected, e) {
		if (isSelected)
			this.selectedPatid = row.patid;
		else
			this.selectedPatid = null;

			// console.log(this.selectedPatid);
		}

	getSelectedPatient() {

		for (let i = 0; i < this.props.patients.length; i++) {
			if (this.props.patients[i].patid == this.selectedPatid) {
				return this.props.patients[i];
			}
		}
		return (null);
	}

	setSelectedPatid(patid) {
		this.selectedPatid = patid;
	}

	openAddPatientForm() {

		// console.log("Opening patient ADD ");

		var newPatient = Object.assign({}, patientObject);
		this.props.openform(newPatient);

	}

	openUpdPatientForm() {
		if (this.selectedPatid == null)
			return;

		var patient = this.getSelectedPatient();

		this.props.openform(patient);

	}

	openDelPatientForm() {
		if (this.selectedPatid == null)
			return;

		var patient = this.getSelectedPatient();

		let customBody = (<div>
			<div>
				{messages.deletePatientConfirmBody1}
			</div>
			<span className='text-primary'>{messages.patform_lastname}: {patient.lastname}
				<br/> {messages.patform_name}: {patient.name}
				<br/> {messages.patform_familyname}: {patient.familyname}
				<br/> {messages.patform_address}: {patient.address}
				<br/> {messages.patform_city}: {patient.city}
				<br/> {messages.patform_birthdate}: {patient.birthdate}
				<br/> {messages.patform_profession}: {patient.profession}
			</span>
			<div>
				<p></p>
			</div>
			<div>
				{messages.deletePatientConfirmBody2}
			</div>
		</div>);

		this.refs.dialog.show({
			title: messages.deletePatientConfirmTitle,
			body: customBody,
			actions: [
				Dialog.CancelAction(), Dialog.OKAction(() => {
					this.props.deletePatient(patient);
				})
			],
			bsSize: 'medium'
		});

		return;
	}

	onRowDoubleClick(row) {
		this.selectedPatid = row.patid;
		this.openUpdPatientForm();
	}

	render() {
		let patients = [];
		for (let i = 0; i < this.props.patients.length; i++) {
			var patient = {
				patid: this.props.patients[i].patid,
				fullname: this.props.patients[i].lastname + ' ' + this.props.patients[i].name,
				birthdate: this.props.patients[i].birthdate,
				age: calcAge(this.props.patients[i].birthdate),
				address: this.props.patients[i].address,
				city: this.props.patients[i].city,
				phone: getPhones(this.props.patients[i].phone1, this.props.patients[i].phone2),
				email: this.props.patients[i].email,
				profession: this.props.patients[i].profession

			};
			patients.push(patient);
		}

		// if (this.refs.resultsInfo != undefined)
		// 	this.refs.resultsInfo.setResultsNumber (this.props.patients.length);

		const options = {
			noDataText: messages.listEmpty,
			onRowDoubleClick: this.onRowDoubleClick
		};

		// console.log ("READONLY="+this.props.readonly);

		return (<div>
			<Grid style={{
					width: '100%'
				}}>
				<Row>
					<Col md={9}>
						<ButtonGroup bsClass="patlist-button-group">
							<Button bsStyle="success" onClick={this.openAddPatientForm} className="table-action-button" disabled={this.props.readonly}>{messages.action_add}</Button>
							<Button bsStyle="primary" onClick={this.openUpdPatientForm} className="table-action-button">{messages.action_update}</Button>
							<Button bsStyle="danger" onClick={this.openDelPatientForm} className="table-action-button" disabled={this.props.readonly}>{messages.action_delete}</Button>
						</ButtonGroup>
					</Col>
					<Col md={3}>
						<SearchResultsInfo ref="resultsInfo"/>
					</Col>
				</Row>
			</Grid>
			<BootstrapTable data={patients} striped hover condensed height={this.state.tableheight} width='100%' ref="patTable" selectRow={this.selectRowProp} options={options}>
				<TableHeaderColumn dataField="patid" dataAlign='left' headerAlign='center' className="table-header" width="5%" isKey={true}>{messages.patform_patid}</TableHeaderColumn>
				<TableHeaderColumn dataField="fullname" dataAlign='left' headerAlign='center' className="table-header" width="18%">{messages.patientFullname}</TableHeaderColumn>
				<TableHeaderColumn dataField="birthdate" dataAlign='left' headerAlign='center' className="table-header" width="7%">{messages.patientBirthdate}</TableHeaderColumn>
				<TableHeaderColumn dataField="age" dataAlign='center' headerAlign='center' className="table-header" width="5%">{messages.patientAge}</TableHeaderColumn>
				<TableHeaderColumn dataField="address" dataAlign='left' headerAlign='center' className="table-header" width="18%">{messages.patientAddress}</TableHeaderColumn>
				<TableHeaderColumn dataField="city" dataAlign='left' headerAlign='center' className="table-header" width="10%">{messages.patientCity}</TableHeaderColumn>
				<TableHeaderColumn dataField="phone" dataAlign='left' headerAlign='center' className="table-header" width="13%">{messages.patientPhone}</TableHeaderColumn>
				<TableHeaderColumn dataField="email" dataAlign='left' headerAlign='center' className="table-header" width="12%">{messages.patientEmail}</TableHeaderColumn>
				<TableHeaderColumn dataField="profession" dataAlign='left' headerAlign='center' className="table-header" width="12%">{messages.patientProfession}</TableHeaderColumn>
			</BootstrapTable>

			<Dialog ref='dialog'/>

		</div>);
	}
}

class SearchResultsInfo extends React.Component {
	constructor(props) {
		super(props);

		this.getPatientsCount = this.getPatientsCount.bind(this);

		this.state = {
			resultsNumber: 0,
			totalNumber: 0
		};

		this.total = 0;
	}

	componentWillMount() {
		this.getPatientsCount();
	}

	componentDidMount() {

		this.setState({totalNumber: this.total});
	}

	getPatientsCount() {
		axios({
			method: "get",
			url: serverinfo.url_patientscount(),
			auth: {
				username: authentication.username,
				password: authentication.password
			}
		}).then(response => response.data).then(json => {
			this.total = json;
			// this.setState({ totalNumber: json });
			// console.log("loadPatients: result " + JSON.stringify(json))	;
		}).catch(error => {
			console.log("getPatientsCount error: " + error.message);
		});
	}

	setResultsNumber(num) {
		this.setState({resultsNumber: num, totalNumber: this.total});
	}

	render() {
		if (this.state.resultsNumber == null && this.state.totalNumber == null)
			return null;

		let resinfo = '';
		if (this.state.resultsNumber == null)
			resinfo = '0 / ' + this.state.totalNumber;
		else
			resinfo = this.state.resultsNumber + ' / ' + this.state.totalNumber;

		return (<div>
			<Table striped bordered condensed className="resultsinfo-table">
				<tbody>
					<tr>
						<td className="resultsinfo-col-label">
							{messages.searchResultsNumber}
						</td>
						<td className="resultsinfo-col-value">
							{resinfo}
						</td>
					</tr>
				</tbody>
			</Table>
		</div>);
	}
}

function getPhones(phone1, phone2) {
	if (!phone1 && !phone2)
		return ('');
	else if (!phone2)
		return (phone1);
	else if (!phone1)
		return (phone2);
	else
		return (phone1 + ', ' + phone2);

}

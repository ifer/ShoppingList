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

class ProductsManage extends React.Component {

	constructor(props) {
		super(props);
		this.loadProducts = this.loadProducts.bind(this);
		this.deleteProduct = this.deleteProduct.bind(this);

		Dialog.setOptions({defaultOkLabel: messages.btnOK, defaultCancelLabel: messages.btnCancel, primaryClassName: 'btn-primary'})

		// this.searchform = null;
		this.state = {
			products: []
		};

	}

	componentDidMount() {

		this.loadProducts();
	}

	loadProducts() {

		// this.searchform = sf;
		// this.saveSearchForm (sf);

		axios({
			method: 'get',
			url: serverinfo.url_productlist(),
			auth: {
				username: authentication.username,
				password: authentication.password
			}
		}).then(response => response.data).then(json => {
			this.setState({ products: json});

console.log("loadProducts: result " + JSON.stringify(json))	;
		}).catch(error => {
			console.log("loadProducts error: " + error.message);
		});
	}


	deleteProduct(prodobj) {
		axios({
			method: 'post',
			url: serverinfo.url_delproduct(),
			data: prodobj,
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
				this.loadProducts();
			}
			else {
				this.refs.dialog.showAlert(responseMessage.message, 'medium');
				//            	onError();
			}
		}).catch(error => {
			console.log("deleteProduct error: " + error.message);
			this.refs.dialog.showAlert(error.message, 'medium');
		});
	}

	render() {
		return (<div >
			<Grid className="prodlist-grid">
				<Row>
					<Col md={12}>
						<h3 className="page-title">{messages.productsManage}</h3>
					</Col>
				</Row>
				<Row className="prodlist-row">
					<Col md={2} className="prodlist-search">
					</Col>
					<Col md={10} className="prodlist-table">
					</Col>
				</Row>
			</Grid>
			<Dialog ref='dialog'/>
		</div>);

	}
}
//Wrap into withRouter to have access to 'this.props.history'
export default withRouter(ProductsManage);

// <PatientsList ref="patientslist" patients={this.state.patients} openform={this.openPatient} deleteProduct={this.deleteProduct} readonly={this.readonly}/>

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
				{messages.deleteProductConfirmBody1}
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
				{messages.deleteProductConfirmBody2}
			</div>
		</div>);

		this.refs.dialog.show({
			title: messages.deleteProductConfirmTitle,
			body: customBody,
			actions: [
				Dialog.CancelAction(), Dialog.OKAction(() => {
					this.props.deleteProduct(patient);
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
						<ButtonGroup bsClass="prodlist-button-group">
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

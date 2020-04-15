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
import ListGroup from 'react-bootstrap/lib/ListGroup';
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
import {ProductObject} from '../model/ProductObject';
// import {getContentHeight} from "../js/utils";

import {getContentHeight, calcAge, isUserReadonly} from "../js/utils";

import {SearchTextFormControl} from './FormComponents';
import ProductForm from "./ProductForm";

// import Patient from './Patient';

var moment = require('moment');
var dateFormat = "DD/MM/YYYY";

var axios = require('axios');

class ProductsManage extends React.Component {

	constructor(props) {
		super(props);
		this.loadProducts = this.loadProducts.bind(this);
		this.loadCategories = this.loadCategories.bind(this);
		this.deleteProduct = this.deleteProduct.bind(this);
		this.updateProduct = this.updateProduct.bind(this);
		this.applyListFilter = this.applyListFilter.bind(this);
		this.openProduct = this.openProduct.bind(this);
		this.addQuantityField = this.addQuantityField.bind(this);

		Dialog.setOptions({defaultOkLabel: messages.btnOK, defaultCancelLabel: messages.btnCancel, primaryClassName: 'btn-primary'})

		// this.searchform = null;
		this.state = {
			products: [],
			caregories: []
		};

	}

	componentDidMount() {
		this.loadProducts();
		this.loadCategories();
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
			json.sort(productsCompare);
			// json = this.addQuantityField(json);
			for (let i=0; i< json.length; i++){
				json[i].quantity = 0;
				json[i].selected = false;
			}
			// console.log("loadProducts: result " + JSON.stringify(json))	;
			this.setState({ products: json});

// console.log("loadProducts: result " + JSON.stringify(this.state.products))	;
		}).catch(error => {
			console.log("loadProducts error: " + error.message);
		});
	}

	addQuantityField (products){
		for (let i=0; i< products.length; i++){
			products[i].quantity = 0;
		}
		return (products);
	}

	loadCategories() {

		axios({
			method: 'get',
			url: serverinfo.url_categorylist(),
			auth: {
				username: authentication.username,
				password: authentication.password
			}
		}).then(response => response.data).then(json => {
			this.setState({ categories: json});

// console.log("loadCategories: result " + JSON.stringify(json))	;
		}).catch(error => {
			console.log("loadCategories error: " + error.message);
		});
	}

	applyListFilter(category){
		// console.log("applyListFilter=" + filter);
		this.refs.productslist.applyFilter(category);
	}

	openProduct(product) {
		const prodid = product.prodid;
		const path = `/product/${prodid}`;
		this.props.history.push(path);
	}

	updateProduct (prodobj, onSuccess, onError){
		var resp;
		var success = true;


        axios({
  			method: 'post',
			url: serverinfo.url_updateproduct(),
			data: prodobj,
			auth: {
    			username: authentication.username,
    			password: authentication.password
  			}
		})
       .then(response => {                       //Detect  http errors
        	if (response.status != 200){
        		this.refs.dialog.showAlert(response.statusText,'medium');
        		return (null);
        	}
//        	console.log(response);
        	return response;
        })
	  	.then(response => response.data)
        .then(responseMessage => {              //Detect app or db errors
//            console.log (responseMessage);
            if (responseMessage.status == 0){ //SUCCESS
           		this.loadProducts();
            	onSuccess();
              }
            else {
            	this.refs.dialog.showAlert(responseMessage.message, 'medium');
//            	onError();
            }
        })
		 .catch(error => {
			 console.log("updateProduct error: " + error.message);
			 this.refs.dialog.showAlert(error.message, 'medium');
		 });

        return success;
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
					<Col md={3} className="prodlist-search">
						<SelectCategory categories={this.state.categories} applyListFilter={this.applyListFilter}/>
					</Col>
					<Col md={9} className="prodlist-table">
						<ProductsList ref="productslist" products={this.state.products} categories={this.state.categories} deleteProduct={this.deleteProduct} updateProduct={this.updateProduct}/>
					</Col>
				</Row>
			</Grid>
			<Dialog ref='dialog'/>
		</div>);

	}
}
//Wrap into withRouter to have access to 'this.props.history'
export default withRouter(ProductsManage);





class SelectCategory extends React.Component {

	constructor(props) {
		super(props);
		this.categories = null;
	}

	componentDidMount() {

	}



	render() {
		if (! this.props.categories){
			return (<div />);
		}

		//Copy this.props.categories to categories using spead operator
		this.categories  = [...this.props.categories];

		if (this.categories[0].catid != 0){
			let allCategories = {catid: -1, descr: messages.allCategories};
			this.categories.splice(0, 0, allCategories);
		}
		const buttonStyleNormal = {
			width: "100%",
			margin: "5px"
		}
		const buttonStyleAllCategories = {
			width: "100%",
			margin: "5px",
			background: "Lavender"
		}

		console.log("render");

		return (
			<div>
			<h3 className="prodlist-search-criteria">{messages.categories}</h3>
			{this.categories.map((category, i) => (
			   <Button key={i}
			   	onClick={() => this.props.applyListFilter(category)}
				style={category.catid==-1 ? buttonStyleAllCategories: buttonStyleNormal}
				>
					{category.descr}
			   </Button>
			))}
			</div>
		);
	}

}
// active={category.catid==-1}

class ProductsList extends React.Component {
	constructor(props) {
		super(props);

		this.openAddProductForm = this.openAddProductForm.bind(this);
		this.openUpdProductForm = this.openUpdProductForm.bind(this);
		this.openDelProductForm = this.openDelProductForm.bind(this);
		this.onRowSelect = this.onRowSelect.bind(this);
		this.getSelectedProduct = this.getSelectedProduct.bind(this);
		this.remeasure = this.remeasure.bind(this);
		this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
		this.setSelectedProdid = this.setSelectedProdid.bind(this);
		this.isEditable= this.isEditable.bind(this);


		/* To dynamically change table height */
		this.state = {
			tableheight: "500px",
			filtered: true,
			title: messages.allCategories,
			dummy: true
		};

		this.selectedProdids = [];

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
		if (isSelected){
			row.quantity=1;
			row.selected = true;
		}
		else {
			row.quantity=0;
			row.selected = false;
		}
		this.setState({dummy: true});
	}

	getSelectedProduct() {

		for (let i = 0; i < this.props.products.length; i++) {
			if (this.props.products[i].prodid == this.selectedProdid) {
				return this.props.products[i];
			}
		}
		return (null);
	}

	setSelectedProdid(prodid) {
		this.selectedProdid = prodid;
	}

	applyFilter(category){
		// console.log("applyFilter=" + filter);

		if (category.catid > 0){
			this.refs.catid.applyFilter({number: category.catid, comparator: '='});
			this.setState({title: category.descr});
		}
		else {
			this.refs.catid.cleanFiltered();
			this.setState({title: category.descr});
			// this.setState({filtered: false});
		}
	}

	openAddProductForm() {

		// console.log("Opening product ADD ");

		var newProduct = Object.assign({}, ProductObject);
		this.refs.productForm.open(newProduct, "add");

	}

	openUpdProductForm() {
		if (this.selectedProdid == null)
			return;

		var product = this.getSelectedProduct();

		this.refs.productForm.open(product, "update");
	}

	openDelProductForm() {
		if (this.selectedProdid == null)
			return;

		var product = this.getSelectedProduct();

		let customBody = (<div>
			<div>
				{messages.deleteProductConfirmBody1}
			</div>
			<span className='text-primary'>
				<br/>
				{product.descr}
			</span>
			<div>
				<br />
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
					this.props.deleteProduct(product);
				})
			],
			bsSize: 'medium'
		});

		return;
	}

	onRowDoubleClick(row) {
		this.selectedProdid = row.prodid;
		this.openUpdProductForm();
	}



	isEditable (cell, row)  {
		return (row.selected ? 1 : 0);
    }

	render() {

		const selectRowProp = {
			mode: 'checkbox',
			clickToSelect: true, // you should enable clickToSelect, otherwise, you can't select column.
			onSelect: this.onRowSelect
		}

		const cellEditProp = {
  			mode: 'click',
			blurToSave: true,
		};

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
							<Button bsStyle="success" onClick={this.openAddProductForm} className="table-action-button" disabled={this.props.readonly}>{messages.action_add}</Button>
							<Button bsStyle="primary" onClick={this.openUpdProductForm} className="table-action-button">{messages.action_update}</Button>
							<Button bsStyle="danger" onClick={this.openDelProductForm} className="table-action-button" disabled={this.props.readonly}>{messages.action_delete}</Button>
						</ButtonGroup>
					</Col>
				</Row>
			</Grid>
			<BootstrapTable data={this.props.products} striped hover condensed height={this.state.tableheight} width='100%' ref="patTable" selectRow={selectRowProp} cellEdit={cellEditProp} options={options}>
				<TableHeaderColumn dataField="prodid" dataAlign='left' headerAlign='center' className="table-header" isKey={true} hidden>{messages.productProdid}</TableHeaderColumn>
				<TableHeaderColumn dataField="descr" editable={false} dataAlign='left' headerAlign='center' className="table-header" width="90%">{this.state.title}</TableHeaderColumn>
				<TableHeaderColumn dataField="quantity" ref="quantity" editable={this.isEditable}  dataAlign='center' headerAlign='center' className="table-header" width="7%">{messages.productQuantity}</TableHeaderColumn>
				<TableHeaderColumn dataField="catid" ref="catid" filter={{type: 'NumberFilter', delay: 100}} hidden/>
				<TableHeaderColumn dataField="selected"  width="3%"/>
			</BootstrapTable>

			<ProductForm ref='productForm' onModify={this.props.updateProduct} categories={this.props.categories}/>

			<Dialog ref='dialog'/>

		</div>);
	}
}

function isSelected(value, row) {
// console.log("eValidator returns:"  + row['selected'] );
	let ans;
	if (row['selected'] == true)
		return (1);
	else {
		return (0);
	}
  	return (ans);
}


function productsCompare(a, b) {
    // Use toUpperCase() to ignore character casing
    const prodA = a.descr.toUpperCase();
    const prodB = b.descr.toUpperCase();

    let comparison = 0;
    if (prodA > prodB) {
        comparison = 1;
    } else if (prodA < prodB) {
        comparison = -1;
    }
    return comparison;
}

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
import Image from 'react-bootstrap/lib/Image'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Dialog from 'react-bootstrap-dialog';

import {
	BrowserRouter as Router,
	withRouter,
	Route,
	Link,
	Prompt
} from "react-router-dom";

import '../styles/app.css';
import {messages} from "../js/messages";
import {serverinfo} from '../js/serverinfo';
import {authentication} from '../js/authentication';
// import {searchformObject} from '../model/searchformObject';
import {ProductObject} from '../model/ProductObject';
import {ShopitemObject} from '../model/ShopitemObject';
// import {getContentHeight} from "../js/utils";

import {getContentHeight, calcAge, isUserReadonly} from "../js/utils";
import * as dbapi from "../js/dbapi";

import {SearchTextFormControl} from './FormComponents';
import ProductForm from "./ProductForm";
import PopupDialog from "./PopupDialog";
import {printShoppingList} from "../print/printShoplist";

// import Patient from './Patient';

var moment = require('moment');
var dateFormat = "DD/MM/YYYY";

var axios = require('axios');

const modeShoplist = 1;
const modeEditProducts = 2;




class ProductsManage extends React.Component {

	constructor(props) {
		super(props);
		this.loadProducts = this.loadProducts.bind(this);
		this.loadCategories = this.loadCategories.bind(this);
		this.loadShopitems = this.loadShopitems.bind(this);
		this.deleteProduct = this.deleteProduct.bind(this);
		this.updateProduct = this.updateProduct.bind(this);
		this.applyListFilter = this.applyListFilter.bind(this);
		this.openProduct = this.openProduct.bind(this);
		this.addQuantityField = this.addQuantityField.bind(this);
		this.setPageTitle = this.setPageTitle.bind(this);
		this.findShopitemByProdid = this.findShopitemByProdid.bind(this);

		Dialog.setOptions({defaultOkLabel: messages.btnOK, defaultCancelLabel: messages.btnCancel, primaryClassName: 'btn-primary'})

		// this.searchform = null;
		this.state = {
			products: [],
			caregories: [],
			shopitems: [],
			title: messages.modeShoplist,
			dummy: true
		};

		this.selected=[];

	}

	componentDidMount() {
		this.refs.popupDialog.setOptions({
			title: messages.warning,
			confirmLabel: messages.btnOK,
			cancelLabel: messages.btnCancel
		});

		this.loadShopitems();
		this.loadCategories();
	}


	loadShopitems(){
		dbapi.loadShopitems( (data) => {
		   this.setState({ shopitems: data});
		   // console.log("shopitems=" + JSON.stringify(this.state.shopitems));
		   this.loadProducts();
		},(err) => {
		    console.log("loadShopitems error: " + err);
		});
	}

	loadProducts(){
		dbapi.loadProducts( (data) => {
			data.sort(productsCompare);
			// console.log("data=" + JSON.stringify(data));
			this.selected = [];
	        for (let i=0; i< data.length; i++){
				let shopitem = this.findShopitemByProdid (data[i].prodid);
				if (shopitem != null){
					data[i].selected = true;
					data[i].quantity = shopitem.quantity;
					this.selected.push(shopitem.prodid);
				}
				else {
					data[i].quantity = '0';
		            data[i].selected = false;
				}
	        }
		   this.setState({ products: data});	;
		   this.refs.productslist.loadSelected();
		},(err) => {
		    console.log("loadProducts error: " + err);
		});
	}

	loadCategories(){
		dbapi.loadCategories( (data) => {
			data.sort(categoriesCompare);
		   this.setState({ categories: data});	;
		},(err) => {
		    console.log("loadCategories error: " + err);
		});
	}

	findShopitemByProdid (prodid) {
		for (let i=0; i<this.state.shopitems.length; i++){
// console.log("looking for " + prodid + " in " + JSON.stringify(this.state.shopitems[i]));

			if (this.state.shopitems[i].prodid == prodid){
// console.log("Found!");
				return this.state.shopitems[i];
			}
		}
		return (null);
	}

	updateProduct (prodobj, onSuccess, onError){
		dbapi.updateProduct(prodobj, (data) => {
			this.loadShopitems();
			onSuccess();
			this.setState({dummy: true});
			// this.refs.productslist.unselectAll(false);
		},(error) => {
			this.refs.dialog.showAlert(error, 'medium');
		    console.log("updateProduct error: " + error);
		});
	}

	deleteProduct(prodobj) {
		dbapi.deleteProduct(prodobj, (data) => {
			this.loadProducts();
		},(error) => {
			this.refs.dialog.showAlert(error, 'medium');
		    console.log("deleteProduct error: " + error);
		});
	}




	addQuantityField (products){
		for (let i=0; i< products.length; i++){
			products[i].quantity = '0';
		}
		return (products);
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



	setPageTitle (title){
		this.setState({title: title});
	}



	render() {
		return (<div >
			<Grid className="prodlist-grid">
				<Row>
					<Col md={12}>
						<h3 className="page-title">{this.state.title}</h3>
					</Col>
				</Row>
				<Row className="prodlist-row">
					<Col md={3} className="prodlist-search">
						<SelectCategory categories={this.state.categories} applyListFilter={this.applyListFilter}/>
					</Col>
					<Col md={9} className="prodlist-table">
						<ProductsList ref="productslist" products={this.state.products} categories={this.state.categories} deleteProduct={this.deleteProduct}
						                                 loadShopitems={this.loadShopitems} updateProduct={this.updateProduct} selected={this.selected} setPageTitle={this.setPageTitle}/>
					</Col>
				</Row>
			</Grid>
			<Dialog ref='dialog'/>
			<PopupDialog ref='popupDialog'/>
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
		this.toggleMode = this.toggleMode.bind(this);
		this.unselectAll = this.unselectAll.bind(this);
		this.onSelectAll = this.onSelectAll.bind(this);
		this.saveSelected = this.saveSelected.bind(this);
		this.findProductById = this.findProductById.bind(this);
		this.loadSelected = this.loadSelected.bind(this);
		this.leaveOperation = this.leaveOperation.bind(this);
		this.intentToToggleMode = this.intentToToggleMode.bind(this);
		this.printList = this.printList.bind(this);
		this.intentToPrintList = this.intentToPrintList.bind(this);


		this.selected = [];


		/* To dynamically change table height */
		this.state = {
			tableheight: "500px",
			filtered: true,
			title: messages.allCategories,
			mode: modeShoplist,
			selected: this.selected,
			dummy: true,

		};


		this.selectRowProp = {
			mode: 'checkbox',
			clickToSelect: false, // you should enable clickToSelect, otherwise, you can't select column.
			onSelect: this.onRowSelect,
			selected: [],
			onSelectAll: this.onSelectAll,
		};


		this.selectedProdid = null;

		this.selectedChanged = false;

		this.filterCategory = null;

		this._isMounted = false;

		return;
	}

	componentDidMount() {
		/* To scroll to bottom automatically */
		// this.node = ReactDOM.findDOMNode(this.refs.expTable).childNodes[0].childNodes[1];

		this._isMounted = true;

		this.refs.popupDialog.setOptions({
			title: messages.warning,
			confirmLabel: messages.btnOK,
			cancelLabel: messages.btnCancel
		});

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
;
	}

	/* To dynamically change table height */
	remeasure() {
		// console.log("HEIGHT=" + getContentHeight() );
		if (this._isMounted) {
			let h = getContentHeight();
			this.setState({tableheight: h})
		}

	}

	loadSelected(){
		this.selected = this.props.selected;
		this.setState({selected: this.seleceted});
		this.selectedChanged = false;

	}

	intentToToggleMode (){
		if (this.selectedChanged == true){
			this.leaveOperation(
				() => {
					this.selectedChanged = false;
					this.toggleMode();
					// this.props.history.goBack(); //Return
				}
			);
		}
		else {
			this.toggleMode();
		}
	}

	toggleMode(){
// console.log("mode=" + this.state.mode);
		let newmode = (this.state.mode == modeShoplist) ? modeEditProducts : modeShoplist;

		let pageTitle;



		if (newmode ==  modeShoplist){
			this.props.loadShopitems();
			this.selectRowProp.mode = 'checkbox';
			this.selectRowProp.bgColor = null;
			this.selectRowProp.hideSelectColumn = false;
			this.selectRowProp.clickToSelect = false;

			// this.selectRowProp = this.selectRowPropShoplist;
			pageTitle = messages.modeShoplist;

		}
		else {  //modeEditProducts
			this.selectRowProp.mode = 'radio';
			this.selectRowProp.bgColor = 'pink'; // you should give a bgcolor, otherwise, you can't regonize which row has been selected
			this.selectRowProp.hideSelectColumn = true;  // enable hide selection column.
			this.selectRowProp.clickToSelect =true;  // you should enable clickToSelect, otherwise, you can't select column.
			// this.selectRowProp = this.selectRowPropEditProducts;

			pageTitle = messages.modeEditProducts;
		}

		this.props.setPageTitle(pageTitle);
		this.unselectAll(false); //Unselect without updating selectedChanged flag, to be able to toggle mode
		// this.selectedChanged = false;
		// this.saveSelected();
		this.setState({mode: newmode});

	}

	onRowSelect(row, isSelected, e) {
		if (this.state.mode == modeShoplist){
			if (isSelected){
				row.quantity='1';
				row.selected = true;
				if (this.selected.indexOf(row.prodid) == -1){
					this.selected.push(row.prodid);
				}
			}
			else {
				row.quantity='0';
				row.selected = false;
				let index = this.selected.indexOf(row.prodid);
				if (index != -1){
					this.selected.splice(index, 1);
				}

			}
			this.setState({selected: this.selected});
			this.selectedChanged = true;
		}
		else {
			if (isSelected)
			  this.selectedProdid = row.prodid;
			else
			  this.selectedProdid = null;
// console.log("this.selectedProdid=" + this.selectedProdid);
		}
	}

	onSelectAll(isSelected, rows){

		this.selected = [];

		for (let i=0; i < rows.length; i++){
			if (isSelected){  //action: selectAll
				this.selected.push(rows[i].prodid);
				if (rows[i].quantity == '0'){
					rows[i].quantity = '1';
				}
			}
			else {  //action: unselectAll
				rows[i].quantity = '0';
			}
		}
		// if (isSelected){
		// }
		// else {
		//
		// }
		this.setState({selected: this.selected});
		this.selectedChanged = true;

	}

	unselectAll (updateSelectedChangedFlag){
		for (let i=0; i < this.props.products.length; i++){
			this.props.products[i].quantity = '0';
		}
		this.selected = [];
		this.setState({selected: this.selected});

		if (updateSelectedChangedFlag == true || updateSelectedChangedFlag == undefined){
			this.selectedChanged = true;
		}
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
			this.filterCategory = category;
			this.refs.catid.applyFilter({number: category.catid, comparator: '='});
			this.setState({title: category.descr});
		}
		else {
			this.filterCategory = null;
			this.refs.catid.cleanFiltered();
			this.setState({title: category.descr});
			// this.setState({filtered: false});
		}
	}

	openAddProductForm() {

		// console.log("Opening product ADD ");

		let newProduct = Object.assign({}, ProductObject);
		if (this.filterCategory != null){
			newProduct.catid = this.filterCategory.catid;
		}
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
				Dialog.CancelAction(),
				Dialog.OKAction(() => {
					this.props.deleteProduct(product);
				})
			],
			bsSize: 'medium'
		});

		return;
	}

	saveSelected(callback){
		// Delete all before adding
		dbapi.deleteAllShopitems( (data) => {
		},(error) => {
			this.refs.dialog.showAlert(error, 'medium');
			console.log("addShopitemList error: " + error);
		});

		if (this.selected.length == 0){
			this.selectedChanged = false;
			return;
		}

		let shopitemList = [];

		for (let i=0; i<this.selected.length; i++){
			let prodobj = this.findProductById(this.selected[i]);
			if (prodobj == null){
				continue;
			}
			let shopitem = Object.assign({}, ShopitemObject);
			shopitem.itemid = null;
			shopitem.prodid = prodobj.prodid;
			shopitem.quantity = prodobj.quantity;

			shopitemList.push(shopitem);
		}

		// this.props.addShopitemList(shopitemList);
		dbapi.addShopitemList(shopitemList, (data) => {
			// this.loadProducts();
			// onSuccess();
			if(callback){
				callback();
			}
			this.selectedChanged = false;
		},(error) => {
			this.refs.dialog.showAlert(error, 'medium');
			console.log("addShopitemList error: " + error);
		});

	}

	findProductById(id) {
		for (let i=0; i<this.props.products.length; i++){
			if (this.props.products[i].prodid === id){
				return this.props.products[i];
			}
		}
		return (null);
	}



	onRowDoubleClick(row) {
		this.selectedProdid = row.prodid;
		this.openUpdProductForm();
	}



	isEditable (cell, row)  {
		return (row.selected ? 1 : 0);
    }

	//leave page confirmation and action trigger
	leaveOperation (ok, cancel){

		this.refs.popupDialog.show ({
			message: messages.notsavedWarning,
			callback: ((result) => {
									if (result == true) {
				 						ok();
									}
									else {
										cancel();
									}})
		});
	}

	intentToPrintList(){
		if (this.selectedChanged == true ){ //needs save first
			this.saveSelected(this.printList);
		}
		else {
			this.printList();
		}

	}

	printList(){
		// console.log("Printing..");
		dbapi.loadShopitemPrintList( (data) => {
		   printShoppingList(data);
		},(err) => {
		    console.log("loadShopitemPrintList error: " + err);
		});


	}

	render() {


		const cellEditProp = {
  			mode: 'click',
			blurToSave: true,
		};

		const options = {
			noDataText: messages.listEmpty,
			// onRowDoubleClick: this.onRowDoubleClick
		};

		if (this.state.mode == modeShoplist){
			this.selectRowProp.selected = this.selected;   //In shoplist mode, all selections visible
		}
		else {
			this.selectRowProp.selected = [this.selectedProdid]; // In edit mode, one selection only
		}

// console.log("rows=" + JSON.stringify(this.props.products));
// console.log ("selected=" + this.selected);
// console.log ("this.selectRowProp.selected=" + this.selectRowProp.selected);


		return (<div>
			{/* Prompt is used to prevent changing of page when data are not saved */}
			{/* See UserConfirmation component declared in index.js */}
			< Prompt
				when = {
				    this.selectedChanged == true
				}
				message = {
				    JSON.stringify({
				        "title": messages.warning,
						"messageText": messages.notsavedWarning,
				        "confirmText": messages.yes,
				        "cancelText": messages.no,
				    })
				}
			/>

			<Grid style={{
					width: '100%',marginRight:"0px",paddingRight:"0px"
				}}>
				<Row style={{width: '100%',marginRight:"0px",paddingRight:"0px"}}>
					<Col md={5}>
						<ButtonGroup bsClass="modeEditProducts-button-group" hidden={this.state.mode==modeEditProducts ? false : true}>
							<Button bsStyle="success" onClick={this.openAddProductForm} className="table-action-button" >{messages.action_add}</Button>
							<Button bsStyle="primary" onClick={this.openUpdProductForm} className="table-action-button">{messages.action_update}</Button>
							<Button bsStyle="danger" onClick={this.openDelProductForm} className="table-action-button" >{messages.action_delete}</Button>
						</ButtonGroup>
						<ButtonGroup bsClass="shoplist-button-group" hidden={this.state.mode==modeShoplist ? false : true}>
							<Button bsStyle="primary" onClick={this.saveSelected} className="table-action-button">{messages.btnSave}</Button>
							<Button bsStyle="danger" onClick={this.unselectAll} className="table-action-button">{messages.btnClear}</Button>
							<Button bsStyle="info" onClick={this.intentToPrintList} className="table-action-button"> {messages.btnPrint}</Button>
						</ButtonGroup>
					</Col>
					<Col md={1}>
					</Col>
					<Col md={3} style={{flexDirection: "column", display: "flex", alignItems: "flexCenter"}}>
						<span >
							<Image src="../styles/img/shopping32.png"  />
							<span style={{marginLeft:"5px", color:"blue"}}>
								{this.selected.length}
							</span>
						</span>
					</Col>
					<Col md={1}>
					</Col>
					<Col md={2} style={{marginRight:"0px",paddingRight:"0px", flexDirection: "column", display: "flex", alignItems: "flexEnd"}}>
						<Button bsStyle="default" className="changemode-table-action-button" onClick={this.intentToToggleMode} >
							{this.state.mode==modeEditProducts ? messages.modeShoplist : messages.modeEditProducts}
						</Button>
					</Col>
				</Row>
				</Grid>
			<BootstrapTable data={this.props.products} striped hover condensed height={this.state.tableheight}
			              width='100%' ref="patTable" selectRow={this.selectRowProp} cellEdit={this.state.mode==modeShoplist ? cellEditProp : false} options={options}>
				<TableHeaderColumn dataField="prodid" dataAlign='left' headerAlign='center' className="table-header" isKey={true} hidden>{messages.productProdid}</TableHeaderColumn>
				<TableHeaderColumn dataField="descr" editable={false} dataAlign='left' headerAlign='center' className="table-header" width="90%">{this.state.title}</TableHeaderColumn>
				<TableHeaderColumn dataField="quantity" ref="quantity" editable={this.isEditable}  dataAlign='center'  headerAlign='center'
				                   className="table-header" width="10%" hidden={this.state.mode==modeShoplist ? false : true}>{messages.productQuantity}</TableHeaderColumn>
				<TableHeaderColumn dataField="catid" ref="catid" filter={{type: 'NumberFilter', delay: 100}} hidden/>
				<TableHeaderColumn dataField="selected"   hidden/>
			</BootstrapTable>

			<ProductForm ref='productForm' onModify={this.props.updateProduct} categories={this.props.categories}/>

			<Dialog ref='dialog'/>
			<PopupDialog ref="popupDialog" />

		</div>);
	}
	// <div style={{"width":"100%","flex-direction": "column", "display": "flex", "align-items": "flex-end"}}></div>

}
//Wrap into withRouter to have access to 'this.props.history'
withRouter(ProductsList);


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

function categoriesCompare(a, b) {
    // Use toUpperCase() to ignore character casing
    const catA = a.descr.toUpperCase();
    const catB = b.descr.toUpperCase();

    let comparison = 0;
    if (catA > catB) {
        comparison = 1;
    } else if (catA < catB) {
        comparison = -1;
    }
    return comparison;
}

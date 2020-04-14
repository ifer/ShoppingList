/**
* ProductForm.js
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

import Dialog from 'react-bootstrap-dialog';

import '../styles/app.css';

import {messages} from "../js/messages";


export default class ProductForm  extends React.Component {

	constructor(props) {
		super(props);
		this.submit = this.submit.bind(this);
		this.open = this.open.bind(this);
		this.cancel = this.cancel.bind(this);
		this.addSuccess = this.addSuccess.bind(this);
		this.addError = this.addError.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.getFormValidationState = this.getFormValidationState.bind(this);
		this.handleCategory = this.handleCategory.bind(this);

		this.prodobj = null;
		this.state = {showProductForm: false,
					  prodobj: this.prodobj
				 	};

		Dialog.setOptions({
			  defaultOkLabel: messages.btnOK,
			  defaultCancelLabel: messages.btnCancel,
			  primaryClassName: 'btn-primary'
		});

        this.mode = null;



	}

	componentDidMount() {
//		this.initExpenseObject ();
	}


	cancel() {
		this.setState({ showProductForm: false });
	}

	open(prodobj, mode) {
		this.prodobj = prodobj;

	    this.setState({ showProductForm: true
	    			});
//		this.setState({sharemethod: this.findShareMethod(this.prodobj.expensetype)});
        this.mode = mode;
	}

	submit () {
		if (this.getFormValidationState() == 'error'){
			return;
		}


		this.props.onModify(this.prodobj, this.addSuccess, this.addError);
	}

	addSuccess (){
		this.setState({ showProductForm: false });
	}

	addError (){
		return;
	}



	handleInputChange(event) {
	    const target = event.target;

	    let value = target.value;;
	    const name = target.name;

	    this.prodobj[name] = value;

	    this.setState(() => ({       //Necessary for validation functions to work
			prodobj: this.prodobj
		}));

        // console.log("prodobj=" + JSON.stringify(this.prodobj));
//	    console.log (name +": " + this.prodobj[name]);
	}


    handleCategory (event) {
		const target = event.target;
		this.prodobj.catid = target.value;

	    this.setState(() => ({
			prodobj: this.prodobj
		}));

	// console.log ("Category Id: " + this.prodobj["catid"]);
    // console.log("prodobj=" + JSON.stringify(this.prodobj));
	}



	getFormValidationState (){
		let fldlist = '';


		if (this.prodobj.descr == null || this.prodobj.descr == ''){
			fldlist = (fldlist == '') ? messages.productDescr : fldlist + ', ' + messages.productDescr;
		}
		if (this.prodobj.catid == null || this.prodobj.catid == ''){
			fldlist = (fldlist == '') ? messages.productCategory : fldlist + ', ' + messages.productCategory;
		}

		if (fldlist != ''){
			let msg = messages.formError.replace ("%f", fldlist );
			this.refs.dialog.showAlert(msg,'medium');
			return 'error';
		}

		return ('success');
	}







	render() {
		if (this.prodobj == null )
			return <div />;

		let categories = [];

        if (this.mode === "add"){
    		let emptyOption = <option key={0} value={null}>{}</option>;
    		categories.push (emptyOption);
        }

        for (let i=0; i< this.props.categories.length; i++){
			let option = <option key={this.props.categories[i].catid} value={this.props.categories[i].catid}>{this.props.categories[i].descr}</option>;
			categories.push(option);
		}

		return (
	      <div>
	        <Modal show={this.state.showProductForm} onHide={this.cancel} keyboard={true}  dialogClassName="">
	          <Modal.Header closeButton >
	            <Modal.Title>{messages.productFormTitle}</Modal.Title>
	          </Modal.Header>
	          <Modal.Body>
		       <Form horizontal>

	     	   <FormGroup controlId="descr"   >
	     		<Col componentClass={ControlLabel} sm={2}>
	     			{messages.productDescr}
	     		</Col>
	           <Col sm={10}>
	             	<FormControl name="descr" type="text" value={this.prodobj.descr} onChange={this.handleInputChange} />
	           </Col>
	          </FormGroup>

  		      <FormGroup controlId="categ">
				<Col componentClass={ControlLabel} sm={2}>
					{messages.productCategory}
				</Col>
			    <Col sm={8}>
			        <FormControl componentClass="select" name="category" value={ this.prodobj.catid || ''}  onChange={this.handleCategory}>
			        	{categories}
			        </FormControl>
		        </Col>
		      </FormGroup>


		      </Form>
		      </Modal.Body>
	          <Modal.Footer>
	            <Button onClick={this.submit}>{messages.btnOK}</Button>
	            <Button onClick={this.cancel}>{messages.btnCancel}</Button>
	          </Modal.Footer>
	        </Modal>

	        <Dialog ref='dialog' />

	      </div>
	    );
	  }


}

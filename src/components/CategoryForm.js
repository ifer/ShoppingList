/**
* CategoryForm.js
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


export default class CategoryForm  extends React.Component {

	constructor(props) {
		super(props);
		this.submit = this.submit.bind(this);
		this.open = this.open.bind(this);
		this.cancel = this.cancel.bind(this);
		this.addSuccess = this.addSuccess.bind(this);
		this.addError = this.addError.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.getFormValidationState = this.getFormValidationState.bind(this);

		this.categobj = null;
		this.state = {showCategoryForm: false,
					  categobj: this.categobj
				 	};

		Dialog.setOptions({
			  defaultOkLabel: messages.btnOK,
			  defaultCancelLabel: messages.btnCancel,
			  primaryClassName: 'btn-primary'
		})

	}

    componentDidMount() {
//		this.initExpenseObject ();
	}


	cancel() {
		this.setState({ showCategoryForm: false });
	}

	open(categobj) {
		this.categobj = categobj;

	    this.setState({ showCategoryForm: true
	    			});
//		this.setState({sharemethod: this.findShareMethod(this.categobj.expensetype)});

	}

	submit () {
		if (this.getFormValidationState() == 'error'){
			return;
		}
//		if (this.getArbitraryShareValidationState() == 'error'){
//			return;
//		}

		this.props.onModify(this.categobj, this.addSuccess, this.addError);
	}

	addSuccess (){
		this.setState({ showCategoryForm: false });
	}

	addError (){
		return;
	}



	handleInputChange(event) {
	    const target = event.target;

	    let value = target.value;;
	    const name = target.name;

	    this.categobj[name] = value;

	    this.setState(() => ({       //Necessary for validation functions to work
			categobj: this.categobj
		}));

//	    console.log (name +": " + this.categobj[name]);
	}





	getFormValidationState (){
		let fldlist = '';


		if (this.categobj.descr == null || this.categobj.descr == ''){
			fldlist = (fldlist == '') ? messages.categDescr : fldlist + ', ' + messages.categDescr;
		}

		if (fldlist != ''){
			let msg = messages.formError.replace ("%f", fldlist );
			this.refs.dialog.showAlert(msg,'medium');
			return 'error';
		}

		return ('success');
	}




	render() {
		if (this.categobj == null )
			return <div />;


		return (
	      <div>
	        <Modal show={this.state.showCategoryForm} onHide={this.cancel} keyboard={true}  dialogClassName="">
	          <Modal.Header closeButton >
	            <Modal.Title>{messages.categories}</Modal.Title>
	          </Modal.Header>
	          <Modal.Body>
		       <Form horizontal>

	     	   <FormGroup controlId="descr"   >
	     		<Col componentClass={ControlLabel} sm={4}>
	     			{messages.categDescr}
	     		</Col>
	           <Col sm={8}>
	             	<FormControl name="descr" type="text" value={this.categobj.descr} onChange={this.handleInputChange} />
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

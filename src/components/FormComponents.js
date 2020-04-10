import React from "react";
import ReactDOM from 'react-dom';

import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import ControlLabel from "react-bootstrap/ControlLabel";
import Col from "react-bootstrap/Col";
import Checkbox from "react-bootstrap/Checkbox";
import Grid from "react-bootstrap/Grid";
import Row from "react-bootstrap/Row";

var DatePicker = require("react-bootstrap-date-picker");
var dateFormat = "DD/MM/YYYY";

import { messages } from "../js/messages";

class TextFormGroup extends React.Component  {
	constructor(props) {
		super(props);
		this.focusTextInput = this.focusTextInput.bind(this);
		this.clearTextInput = this.clearTextInput.bind(this);
	}

	focusTextInput (){
		let node = ReactDOM.findDOMNode(this.refs.refFormControl);
        if (node && node.focus instanceof Function) {
            node.focus();
        }
	}

	clearTextInput (){
		let node = ReactDOM.findDOMNode(this.refs.refFormControl);
        if (node && node.focus instanceof Function) {
            node.value = "";
        }
	}

	render()  {
		// console.log ("name=" + this.props.name + " disabled=" + this.props.disabled);
		return (
			<Col md={4}>
				<FormGroup controlId={this.props.name} className="formFormgroup" validationState={this.props.validationState}>
					<Col componentClass={ControlLabel} md={4} className="formLabel">
						{this.props.label}
					</Col>
					<Col md={8}>
						<FormControl
							name={this.props.name}
							type='text'
							defaultValue={this.props.defaultValue}
							value={this.props.value || ''}
							onChange={this.props.onChange}
							className="formTextbox"
							disabled={this.props.disabled}
							placeholder={this.props.placeholder}
							ref="refFormControl"
						/>
					</Col>
				</FormGroup>
			</Col>
		);
	}
}



class DisplayTextFormGroup extends React.Component  {
	render()  {
		return (
			<Col md={4}>
				<FormGroup controlId={this.props.name} className="formFormgroup">
					<Col componentClass={ControlLabel} md={4} className="formLabel">
						{this.props.label}
					</Col>
					<Col md={8}>
						<div className='formDisplayField'>{this.props.value  || ''}</div>
					</Col>
				</FormGroup>
			</Col>
		);
	}
}

class NumericFormGroup extends React.Component  {
	constructor(props) {
		super(props);
		this.focusTextInput = this.focusTextInput.bind(this);
	}

	focusTextInput (){
		let node = ReactDOM.findDOMNode(this.refs.refFormControl);
        if (node && node.focus instanceof Function) {
            node.focus();
        }
	}

	render()  {
		return (
			<Col md={4}>
				<FormGroup controlId={this.props.name} className="formFormgroup" validationState={this.props.validationState}>
					<Col componentClass={ControlLabel} md={4} className="formLabel">
						{this.props.label}
					</Col>
					<Col md={8}>
						<FormControl
							name={this.props.name}
							type='text'
							defaultValue={this.props.defaultValue}
							value={this.props.value}
							onChange={this.props.onChange}
							className="formTextbox"
							disabled={this.props.disabled}
							placeholder={this.props.placeholder}
							ref="refFormControl"
						/>
					</Col>
				</FormGroup>
			</Col>
		);
	}
}

class CheckboxFormGroup extends React.Component  {
	render()  {
		return (
			<Col md={4}>
				<FormGroup controlId={this.props.name} className="formFormgroup">
				<Col componentClass={ControlLabel} md={4} className="formLabel" >
					{this.props.label}
				</Col>
				<Col md={8}>
					<Checkbox
						name={this.props.name}
						title={this.props.label}
						onChange={this.props.onChange}
						defaultChecked={this.props.defaultChecked}
						checked={this.props.checked}
						disabled={this.props.disabled}
						className="formCheckbox"

					>
						{/*} {this.props.label}*/}
					</Checkbox>

				</Col>
				</FormGroup>
			</Col>
		);
	}
}

class SelectFormGroup extends React.Component  {
	constructor(props) {
		super(props);
		this.focusTextInput = this.focusTextInput.bind(this);
	}

	focusTextInput (){
		let node = ReactDOM.findDOMNode(this.refs.refFormControl);
        if (node && node.focus instanceof Function) {
            node.focus();
        }
	}

	render()  {
		let options = [];

		for (let i = 0; i < this.props.lookup.length; i++) {
			let option = (
				<option key={i} value={i}>
					{this.props.lookup[i]}
				</option>
			);
			options.push(option);
		}

		return (
			<Col md={4}>
				<FormGroup controlId={this.props.name} className="formFormgroup" validationState={this.props.validationState}>
					<Col componentClass={ControlLabel} sm={4} className="formLabel">
						{this.props.label}
					</Col>
					<Col md={8}>
						<FormControl
							componentClass="select"
							name={this.props.name}
							value={this.props.value || ''}
							onChange={this.props.onChange}
							className="formSelect"
							disabled={this.props.disabled}
							placeholder={this.props.placeholder}
							ref="refFormControl"
						>
							{options}
						</FormControl>
					</Col>
				</FormGroup>
			</Col>
		);
	}
}

class DateFormGroup extends React.Component  {
	render()  {
		return (
			<Col md={4}>
				<FormGroup controlId={this.props.name} className="formFormgroup">
					<Col componentClass={ControlLabel} sm={4} className="formLabel">
						{this.props.label}
					</Col>

					<Col md={8}>
						<DatePicker
							value={this.props.value}
							onChange={this.props.onChange}
							dateFormat={dateFormat}
							dayLabels={messages.daynames}
							monthLabels={messages.monthnames}
							placeholder={messages.dateformat_gr}
							validationState={this.props.validationState}

					/>
					</Col>
				</FormGroup>
			</Col>
		);
	}
}


class TextareaFormGroup extends React.Component  {
	constructor(props) {
		super(props);
		this.focusTextInput = this.focusTextInput.bind(this);
	}

	focusTextInput (){
		let node = ReactDOM.findDOMNode(this.refs.refFormControl);
        if (node && node.focus instanceof Function) {
            node.focus();
        }
	}

	render()  {
		return (
			<Col md={4}>
				<FormGroup controlId={this.props.name} className="formFormgroup" validationState={this.props.validationState}>
					<Col componentClass={ControlLabel} md={4} className="formLabel">
						{this.props.label}
					</Col>
					<Col md={8}>
						<FormControl
							name={this.props.name}
							componentClass="textarea"
							defaultValue={this.props.defaultValue}
							value={this.props.value || ''}
							onChange={this.props.onChange}
							className="formTextbox"
							placeholder={this.props.placeholder}
							disabled={this.props.disabled}
							ref="refFormControl"
						/>
					</Col>
				</FormGroup>
			</Col>
		);
	}
}

class BigTextareaFormGroup extends React.Component  {
	constructor(props) {
		super(props);
		this.focusTextInput = this.focusTextInput.bind(this);
	}

	focusTextInput (){
		let node = ReactDOM.findDOMNode(this.refs.refFormControl);
        if (node && node.focus instanceof Function) {
            node.focus();
        }
	}

	render()  {
		let mdTotal = 4 * this.props.gridcols;
		var textareaStyle = {
	    	'width': '107%'
		};
		var labelStyle = {
	    	'width': '11%'
		};

		return (
			<Col md={mdTotal}>
				<FormGroup controlId="labelx" className="formFormgroup" validationState={this.props.validationState}>
					<Col
						componentClass={ControlLabel}
						md={2}
						className="formLabel"
						style={labelStyle}
					>
						{this.props.label}
					</Col>
					<Col md={10}>
						<FormControl
							name={this.props.name}
							componentClass="textarea"
							defaultValue={this.props.defaultValue}
							value={this.props.value || ''}
							onChange={this.props.onChange}
							className="formTextbox"
							style={textareaStyle}
							disabled={this.props.disabled}
							placeholder={this.props.placeholder}
							ref="refFormControl"
					/>
					</Col>
				</FormGroup>
			</Col>
		);
	}

}

class FillerFormGroup extends React.Component  {
	render()  {
		return (
			<Col md={4}>
				<FormGroup controlId='filler' className="formFormgroup">
					<Col componentClass={ControlLabel} md={4} className="formLabel">

					</Col>
					<Col md={8}>
						<div className='formFiller'></div>
					</Col>
				</FormGroup>
			</Col>
		);
	}
}



class SearchTextFormControl extends React.Component  {
	constructor(props) {
		super(props);
		this.focusTextInput = this.focusTextInput.bind(this);
		this.clearTextInput = this.clearTextInput.bind(this);

	}



	focusTextInput (){
		let node = ReactDOM.findDOMNode(this.refs["refFc" + this.props.name]);
        if (node && node.focus instanceof Function) {
            node.focus();
        }
	}

	clearTextInput (){
		let node = ReactDOM.findDOMNode(this.refs["refFc" + this.props.name]);
        if (node && node.focus instanceof Function) {
            node.value = "";
        }
	}

	render()  {


		return (
			<Col md={12}>
				<FormGroup controlId={this.props.name} className="formFormgroup" >
					<FormControl
						name={this.props.name}
						type='text'
						value={this.props.initialValue}
						onChange={this.props.onChange}
						placeholder={this.props.placeholder}
						ref={"refFc" + this.props.name}
						/>
				</FormGroup>
			</Col>
		);
	}
}

export {
	TextFormGroup,
	DisplayTextFormGroup,
	CheckboxFormGroup,
	SelectFormGroup,
	DateFormGroup,
	TextareaFormGroup,
	BigTextareaFormGroup,
	SearchTextFormControl,
	FillerFormGroup,
	NumericFormGroup
};

/**
 * Categories.js
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Grid from 'react-bootstrap/lib/Grid';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Table from 'react-bootstrap/lib/Table';
import Label from 'react-bootstrap/lib/Label';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Dialog from 'react-bootstrap-dialog';

import CategoryForm from './CategoryForm';
import { CategoryObject } from '../model/CategoryObject';
import { getContentHeight } from '../js/utils';

import '../styles/app.css';

import { messages } from '../js/messages';
import { serverinfo } from '../js/serverinfo';
import { authentication } from '../js/authentication';
import * as dbapi from '../js/dbapi';

var axios = require('axios');

export default class Categories extends React.Component {
    constructor(props) {
        super(props);

        this.loadCategories = this.loadCategories.bind(this);
        this.updateCategory = this.updateCategory.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);
        this.openAddCategoryForm = this.openAddCategoryForm.bind(this);
        this.openUpdCategoryForm = this.openUpdCategoryForm.bind(this);
        this.openDelCategoryForm = this.openDelCategoryForm.bind(this);
        this.onRowSelect = this.onRowSelect.bind(this);
        this.initCategoryobject = this.initCategoryobject.bind(this);
        this.fillCategoryobject = this.fillCategoryobject.bind(this);
        this.getSelectedCategory = this.getSelectedCategory.bind(this);

        // this.remeasure = this.remeasure.bind(this);

        this.selectRowProp = {
            mode: 'radio',
            bgColor: 'pink', // you should give a bgcolor, otherwise, you can't regonize which row has been selected
            hideSelectColumn: true, // enable hide selection column.
            clickToSelect: true, // you should enable clickToSelect, otherwise, you can't select column.
            onSelect: this.onRowSelect,
        };

        this._isMounted = false;
        this.categoryobj = null;
        this.selectedCatid = null;
        this.state = {
            categories: [],
            tableheight: '500px' /* To dynamically change table height */,
            categoryobj: this.categoryobj,
        };
    }

    async componentDidMount() {
        /* To dynamically change table height */
        let h = getContentHeight();
        this.setState({ tableheight: h });
        // window.addEventListener('resize', this.remeasure);

        this._isMounted = true;

        this.loadCategories();
    }

    async loadCategories() {
        let data;
        try {
            data = await dbapi.loadCategories();
            data.sort(categoriesCompare);
            this.setState({ categories: data });
        } catch (error) {
            this.refs.dialog.showAlert(error, 'medium');
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    // remeasure() {
    //     //		console.log("HEIGHT=" + getContentHeight() );
    //     if (this._isMounted) {
    //         let h = getContentHeight();
    //         this.setState({ tableheight: h });
    //     }
    // }

    async updateCategory(categoryobj, closeForm) {
        let resp;
        try {
            resp = await dbapi.updateCategory(categoryobj);
            this.loadCategories();
            closeForm();
            this.setState({ dummy: true });
        } catch (error) {
            this.refs.dialog.showAlert(error, 'medium');
            console.log('updateProduct error: ' + error);
        }
    }

    async deleteCategory(catid) {
        let resp;
        try {
            resp = await dbapi.deleteCategory(catid);
            this.loadCategories();
        } catch (error) {
            this.refs.dialog.showAlert(error, 'medium');
            console.log('deleteCategory error: ' + error);
        }
    }

    initCategoryobject() {
        this.categoryobj = Object.assign({}, CategoryObject);
    }

    fillCategoryobject(s) {
        this.categoryobj = {
            catid: s.catid,
            descr: s.descr,
        };
    }

    openAddCategoryForm() {
        this.initCategoryobject();
        this.refs.CategoryForm.open(this.categoryobj);
    }

    openUpdCategoryForm() {
        if (this.selectedCatid == null) return;

        this.categoryobj = this.getSelectedCategory();
        // this.fillCategoryobject (curCategory);
        this.refs.CategoryForm.open(this.categoryobj);
    }

    getSelectedCategory() {
        for (let i = 0; i < this.state.categories.length; i++) {
            if (this.state.categories[i].catid == this.selectedCatid) {
                return this.state.categories[i];
            }
        }
        return null;
    }

    openDelCategoryForm() {
        if (this.selectedCatid == null) return;

        let curCategory = this.getSelectedCategory();

        let customBody = (
            <div>
                <div>{messages.deleteCategoryConfirmBody1}</div>
                <span className="text-primary">{curCategory.descr}</span>
                <div>
                    <p> </p>{' '}
                </div>
                <div>{messages.deleteCategoryConfirmBody2}</div>
            </div>
        );

        this.refs.dialog.show({
            title: messages.deleteCategoryConfirmTitle,
            body: customBody,
            actions: [
                Dialog.CancelAction(),
                Dialog.OKAction(() => {
                    this.deleteCategory(curCategory);
                }),
            ],
            bsSize: 'medium',
        });

        return;
    }

    onRowSelect(row, isSelected, e) {
        if (isSelected) this.selectedCatid = row.catid;
        else this.selectedCatid = null;

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

        //		let Categoryrows = [];
        //		for (let i=0; i<this.state.Categories.length; i++){
        //			var Category = {
        //				catid: this.state.Categories[i].catid,
        //				descr: this.state.Categories[i].descr,
        //				sharemethod:
        //			};
        //			Categoryrows.push(Category);
        //		}

        return (
            <div>
                <Grid style={{ width: '100%' }}>
                    <Row>
                        <Col md={7}>
                            <h3 className="page-title">{messages.categoriesManage}</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <ButtonGroup bsClass="expenses-button-group">
                                <Button
                                    bsStyle="success"
                                    onClick={this.openAddCategoryForm}
                                    className="table-action-button"
                                >
                                    {messages.action_add}
                                </Button>
                                <Button
                                    bsStyle="info"
                                    onClick={this.openUpdCategoryForm}
                                    className="table-action-button"
                                >
                                    {messages.action_update}
                                </Button>
                                <Button
                                    bsStyle="danger"
                                    onClick={this.openDelCategoryForm}
                                    className="table-action-button"
                                >
                                    {messages.action_delete}
                                </Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                </Grid>
                <div className="categories-table">
                    <BootstrapTable
                        data={this.state.categories}
                        options={options}
                        striped
                        hover
                        condensed
                        height={this.state.tableheight}
                        ref="CategoryTable"
                        selectRow={this.selectRowProp}
                    >
                        <TableHeaderColumn dataField="catid" defaultValue="0" hidden isKey>
                            {messages.CategoryId}
                        </TableHeaderColumn>
                        <TableHeaderColumn dataField="descr" width="50%">
                            {messages.categoryDescr}
                        </TableHeaderColumn>
                    </BootstrapTable>
                </div>
                <CategoryForm
                    ref="CategoryForm"
                    onModify={this.updateCategory}
                    sharemethods={this.state.sharemethods}
                />
                <Dialog ref="dialog" />
            </div>
        );
    }
}

function sharemethodFormatter(cell) {
    let s = messages['method_' + cell];
    return s;
}

export function categoriesCompare(a, b) {
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

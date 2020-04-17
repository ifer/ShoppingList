import {messages} from "./messages";
import {serverinfo} from './serverinfo';
import {authentication} from '../js/authentication';

var axios = require('axios');



function loadProducts(callback, errorcallback) {

    // this.searchform = sf;
    // this.saveSearchForm (sf);
// url: serverinfo.url_productlist(),
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
            json[i].quantity = '0';
            json[i].selected = false;
        }
        callback(json);
// console.log("loadProducts: result " + JSON.stringify(this.state.products))	;
    }).catch(error => {
        errorcallback(error.message);
        // console.log("loadProducts error: " + error.message);
    });
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

export {loadProducts};

import { messages } from './messages';
import { serverinfo } from './serverinfo';
import { authentication } from '../js/authentication';

var axios = require('axios');

async function loadProducts(callback, errorcallback) {
    try {
        const response = await axios({ method: 'get', url: serverinfo.url_productlist() });
        const data = response.data;
        callback(data);
        console.log('loadProducts: result ' + JSON.stringify(data));
    } catch (error) {
        errorcallback(error.message);
        console.log('loadProducts error: ' + error.message);
    }
}

function loadProducts0(callback, errorcallback) {
    // this.searchform = sf;
    // this.saveSearchForm (sf);
    // url: serverinfo.url_productlist(),
    console.log('Loading products...');
    axios({
        method: 'get',
        url: serverinfo.url_productlist(),
    })
        .then((response) => response.data)
        .then((json) => {
            callback(json);
            // console.log('loadProducts: result ' + JSON.stringify(this.state.products));
        })
        .catch((error) => {
            errorcallback(error.message);
            console.log('loadProducts error: ' + error.message);
        });
}

function loadCategories(callback, errorcallback) {
    axios({
        method: 'get',
        url: serverinfo.url_categorylist(),
    })
        .then((response) => response.data)
        .then((json) => {
            callback(json);

            // console.log("loadCategories: result " + JSON.stringify(json))	;
        })
        .catch((error) => {
            errorcallback(error.message);
            // console.log("loadCategories error: " + error.message);
        });
}

function loadShopitems(callback, errorcallback) {
    axios({
        method: 'get',
        url: serverinfo.url_shopitemlist(),
    })
        .then((response) => response.data)
        .then((json) => {
            callback(json);

            // console.log("loadCategories: result " + JSON.stringify(json))	;
        })
        .catch((error) => {
            errorcallback(error.message);
            // console.log("loadShopitems error: " + error.message);
        });
}

function loadShopitemPrintList(callback, errorcallback) {
    axios({
        method: 'get',
        url: serverinfo.url_shopitemprintlist(),
    })
        .then((response) => response.data)
        .then((json) => {
            callback(json);

            // console.log("loadCategories: result " + JSON.stringify(json))	;
        })
        .catch((error) => {
            errorcallback(error.message);
            // console.log("loadShopitems error: " + error.message);
        });
}

function updateProduct(prodobj, callback, errorcallback) {
    axios({
        method: 'post',
        url: serverinfo.url_updateproduct(),
        data: prodobj,
    })
        .then((response) => {
            //Detect  http errors
            if (response.status != 200) {
                // this.refs.dialog.showAlert(response.statusText,'medium');
                errorcallback(response.statusText);
                // return (null);
            }
            //        	console.log(response);
            return response;
        })
        .then((response) => response.data)
        .then((responseMessage) => {
            //Detect app or db errors
            //            console.log (responseMessage);
            if (responseMessage.status == 0) {
                //SUCCESS
                callback(responseMessage);
            } else {
                errorcallback(response.statusText);
                // return (null);
                // this.refs.dialog.showAlert(responseMessage.message, 'medium');
                //            	onError();
            }
        })
        .catch((error) => {
            errorcallback(error);
            // console.log("updateProduct error: " + error.message);
            // this.refs.dialog.showAlert(error.message, 'medium');
        });

    // return success;
}

function deleteProduct(prodobj, callback, errorcallback) {
    axios({
        method: 'post',
        url: serverinfo.url_delproduct(),
        data: prodobj,
    })
        .then((response) => {
            //Detect  http errors
            if (response.status != 200) {
                // this.refs.dialog.showAlert(response.statusText, 'medium');
                errorcallback(response.statusText);
            }
            //        	console.log(response);
            return response;
        })
        .then((response) => response.data)
        .then((responseMessage) => {
            //Detect app or db errors
            //            console.log (responseMessage);
            if (responseMessage.status == 0) {
                //SUCCESS
                callback(responseMessage);
                // this.loadProducts();
            } else {
                errorcallback(response.statusText);
                // this.refs.dialog.showAlert(responseMessage.message, 'medium');
                // onError();
            }
        })
        .catch((error) => {
            errorcallback(error);
            // console.log("deleteProduct error: " + error.message);
            // this.refs.dialog.showAlert(error.message, 'medium');
        });
}

function replaceShopitemList(slist, callback, errorcallback) {
    axios({
        method: 'post',
        url: serverinfo.url_replaceshopitemlist(),
        data: slist,
    })
        .then((response) => {
            //Detect  http errors
            if (response.status != 200) {
                // this.refs.dialog.showAlert(response.statusText, 'medium');
                errorcallback(response.statusText);
            }
            //        	console.log(response);
            return response;
        })
        .then((response) => response.data)
        .then((responseMessage) => {
            //Detect app or db errors
            //            console.log (responseMessage);
            if (responseMessage.status == 0) {
                //SUCCESS
                callback(responseMessage);
                // this.loadProducts();
            } else {
                errorcallback(response.statusText);
                // this.refs.dialog.showAlert(responseMessage.message, 'medium');
                // onError();
            }
        })
        .catch((error) => {
            errorcallback(error);
            // console.log("deleteProduct error: " + error.message);
            // this.refs.dialog.showAlert(error.message, 'medium');
        });
}

function addShopitemList(slist, callback, errorcallback) {
    axios({
        method: 'post',
        url: serverinfo.url_addshopitemlist(),
        data: slist,
    })
        .then((response) => {
            //Detect  http errors
            if (response.status != 200) {
                // this.refs.dialog.showAlert(response.statusText, 'medium');
                errorcallback(response.statusText);
            }
            //        	console.log(response);
            return response;
        })
        .then((response) => response.data)
        .then((responseMessage) => {
            //Detect app or db errors
            //            console.log (responseMessage);
            if (responseMessage.status == 0) {
                //SUCCESS
                callback(responseMessage);
                // this.loadProducts();
            } else {
                errorcallback(response.statusText);
                // this.refs.dialog.showAlert(responseMessage.message, 'medium');
                // onError();
            }
        })
        .catch((error) => {
            errorcallback(error);
            // console.log("deleteProduct error: " + error.message);
            // this.refs.dialog.showAlert(error.message, 'medium');
        });
}

function deleteAllShopitems(callback, errorcallback) {
    axios({
        method: 'post',
        url: serverinfo.url_delallshopitems(),
    })
        .then((response) => {
            //Detect  http errors
            if (response.status != 200) {
                // this.refs.dialog.showAlert(response.statusText, 'medium');
                errorcallback(response.statusText);
            }
            //        	console.log(response);
            return response;
        })
        .then((response) => response.data)
        .then((responseMessage) => {
            //Detect app or db errors
            //            console.log (responseMessage);
            if (responseMessage.status == 0) {
                //SUCCESS
                callback(responseMessage);
                // this.loadProducts();
            } else {
                errorcallback(response.statusText);
                // this.refs.dialog.showAlert(responseMessage.message, 'medium');
                // onError();
            }
        })
        .catch((error) => {
            errorcallback(error);
            // console.log("deleteProduct error: " + error.message);
            // this.refs.dialog.showAlert(error.message, 'medium');
        });
}

export {
    loadProducts,
    loadCategories,
    updateProduct,
    deleteProduct,
    addShopitemList,
    deleteAllShopitems,
    loadShopitems,
    loadShopitemPrintList,
    replaceShopitemList,
};

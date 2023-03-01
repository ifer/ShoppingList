import { messages } from './messages';
import { serverinfo } from './serverinfo';
import { authentication } from '../js/authentication';

var axios = require('axios');

async function loadProducts() {
    try {
        const response = await axios({ method: 'get', url: serverinfo.url_productlist() });
        const data = response.data;
        return data;
        // console.log('loadProducts: result ' + JSON.stringify(data));
    } catch (error) {
        console.log('loadProducts error: ' + error.message);
    }
}

// function loadProducts0(callback, errorcallback) {
//     // this.searchform = sf;
//     // this.saveSearchForm (sf);
//     // url: serverinfo.url_productlist(),
//     console.log('Loading products...');
//     axios({
//         method: 'get',
//         url: serverinfo.url_productlist(),
//     })
//         .then((response) => response.data)
//         .then((json) => {
//             callback(json);
//             // console.log('loadProducts: result ' + JSON.stringify(this.state.products));
//         })
//         .catch((error) => {
//             errorcallback(error.message);
//             console.log('loadProducts error: ' + error.message);
//         });
// }

async function loadCategories(c) {
    try {
        const response = await axios({ method: 'get', url: serverinfo.url_categorylist() });
        const data = response.data;
        return data;
        // console.log('loadCategories: result ' + JSON.stringify(data));
    } catch (error) {
        console.log('loadCategories error: ' + error.message);
        return error.message;
    }
}

// function loadCategories(callback, errorcallback) {
//     axios({
//         method: 'get',
//         url: serverinfo.url_categorylist(),
//     })
//         .then((response) => response.data)
//         .then((json) => {
//             callback(json);

//             // console.log("loadCategories: result " + JSON.stringify(json))	;
//         })
//         .catch((error) => {
//             errorcallback(error.message);
//             // console.log("loadCategories error: " + error.message);
//         });
// }

// function loadShopitems(callback, errorcallback) {
//     axios({
//         method: 'get',
//         url: serverinfo.url_shopitemlist(),
//     })
//         .then((response) => response.data)
//         .then((json) => {
//             callback(json);

//             // console.log("loadCategories: result " + JSON.stringify(json))	;
//         })
//         .catch((error) => {
//             errorcallback(error.message);
//             // console.log("loadShopitems error: " + error.message);
//         });
// }

async function loadShopitems() {
    try {
        const response = await axios({ method: 'get', url: serverinfo.url_shopitemlist() });
        const data = response.data;
        return data;
        // console.log('loadShopitems: result ' + JSON.stringify(data));
    } catch (error) {
        console.log('loadShopitems error: ' + error.message);
    }
}

// function loadShopitemPrintList(callback, errorcallback) {
//     axios({
//         method: 'get',
//         url: serverinfo.url_shopitemprintlist(),
//     })
//         .then((response) => response.data)
//         .then((json) => {
//             // console.log('loadShopitemPrintList: result ' + JSON.stringify(json));
//             callback(json);
//         })
//         .catch((error) => {
//             errorcallback(error.message);
//             // console.log("loadShopitems error: " + error.message);
//         });
// }

async function loadShopitemPrintList(callback, errorcallback) {
    try {
        const response = await axios({ method: 'get', url: serverinfo.url_shopitemprintlist() });
        const data = response.data;
        return data;
        // console.log('loadShopitemPrintList: result ' + JSON.stringify(data));
    } catch (error) {
        console.log('loadShopitemPrintList error: ' + error.message);
    }
}
async function updateProduct(prodobj) {
    const promise = new Promise(async (resolve, reject) => {
        let response;
        try {
            response = await axios({ method: 'post', url: serverinfo.url_updateproduct(), data: prodobj });
        } catch (error) {
            reject(response.statusText);
        }
        if (response.status == 200) {
            let responseMessage = { ...response.data };
            if (responseMessage.status == 0) {
                resolve(responseMessage.data);
            } else {
                reject(responseMessage.message);
            }
        } else {
            reject(response.statusText);
        }
    });

    return promise;
}

// function updateProduct(prodobj, callback, errorcallback) {
//     axios({
//         method: 'post',
//         url: serverinfo.url_updateproduct(),
//         data: prodobj,
//     })
//         .then((response) => {
//             //Detect  http errors
//             if (response.status != 200) {
//                 // this.refs.dialog.showAlert(response.statusText,'medium');
//                 errorcallback(response.statusText);
//                 // return (null);
//             }
//             //        	console.log(response);
//             return response;
//         })
//         .then((response) => response.data)
//         .then((responseMessage) => {
//             //Detect app or db errors
//             //            console.log (responseMessage);
//             if (responseMessage.status == 0) {
//                 //SUCCESS
//                 callback(responseMessage);
//             } else {
//                 errorcallback(response.statusText);
//                 // return (null);
//                 // this.refs.dialog.showAlert(responseMessage.message, 'medium');
//                 //            	onError();
//             }
//         })
//         .catch((error) => {
//             errorcallback(error);
//             // console.log("updateProduct error: " + error.message);
//             // this.refs.dialog.showAlert(error.message, 'medium');
//         });

//     // return success;
// }

// function deleteProduct(prodobj, callback, errorcallback) {
//     axios({
//         method: 'post',
//         url: serverinfo.url_delproduct(),
//         data: prodobj,
//     })
//         .then((response) => {
//             //Detect  http errors
//             if (response.status != 200) {
//                 // this.refs.dialog.showAlert(response.statusText, 'medium');
//                 errorcallback(response.statusText);
//             }
//             //        	console.log(response);
//             return response;
//         })
//         .then((response) => response.data)
//         .then((responseMessage) => {
//             //Detect app or db errors
//             //            console.log (responseMessage);
//             if (responseMessage.status == 0) {
//                 //SUCCESS
//                 callback(responseMessage);
//                 // this.loadProducts();
//             } else {
//                 errorcallback(response.statusText);
//                 // this.refs.dialog.showAlert(responseMessage.message, 'medium');
//                 // onError();
//             }
//         })
//         .catch((error) => {
//             errorcallback(error);
//             // console.log("deleteProduct error: " + error.message);
//             // this.refs.dialog.showAlert(error.message, 'medium');
//         });
// }

async function deleteProduct(prodobj) {
    const promise = new Promise(async (resolve, reject) => {
        let response;
        try {
            response = await axios({ method: 'post', url: serverinfo.url_delproduct(), data: prodobj });
        } catch (error) {
            reject(response.statusText);
        }
        if (response.status == 200) {
            const responseMessage = response.data;
            if (responseMessage.status == 0) {
                resolve(responseMessage.data);
            } else {
                reject(responseMessage.message);
            }
        } else {
            reject(responseMessage.message);
        }
    });

    return promise;
}

async function replaceShopitemList(slist) {
    const promise = new Promise(async (resolve, reject) => {
        let response;
        try {
            response = await axios({ method: 'post', url: serverinfo.url_replaceshopitemlist(), data: slist });
        } catch (error) {
            reject(response.statusText);
        }
        if (response.status == 200) {
            const responseMessage = response.data;
            if (responseMessage.status == 0) {
                resolve(responseMessage.data);
            } else {
                reject(responseMessage.message);
            }
        } else {
            reject(responseMessage.message);
        }
    });

    return promise;
}

// function addShopitemList(slist, callback, errorcallback) {
//     axios({
//         method: 'post',
//         url: serverinfo.url_addshopitemlist(),
//         data: slist,
//     })
//         .then((response) => {
//             //Detect  http errors
//             if (response.status != 200) {
//                 // this.refs.dialog.showAlert(response.statusText, 'medium');
//                 errorcallback(response.statusText);
//             }
//             //        	console.log(response);
//             return response;
//         })
//         .then((response) => response.data)
//         .then((responseMessage) => {
//             //Detect app or db errors
//             //            console.log (responseMessage);
//             if (responseMessage.status == 0) {
//                 //SUCCESS
//                 callback(responseMessage);
//                 // this.loadProducts();
//             } else {
//                 errorcallback(response.statusText);
//                 // this.refs.dialog.showAlert(responseMessage.message, 'medium');
//                 // onError();
//             }
//         })
//         .catch((error) => {
//             errorcallback(error);
//             // console.log("deleteProduct error: " + error.message);
//             // this.refs.dialog.showAlert(error.message, 'medium');
//         });
// }

async function addShopitemList(slist) {
    const promise = new Promise(async (resolve, reject) => {
        let response;
        try {
            response = await axios({ method: 'post', url: serverinfo.url_addshopitemlist(), data: slist });
        } catch (error) {
            reject(response.statusText);
        }
        if (response.status == 200) {
            const responseMessage = response.data;
            if (responseMessage.status == 0) {
                resolve(responseMessage.data);
            } else {
                reject(responseMessage.message);
            }
        } else {
            reject(responseMessage.message);
        }
    });

    return promise;
}

// function deleteAllShopitems(callback, errorcallback) {
//     axios({
//         method: 'post',
//         url: serverinfo.url_delallshopitems(),
//     })
//         .then((response) => {
//             //Detect  http errors
//             if (response.status != 200) {
//                 // this.refs.dialog.showAlert(response.statusText, 'medium');
//                 errorcallback(response.statusText);
//             }
//             //        	console.log(response);
//             return response;
//         })
//         .then((response) => response.data)
//         .then((responseMessage) => {
//             //Detect app or db errors
//             //            console.log (responseMessage);
//             if (responseMessage.status == 0) {
//                 //SUCCESS
//                 callback(responseMessage);
//                 // this.loadProducts();
//             } else {
//                 errorcallback(response.statusText);
//                 // this.refs.dialog.showAlert(responseMessage.message, 'medium');
//                 // onError();
//             }
//         })
//         .catch((error) => {
//             errorcallback(error);
//             // console.log("deleteProduct error: " + error.message);
//             // this.refs.dialog.showAlert(error.message, 'medium');
//         });
// }

async function deleteAllShopitems() {
    const promise = new Promise(async (resolve, reject) => {
        let response;
        try {
            response = await axios({ method: 'post', url: serverinfo.url_delallshopitems() });
        } catch (error) {
            reject(response.statusText);
        }
        if (response.status == 200) {
            const responseMessage = response.data;
            if (responseMessage.status == 0) {
                resolve(responseMessage);
            } else {
                reject(responseMessage.message);
            }
        } else {
            reject(responseMessage.message);
        }
    });

    return promise;
}

async function updateCategory(categoryobj) {
    const promise = new Promise(async (resolve, reject) => {
        let response;
        try {
            response = await axios({ method: 'post', url: serverinfo.url_updatecategory(), data: categoryobj });
        } catch (error) {
            reject(response.statusText);
        }
        if (response.status == 200) {
            let responseMessage = { ...response.data };
            if (responseMessage.status == 0) {
                resolve(responseMessage.data);
            } else {
                reject(responseMessage.message);
            }
        } else {
            reject(response.statusText);
        }
    });

    return promise;
}

async function deleteCategory(catid) {
    const promise = new Promise(async (resolve, reject) => {
        let response;
        try {
            response = await axios({ method: 'post', url: serverinfo.url_delcategory(), data: catid });
        } catch (error) {
            reject(response.statusText);
        }
        if (response.status == 200) {
            const responseMessage = response.data;
            if (responseMessage.status == 0) {
                resolve(responseMessage.data);
            } else {
                reject(responseMessage.message);
            }
        } else {
            reject(responseMessage.message);
        }
    });

    return promise;
}

async function loadUsers() {
    try {
        const response = await axios({ method: 'get', url: serverinfo.url_users() });
        const data = response.data;
        return data;
        // console.log('loadProducts: result ' + JSON.stringify(data));
    } catch (error) {
        return error.message;
        console.log('loadProducts error: ' + error.message);
    }
}

async function updateUser(userobj, url) {
    const promise = new Promise(async (resolve, reject) => {
        let response;
        try {
            response = await axios({ method: 'post', url: serverinfo.url_upduser(), data: userobj });
        } catch (error) {
            reject(response.statusText);
        }
        if (response.status == 200) {
            let responseMessage = { ...response.data };
            if (responseMessage.status == 0) {
                resolve(responseMessage.data);
            } else {
                reject(responseMessage.message);
            }
        } else {
            reject(response.statusText);
        }
    });

    return promise;
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
    updateCategory,
    deleteCategory,
    loadUsers,
    updateUser,
    // deleteUser,
};

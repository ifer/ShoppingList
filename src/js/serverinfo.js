

var Config = require('Config') // defined in webpack.config.js

var serverinfo = {
	base_url: Config.baseApiUrl,
	email_url: Config.sendEmailUrl,
	url_login()	 {return this.base_url + "/login"},
	url_logout() {return this.base_url + "/api/logout"},

	url_category() {return this.base_url + "/api/category"},
	url_categorylist() {return this.base_url + "/api/categorylist"},
	url_updatecategory() {return this.base_url + "/api/updatecategory"},
	url_delcategory() {return this.base_url + "/api/delcategory"},
	url_product() {return this.base_url + "/api/product"},
	url_productlist() {return this.base_url + "/api/productlist"},
	url_updateproduct() {return this.base_url + "/api/updateproduct"},
	url_delproduct() {return this.base_url + "/api/delproduct"},
	url_shopitem() {return this.base_url + "/api/shopitem"},
	url_shopitemlist() {return this.base_url + "/api/shopitemlist"},
	url_shopitemprintlist() {return this.base_url + "/api/shopitemprintlist"},
	url_updateshopitem() {return this.base_url + "/api/updateshopitem"},
	url_delshopitem() {return this.base_url + "/api/delshopitem"},
	url_addshopitemlist() {return this.base_url + "/api/addshopitemlist"},
	url_delshopitemlist() {return this.base_url + "/api/delshopitemlist"},
	url_delallshopitems() {return this.base_url + "/api/delallshopitems"},

	url_users() {return this.base_url +"/api/users"},
	url_upduser() {return this.base_url +"/api/updateuser"},
	url_updpasswd() {return this.base_url +"/api/updatepassword"},
	url_deluser() {return this.base_url +"/api/deluser"},
	url_curruserdata() {return this.base_url +"/api/currentuserdata"},
	url_jwttoken() {return this.base_url + "/api/jwttoken"}
}
// console.log("base_url=" + serverinfo.base_url);
export {
  serverinfo
};

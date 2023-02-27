/**
 * http://usejsdoc.org/
 */

import { serverinfo } from '../js/serverinfo';
import { authentication } from '../js/authentication';

var moment = require('moment');

var dateFormat = 'DD/MM/YYYY';

var axios = require('axios');

function datestrToIsoDate(datestr) {
    if (datestr == null || datestr === '') return '';

    if (datestr === 'now') return new Date().toISOString();

    var parts = datestr.split('/');
    var dt = new Date(parseInt(parts[2], 10), parseInt(parts[1] - 1, 10), parseInt(parts[0], 10), 12, 0, 0, 0);
    var dt_tz = new Date(dt.getTime() + dt.getTimezoneOffset() * 60000);
    return dt_tz.toISOString();
}

function noGreekAccents(s) {
    let out = '';

    let len = s.length;
    for (let i = 0; i < len; i++) {
        let c = s.charAt(i);
        switch (c) {
            case 'ά':
                out += 'α';
                break;
            case 'Ά':
                out += 'Α';
                break;

            case 'έ':
                out += 'ε';
                break;
            case 'Έ':
                out += 'Ε';
                break;

            case 'ό':
                out += 'ο';
                break;
            case 'Ό':
                out += 'Ο';
                break;

            case 'ώ':
                out += 'ω';
                break;
            case 'Ώ':
                out += 'Ω';
                break;

            case 'ί':
                out += 'ι';
                break;
            case 'ϊ':
                out += 'ι';
                break;
            case 'Ί':
                out += 'Ι';
                break;
            case 'Ϊ':
                out += 'Ι';
                break;

            case 'ύ':
                out += 'υ';
                break;
            case 'ϋ':
                out += 'υ';
                break;
            case 'Ύ':
                out += 'Υ';
                break;
            case 'Ϋ':
                out += 'Υ';
                break;

            case 'ή':
                out += 'η';
                break;
            case 'Ή':
                out += 'Η';
                break;
            default:
                out += c;
                break;
        }
    }

    return out;
}

function getFormattedDate() {
    var d = new Date();

    var ds =
        ('0' + d.getDate()).slice(-2) +
        '/' +
        ('0' + (d.getMonth() + 1)).slice(-2) +
        '/' +
        d.getFullYear() +
        ' ' +
        ('0' + d.getHours()).slice(-2) +
        ':' +
        ('0' + d.getMinutes()).slice(-2) +
        ':' +
        ('0' + d.getSeconds()).slice(-2);

    return ds;
}

function getContentHeight() {
    var h = document.getElementById('appcontent').offsetHeight;
    return h - 90 + '.px';
}

function isUserAdmin(curruser) {
    if (curruser == null) return false;

    let roles = curruser.roles.split(',');
    for (let i = 0; i < roles.length; i++) {
        if (roles[i] === 'ROLE_ADMIN') return true;
    }
    return false;
}

function isUserReadonly(curruser) {
    if (curruser == null) return false;

    let roles = curruser.roles.split(',');
    for (let i = 0; i < roles.length; i++) {
        if (roles[i] === 'ROLE_READONLY') return true;
    }

    return false;
}

function dateValidationState(dateparam) {
    if (!dateparam) return undefined;

    let dt = moment(dateparam, dateFormat, true); // arg true: to perform a strict validation
    if (!dt.isValid()) return 'error';

    if (dt.year() < 1900) return 'error';

    return undefined;
}

function calcAge(birthdate) {
    let years = '';
    if ((birthdate == null) | (birthdate == undefined) || birthdate === '') return years;

    let bd = moment(birthdate, dateFormat);
    years = moment().diff(bd, 'years');
    if (isNaN(years)) return '';
    if (years < 1 || years > 120) return '';
    return years;
}

function callAppTrace(message) {
    let jsonmsg = { text: message };
    axios({
        method: 'post',
        url: serverinfo.url_apptrace(),
        data: jsonmsg,
        auth: {
            username: authentication.username,
            password: authentication.password,
        },
    })
        .then((response) => {
            //Detect  http errors
            if (response.status != 200) {
                console.log('callAppTrace error: ' + response.statusText);
                return null;
            }
        })
        .catch((error) => {
            console.log('callAppTrace error: ' + error.message);
        });
}

export {
    datestrToIsoDate,
    noGreekAccents,
    getFormattedDate,
    getContentHeight,
    isUserAdmin,
    isUserReadonly,
    dateValidationState,
    calcAge,
    callAppTrace,
};

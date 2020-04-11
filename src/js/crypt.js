

//GYNPASS stored in /etc/systemd/system/GynEmailService.service (PROD)
//and in ~ifer/.bashrc (DEV)


// var pass = process.env.GYNPASS;
var pass = 'H3r3Com3sTh3SunAbb3yR0ad';
if (! pass){
    console.log ('FATAL: Cannot load encryption key from env var GYNPASS!');
    // return;
}
var encryptor = require('simple-encryptor')(pass);

var crypt = {
    encrypt (text){
        let s = encryptor.encrypt(text);
        return (s);
    },
    decrypt (text){
        let s = encryptor.decrypt(text);
        return (s);
    }
}
export {
  crypt
};

// var encrypt = (text) => {
//     var pass = process.env.GYNPASS;
//     if (! pass){
//         console.log ('FATAL: Cannot load encryption key from env var GYNPASS!');
//         return null;
//     }
//     var encryptor = require('simple-encryptor')(pass);
//     let s = encryptor.encrypt(text);
//     return (s);
// }
//
// var decrypt = (text) => {
//     var pass = process.env.GYNPASS;
//     if (! pass){
//         console.log ('FATAL: Cannot load encryption key from env var GYNPASS!');
//         return null;
//     }
//     var encryptor = require('simple-encryptor')(pass);
//     let d = encryptor.decrypt(text);
//     return (d);
// }
//
//
// module.exports = {
//   encrypt,
//   decrypt
// }

// Nodejs built-in encryption library with CTR
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'H3r3Com3sTh3SunAbb3yR0ad';

const sjcl_password = 'H3r3Com3sTh3SunAbb3yR0ad';

//Standford's encryption library
import sjcl from 'sjcl';



const crypt = {
  /* encrypt, decrypt: wrappers to call the preferred library */
  encrypt (text){
    return this.sjcl_encrypt(text);
  },

  decrypt (text) {
    return this.sjcl_decrypt(text);
  },

  sjcl_encrypt(text){
    let s = sjcl.encrypt(sjcl_password, text);
    return (s);
  },

  sjcl_decrypt(text){
    let d = sjcl.decrypt(sjcl_password, text);
    return (d);
  },

  crypto_encrypt(text){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  },

  crypto_decrypt(text){
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
  }
}

export {
  crypt
};
// var hw = encrypt("hello world")
// // outputs hello world
// console.log(decrypt(hw));


import {EventEmitter} from 'fbemitter';

var eventManager = {
  emitter: null,
  authChannel: 'authState',

  getEmitter(){
    if (this.emitter == null){
      this.emitter = new EventEmitter();
      return this.emitter;
    }
    else {
      return this.emitter;
    }

  }

}
export {
  eventManager
};
/*
var {EventEmitter} = require('fbemitter');

const eventManager = function () {
  this.emitter = this.emitter || new EventEmitter();

  this.authChannel = 'authState';

  this.getEmitter = function() {
    return this.emitter;
  }
}

module.exports = new eventManager();
*/

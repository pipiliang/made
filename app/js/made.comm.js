/**
 * Made - a markdown slide application
 * global message router
 * Copyright (c) 2016-2020, liang wei. (MIT Licensed)
 * https://github.com/pipiliang/made
 */

(function () {
  "use strict";
}());

if (isElectron) {
  var {ipcRenderer, remote, shell} = require('electron');
  var ElectronMediator = {
    getCurrentWindow: function () {
      return remote.getCurrentWindow();
    },
    openExternal: function (url) {
      shell.openExternal(url);
    }
  };

  var MessageRouter = {
    create: function () {
      var msgRouter = {};
      //send message to main process asynchronously
      msgRouter.asynSend = function (callBack, ...msg) {
        ipcRenderer.on('asynchronous-reply', function (e, arg) {
          if (callBack === null) return;
          callBack(e, arg);
        });
        ipcRenderer.send('asynchronous-message', msg);
      };
      //receive message from main process
      msgRouter.on = function (topic, callback) {
        ipcRenderer.on(topic, function (e, msg) { callback(e, msg); });
      };
      return msgRouter;
    }
  };
}

/**
 * 单例事件池
 */
var EventPool = (function () {
  function constructor() {
    var target = new EventTarget();
    return {
      add: function (type, handler) {
        target.addEvent(type, handler);
      },
      fire: function (e) {
        target.fireEvent(e);
      },
      remove: function (type, handler) {
        target.removeEvent(type, handler);
      }
    };
  }

  var instance;
  return {
    getInstance: function () {
      if (!instance) {
        instance = new constructor();
      }
      return instance;
    }
  };
}());

/**
 * 事件枚举
 */
var Event = {
  SLIDE_COUNT_CHANGED: 'slideCountChanged'
};

/**
 * 事件定制
 */
function EventTarget() {
  this.handlers = {};
}

EventTarget.prototype = {

  constructor: EventTarget,
  /**
   * type 自定义事件类型
   * handler 自定义事件回调函数
   */
  addEvent: function (type, handler) {
    if (typeof this.handlers[type] === 'undefined') {
      this.handlers[type] = [];
    }
    this.handlers[type].push(handler);
  },

  //event: js对象，属性中至少包含type属性
  fireEvent: function (event) {
    if (!event.target) {
      event.target = this;
    }

    if (this.handlers[event.type] instanceof Array) {
      var handlers = this.handlers[event.type];
      for (var i = 0; i < handlers.length; i++) {
        handlers[i](event);
      }
    }
  },

  /**
  * type 自定义事件类型
  * handler 自定义事件回调函数
  */
  removeEvent: function (type, handler) {
    if (this.handlers[type] instanceof Array) {
      var handlers = this.handlers[type];
      for (var i = 0; i < handlers.length; i++) {
        if (handlers[i] === handler) {
          break;
        }
      }
      handlers.splice(i, 1);
    }
  }
};

String.prototype.like = function (str) {
  var reg = new RegExp("^" + str + "\s*$");
  return reg.test(this);
};

String.prototype.startWith = function (s) {
  if (empty(s) || this.length === 0 || s.length > this.length)
    return false;
  return this.substr(0, s.length) === s;
};

String.prototype.endWith = function (s) {
  if (empty(s) || this.length === 0 || s.length > this.length)
    return false;
  return this.substring(this.length - s.length) === s;
};

function empty(s){
  return s === null || s === "";
}

function requestFullScreen(element) {
    var requestMethod = element.requestFullScreen || //W3C
    element.webkitRequestFullScreen ||    //Chrome等
    element.mozRequestFullScreen || //FireFox
    element.msRequestFullScreen; //IE11
    if (requestMethod) {
        requestMethod.call(element);
    }
    else if (typeof window.ActiveXObject !== "undefined") {//for IE
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

function exitFullScreen() {
    var exitMethod = document.exitFullscreen || //W3C
    document.mozCancelFullScreen ||    //Chrome等
    document.webkitExitFullscreen || //FireFox
    document.webkitExitFullscreen; //IE11
    if (exitMethod) {
        exitMethod.call(document);
    }
    else if (typeof window.ActiveXObject !== "undefined") {//for IE
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}
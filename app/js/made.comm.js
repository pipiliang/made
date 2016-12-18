/**
 * Made - a markdown slide application
 * global message router
 * Copyright (c) 2016-2020, liang wei. (MIT Licensed)
 * https://github.com/pipiliang/made
 */
if (isElectron) {

    const {ipcRenderer, remote, shell} = require('electron')

    var ElectronMediator = {
        getCurrentWindow: function () {
            return remote.getCurrentWindow()
        },

        openExternal: function (url) {
            shell.openExternal(url)
        }
    }

    var MessageRouter = {

        create: function () {
            var msgRouter = {}

            // send to main process asynchronously
            msgRouter.asynSend = (callBack, ...msg) => {
                ipcRenderer.on('asynchronous-reply', (e, arg) => {
                    if (callBack == null) return
                    callBack(e, arg)
                })
                ipcRenderer.send('asynchronous-message', msg)
            }

            //receive message from main process
            msgRouter.on = (topic, callback) => {
                ipcRenderer.on(topic, (e, msg) => { callback(e, msg) })
            }

            return msgRouter
        }
    }
}

/**
 * 单例事件池
 */
var EventPool = (() => {
    function constructor() {
        var target = new EventTarget();
        return {
            add: (type, handler) => {
                target.addEvent(type, handler);
            },
            fire: (e) => {
                target.fireEvent(e)
            },
            remove: (type, handler) => {
                target.removeEvent(type, handler);
            }
        }
    }

    var instance;
    return {
        getInstance: function () {
            if (!instance) {
                instance = new constructor();
            }
            return instance;
        }
    }
})();

/**
 * 事件枚举
 */
var Event = {
    SLIDE_COUNT_CHANGED: 'slideCountChanged'
}

/**
 * 事件定制
 */
function EventTarget() {
    this.handlers = {}
}

EventTarget.prototype = {

    constructor: EventTarget,
    /**
     * type 自定义事件类型
     * handler 自定义事件回调函数
     */
    addEvent: function (type, handler) {
        if (typeof this.handlers[type] == 'undefined') {
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
                if (handlers[i] == handler) {
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
}

String.prototype.startWith = function (s) {
    if (s == null || s == "" || this.length == 0 || s.length > this.length)
        return false;
    return this.substr(0, s.length) == s;
}

String.prototype.endWith = function (s) {
    if (s == null || s == "" || this.length == 0 || s.length > this.length)
        return false;
    return this.substring(this.length - s.length) == s;
}

String.prototype.test = function (regex) {
    return new RegExp(regex).test(this);
}

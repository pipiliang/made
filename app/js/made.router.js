/**
 * Made - a markdown slide application
 * global message router
 * Copyright (c) 2016-2020, liang wei. (MIT Licensed)
 * https://github.com/pipiliang/made
 */

const {ipcRenderer, remote} = require('electron')

var ElectronInfo = {
    getCurrentWindow: function () {
        return remote.getCurrentWindow()
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
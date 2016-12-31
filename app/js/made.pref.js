/**
 * Made - a markdown slide application
 * preferences handler script
 * Copyright (c) 2016-2020, liang wei. (MIT Licensed)
 * https://github.com/pipiliang/made
 */

$(function () {
  $('#toggleShowLineNumbers').change(function () {
    var callBack = (e, arg) => {
      console.log("pref: " + arg)
    }
    MessageRouter.create().asynSend(callBack, 'showLineNumbers', $(this).prop('checked'))
  })
})
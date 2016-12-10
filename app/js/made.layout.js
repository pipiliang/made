/**
 * Made - a markdown slide application
 * adjust layout here
 * Copyright (c) 2016-2020, liang wei. (MIT Licensed)
 * https://github.com/pipiliang/made
 */

var byid = (id) => {
  return document.getElementById(id)
}

var preDocumentWidth = document.body.clientWidth
var preSlideWidth = 527.56
const middleWidth = 6;

$(document).ready(() => {
  left = byid("left");
  right = byid("right");
  middle = byid("middle");

  //console.log("init: " + $("#showContainer").children(":last").width() + ":" + $("#showContainer").children(":last").height())
  middle.onmousedown = (e) => {
    var disX = (e || event).clientX;
    middle.left = middle.offsetLeft;

    document.onmousemove = (e) => {
      var iT = middle.left + ((e || event).clientX - disX);
      var e = e || window.event;
      var tarnameb = e.target || e.srcElement;
      maxT = document.body.clientWidth;
      iT < 0 && (iT = 0);
      iT > maxT && (iT = maxT);

      middle.style.left = left.style.width = iT + "px";
      var dyWidth = document.body.clientWidth - iT - middleWidth;
      right.style.width = dyWidth + "px";
      right.style.left = iT + middleWidth + "px";

      scaleSlide()
      return false
    };

    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
      middle.releaseCapture && middle.releaseCapture()
    };

    middle.setCapture && middle.setCapture();
    return false
  };
});

$(window).resize(() => {

  var curDocumentWidth = document.body.clientWidth

  var curLeftWidth = (curDocumentWidth - middleWidth) * $("#left").width() / (preDocumentWidth - middleWidth)
  $("#left").width(curLeftWidth)
  $("#middle").css("left", curLeftWidth + "px")
  var curRightWidth = curDocumentWidth - middleWidth - curLeftWidth
  $("#right").width(curRightWidth)
  $("#right").css("left", (curLeftWidth + middleWidth) + "px")

  scaleSlide()
  preDocumentWidth = curDocumentWidth

})

var scaleSlide = () => {
  // rate = $("#showContainer").children(":last").width() / 527.56
  // console.log($("#showContainer").children(":last").width())
  // console.log("rate:" + rate)
  // $("#showContainer").children("div").css('transform', 'scale(' + rate + ')')
  // curSlideWidth = $("#showContainer").children(":last").width()
  // rate = curSlideWidth / preSlideWidth
  // console.log("rate:" + rate + " pre:" + preSlideWidth + " cur:" + curSlideWidth)
  // $("#showContainer").children("div").css('transform', 'scale(' + rate + ')')
  // preSlideWidth = curSlideWidth
}

/**
 * view menu handler
 */

if (isElectron) {
  var router = MessageRouter.create()
  router.on('view', (event, message) => {
    switch (message) {
      case "showslide":
        break
    }
  })
}

/**
 * editor handler script -- handle all editor event
 */

if (isElectron) {
    var fs = require('fs')
    var router = MessageRouter.create()
    router.on('open', (event, message) => {
        console.log("open file: " + message)
        fs.readFile(message, 'utf8', function (err, data) {
            if (err) throw err
            $("#writeArea").val(data)
            onWrite(data, true)
        })
    })

    router.on('save', (event, message) => {
        console.log("save file: " + message)
        fs.writeFile(message, $("#writeArea").val(), function (err) {
            if (err) throw err
            console.log("File Saved !"); //文件被保存
        })
    })

    router.on('editor-showLineNumbers', (event, msg) => {
        $('#writeArea').toggleLineNumbers()
    })
}
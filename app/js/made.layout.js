/**
 * Made - a markdown slide application
 * adjust layout here
 * Copyright (c) 2016-2020, liang wei. (MIT Licensed)
 * https://github.com/pipiliang/made
 */

var preDocumentWidth = document.body.clientWidth;
var middleWidth = 6;
var minT = 100;

$(document).ready(function () {
  $("#middle").on('mousedown', function (e) {

    var disX = (e || event).clientX;
    $("#middle")[0].left = $("#middle").offset().left;

    document.onmousemove = function (e) {
      var iT = middle.left + ((e || event).clientX - disX);
      var ee = e || window.event;
      var tarnameb = ee.target || ee.srcElement;
      maxT = document.body.clientWidth - minT;
      if (iT < minT && (iT = minT)) return false;
      if (iT > maxT && (iT = maxT)) return false;

      $("#middle").css("left", iT + "px");
      $("#left").css("width", iT + "px");
      var dyWidth = document.body.clientWidth - iT - middleWidth;
      $("#right").css("width", dyWidth + "px");
      $("#right").css("left", iT + middleWidth + "px");

      return false;
    };

    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
      if ($("#middle")[0].releaseCapture && $("#middle")[0].releaseCapture()) return;
      scaleSlide()
    };

    if ($("#middle")[0].setCapture && $("#middle")[0].setCapture()) return;
    return false;
  });
});

var preSlideWidth = 527.56;
$(window).resize(function () {
  var curDocumentWidth = document.body.clientWidth;

  var curLeftWidth = (curDocumentWidth - middleWidth) * $("#left").width() / (preDocumentWidth - middleWidth);
  $("#left").width(curLeftWidth);
  $("#middle").css("left", curLeftWidth + "px");
  var curRightWidth = curDocumentWidth - middleWidth - curLeftWidth;
  $("#right").width(curRightWidth);
  $("#right").css("left", (curLeftWidth + middleWidth) + "px");

  scaleSlide();
  preDocumentWidth = curDocumentWidth;
});


var scaleSlide = function () {
  curSlideWidth = $("#showContainer").children(":last").width()
  rate = curSlideWidth / preSlideWidth
  //console.log("rate:" + rate + " pre:" + preSlideWidth + " cur:" + curSlideWidth)
  //$("#showContainer").children("div").css('transform', 'scale(' + rate + ')')
  preSlideWidth = curSlideWidth
};
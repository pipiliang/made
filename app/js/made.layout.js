/**
 * Made - a markdown slide application
 * adjust layout here
 * Copyright (c) 2016-2020, liang wei. (MIT Licensed)
 * https://github.com/pipiliang/made
 */

$(document).ready(function () {
  var midWidth = 6;
  var lMin = 200;
  var rMin = 300;
  $("#middle").on('mousedown', function (e) {
    var disX = (e || event).clientX;
    middle.left = $("#middle").offset().left;

    document.onmousemove = function (e) {
      var left = middle.left + ((e || event).clientX - disX);
      if (left <= lMin || left >= (getClientWidth() - rMin))
        return false;
      $("#middle").css("left", left + "px");
      $("#left").width(left);
      $("#right").width(getClientWidth() - left - midWidth);
      $("#right").css("left", left + midWidth + "px");
      scale();
      return false;
    };

    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
      if (middle.releaseCapture && middle.releaseCapture())
        return;
    };

    if (middle.setCapture && middle.setCapture())
      return false;
  });

  var preWidth = getClientWidth();
  $(window).resize(function () {
    var curWidth = getClientWidth();

    var leftWidth = (curWidth - midWidth) * ($("#left").width() / (preWidth - midWidth));
    $("#left").width(leftWidth);
    $("#middle").css("left", leftWidth + "px");
    $("#right").width(curWidth - midWidth - leftWidth);
    $("#right").css("left", (leftWidth + midWidth) + "px");
    scale();

    preWidth = curWidth;
  })

  function getClientWidth() {
    return document.body.clientWidth;
  };

  function scale() {
    var ratio = ($("#right").width() / 644);
    $("#showContainer").children("div").css("zoom", ratio);
  }

});
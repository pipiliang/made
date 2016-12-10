/**
 * Made - a markdown slide application
 * js of slide show
 * Copyright (c) 2016-2020, liang wei. (MIT Licensed)
 * https://github.com/pipiliang/made
 */

// write and made slide here

$(document).ready(() => {
	hljs.initHighlightingOnLoad();
	marked.setOptions({
		highlight: function (code) {
			return self.hljs.highlightAuto(code).value;
		}
	});

	$("#writeArea").bind("input", function (e) {
		onInput(e)
	});

	document.addEventListener('keydown', handleGlobalBodyKeyDown, false)

	//open tooltip
	$(() => { $("[data-toggle='tooltip']").tooltip() });
})

String.prototype.endWith = function (str) {
	var reg = new RegExp("^" + str + "\s*");
	return reg.test(this);
}

//low algorithm need be optimize，performance problems
var onInput = (event) => {
	onWrite(event.target.value, false)
}

var onWrite = (content, isNew) => {
	if (isNew) {
		pageNumber = 0
	}
	//console.log(content)
	var allslides = $("#showContainer").children();
	var slideCount = allslides.length;

	var allrows = content.split("\n");
	var rows = allrows.length;
	var slideArray = getSlideArray(allrows);
	var needSlideCount = slideArray.length + 1;

	if (needSlideCount < slideCount) {
		for (var i = 0; i < slideCount - needSlideCount; i++) {
			$("#showContainer").children(":last").remove();
		}
	}

	if (needSlideCount > slideCount) {
		for (var i = 0; i < needSlideCount - slideCount; i++) {
			var add = document.createElement('div');
			add.setAttribute('class', 'item');
			$("#showContainer").children(":last").after(add.outerHTML);
		}
	}

	var allslides = $("#showContainer").children();
	var from = 0;
	for (var i = 0; i < needSlideCount; i++) {
		var to = (i == needSlideCount - 1) ? rows : slideArray[i];
		var curcontext = allrows.slice(from, to).join("\n");
		allslides[i].innerHTML = marked(curcontext);
		from = slideArray[i] + 1;
	}
}

function getAllRows() {
	var text = $("#writeArea").val();
	return text.split("\n");
}

function getSlideArray(o) {
	var splitarray = new Array();
	for (var i = 0; i < o.length; i++) {
		if (o[i].endWith('---')) {
			splitarray.push(i);
		}
	}
	return splitarray;
}

// show and control slide here

var isShow = false;
var pageNumber = 0;
$(document).ready(function () {
	$("#test").click(function () {

	});
})

function showSlide() {
	if (!isShow) {
		show(true);
		$("#page").show()
	}
	var children = $("#showContainer").children();
	console.log(pageNumber + " - " + children.length)
	if (pageNumber >= children.length) {
		pageNumber = children.length - 1
	}
	$('#showHere').animate({ 'opacity': 0 }, 200, function () {
		$(this).html(children[pageNumber].innerHTML).animate({ 'opacity': 1 }, 400);
		$(this).css('transform', 'scale(' + 1.2 + ')')
	});
	$("#page").html((pageNumber + 1) + " / " + (lastSlideIndex() + 1));
}

function hideSlide() {
	if (isShow) {
		show(false);
		$("#page").hide();
	}
}

function show(state) {
	if (isElectron) {
		var electron = require('electron');
		electron.remote.getCurrentWindow().setFullScreen(state);
		electron.remote.getCurrentWindow().setMenuBarVisibility(!state);
	}
	state ? $("#showcase").show() : $("#showcase").hide()
	state ? document.addEventListener('keydown', handleBodyKeyDown, false) : document.removeEventListener('keydown', handleBodyKeyDown, false);
	isShow = state;
}

var handleBodyKeyDown = (event) => {
	console.log(event.keyCode);
	switch (event.keyCode) {
		case 27: //esc
			hideSlide();
			break;
		case 37: //left
		case 38: //up
			if (pageNumber > 0) {
				pageNumber--;
				showSlide();
			}
			break;
		case 39: //right
		case 40: //down
		case 13: //enter
			if (pageNumber < lastSlideIndex()) {
				pageNumber++;
				showSlide();
			}
			break;
		case 80: //P Page
			$("#page").toggle()
			break;
		case 84: //T thumbnail
			break;
	}
	event.returnValue = false;
}

var handleGlobalBodyKeyDown = (event) => {
	switch (event.keyCode) {
		case 118: //F7
			isShow ? hideSlide() : showSlide()
			event.returnValue = false;
			break;
	}
}

var lastSlideIndex = function () {
	return $("#showContainer").children().length - 1
}

if (isElectron) {
    var router = MessageRouter.create()
    router.on('view', (event, message) => {
        if(message === 'showslide'){
			isShow ? hideSlide() : showSlide()
		}
    })
}
/**
 * Made - a markdown slide application
 * editor related function
 * Copyright (c) 2016-2020, liang wei. (MIT Licensed)
 * https://github.com/pipiliang/made
 */

$(document).ready(function () {
  hljs.initHighlightingOnLoad();
  var madeRenderer = new marked.Renderer();
  madeRenderer.blockquote = function (quote) {
    var arr = [];
    arr.push('<p class="blockquote"><i class="fa fa-quote-left quote"></i>');
    arr.push(quote.substring(3, quote.length - 5));
    arr.push('<i class="fa fa-quote-right quote"/></i></p>');
    return arr.join('  ');
  };

  madeRenderer.link = function (href, title, text) {
    return "<a href='javascript: void(0);' onclick=\"openUrl('" + href + "');\" >" + text + "</a>";
  };
  
  madeRenderer.code = function (code, language){
    return "<pre class='codeblock'>" + hljs.highlightAuto(code).value + "</pre>";
  };
 
  madeRenderer.table = function (header, body){
     return "<table class='madetable'>" + header + body + "</table>";
  };

  madeRenderer.codespan = function (code) {
    return "<code class='codespan'>" + code + "</code>";
  };

  marked.setOptions({
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    renderer: madeRenderer
  });

  var editor = MadeEditor.init();
  EditorToolBar.init(editor);
  MadeStatusBar.init();
});

var openUrl = function (url) {
  if (isElectron)
    ElectronMediator.openExternal(url);
  else
    window.open(url);
};

var EditorToolBar = {
  init: function (editor) {
    $("#btnHeader").click(function () { editor.insertText('#', 1); });
    $("#btnBold").click(function () { editor.toggleEnclose('**', '**', -2); });
    $("#btnItalic").click(function () { editor.toggleEnclose('*', '*', -1); });
    $("#btnStrike").click(function () { editor.toggleEnclose('~~', '~~', -2); });

    $("#btnOl").click(function () { editor.insertText('- ', 2); });
    $("#btnUl").click(function () { editor.insertText('1. ', 3); });
    $("#btnTable").click(function () { editor.insertText('|名称|备注|\n|----|:----:|\n|--|--|', 1, 2); });
    $("#btnNew").click(function () { editor.insertText('\n---\n'); });

    $("#btnCode").click(function () { editor.insertText('```\n\n```', 0, 1); });
    $("#btnQuote").click(function () { editor.insertText('>', 1); });
    $("#btnLink").click(function () { editor.insertText('[](http://)', 1); });
    $("#btnImg").click(function () { editor.insertText('![](http://)', 2); });

    $("#btnQuestion").click(function () { openUrl('http://www.markdown.cn'); });

    $("#btnBug").click(function () { openUrl('https://github.com/pipiliang/made/issues'); });

    $("[data-toggle='tooltip']").tooltip();
  }
};

var MadeEditor = {

  init: function () {
    var editor = CodeMirror.fromTextArea(document.getElementById("writeArea"), {
      mode: 'markdown',
      lineNumbers: true,
      theme: "default",
      lineWrapping: "true",
      extraKeys: { Enter: "newlineAndIndentContinueMarkdownList" },
      dragDrop: false
    });

    editor.setSize('100%', '100%');
    var doc = editor.getDoc();
    MadeEditor.foucsIt(editor);

    if (isElectron) {
      var fs = require('fs');
      var router = MessageRouter.create();
      router.on('open', function (event, message) {
        console.log("open file: " + message);
        fs.readFile(message, 'utf8', function (err, data) {
          if (err) throw err;
          editor.setValue(data);
          refreshSlides(data, true);
        });
      });

      router.on('save', function (event, message) {
        console.log("save file: " + message);
        fs.writeFile(message, editor.getValue(), function (err) {
          if (err) throw err;
          console.log("File Saved !");
        });
      });

      router.on('edit', function (event, cmd) {
        editor.execCommand(cmd);
      });

      router.on('editor-showLineNumbers', function (event, msg) {
        // $('#writeArea').toggleLineNumbers()
      });
    }

    // editor.on('keyup', function () {
    //   refreshSlides(editor.getValue());
    // });

    editor.on('change', function () {
      refreshSlides(editor.getValue());
    });

    editor.on('cursorActivity', function (i, e) {
      var cursor = doc.getCursor();
      var row = cursor.line + 1;
      var col = cursor.ch + 1;
      $('#position').html('行 ' + row + ' 列 ' + col);
      var lines = editor.getValue().split("\n");
      var curPage = 1;
      for (var j = 0; j < lines.length; j++) {
        if(j === row)
          break;
        if (lines[j].like('---')) {
          curPage += 1;
        }
      }
      $('#curPage').html(curPage);
    });

    editor.insertText = function (data, cursorOffset = 0, lineOffset = 0) {
      var cursor = doc.getCursor();
      doc.replaceRange(data, cursor);
      editor.focus();
      refreshSlides(editor.getValue());
      doc.setCursor({
        line: cursor.line + lineOffset,
        ch: cursor.ch + cursorOffset
      });
    };

    editor.toggleEnclose = function (before, after, cursorOffset = 0) {
      var sel = doc.getSelection();
      if (sel.startWith(before) && sel.endWith(after)) {
        doc.replaceSelection(sel.substring(before.length, sel.length - after.length));
      } else {
        doc.replaceSelection(before + sel + after);
        if (sel.length === 0) {
          var cursor = doc.getCursor();
          doc.setCursor({
            line: cursor.line,
            ch: cursor.ch + cursorOffset
          });
        }
      }
      editor.focus();
      refreshSlides(editor.getValue());
    };

    return editor;
  },

  foucsIt: function (obj) {
    if (obj.setSelectionRange) {
      setTimeout(function () {
        obj.setSelectionRange(0, 0);
        obj.focus();
      }, 100);
    } else {
      try { obj.focus(); } catch (e) { console.log('focus failed: ' + e);}
    }
  }
};

var MadeStatusBar = {
  init: function () {
    EventPool.getInstance().add(Event.SLIDE_COUNT_CHANGED, function (e) {
      $('#pageNumber').html(e.count);
    });
  }
};

$(function () {
  (function ($) {
    $.fn.extend({
      insertText: function (v, offset) {
        var $t = $(this)[0];
        if ($t.selectionStart || $t.selectionStart === '0') {
          var startPos = $t.selectionStart;
          var endPos = $t.selectionEnd;
          var scrollTop = $t.scrollTop;
          $t.value = $t.value.substring(0, startPos) + v + $t.value.substring(endPos, $t.value.length);
          this.focus();
          $t.selectionStart = startPos + v.length;
          $t.selectionEnd = startPos + v.length;
          $t.scrollTop = scrollTop;
          if (arguments.length === 2) {
            $t.setSelectionRange(startPos - offset, $t.selectionEnd + offset);
            this.focus();
          }
        } else {
          $t.innerText += v;
          this.focus();
        }
      },

      insertOrEnclose: function (before, after, offset) {
        var $t = $(this)[0];
        if ($t.selectionStart || $t.selectionStart === '0') {
          var startPos = $t.selectionStart;
          var endPos = $t.selectionEnd;
          var scrollTop = $t.scrollTop;
          var sel = $t.value.substring(startPos, endPos);
          var header = $t.value.substring(0, startPos);
          var tail = $t.value.substring(endPos, $t.value.length);
          $t.value = header + before + sel + after + tail;
          if (arguments.length === 3) {
            if (sel.length === 0)
              $t.setSelectionRange(startPos + offset, startPos + offset);
            else
              $t.setSelectionRange(endPos + offset * 2, endPos + offset * 2);
          }
          this.focus();
        }
      },

      getSelectedText: function () {
        if (document.getSelection) {
          return document.getSelection();
        }
        else {
          if (document.selection) {
            var textRange = document.selection.createRange();
            return textRange.text;
          }
        }
      }
    });
  }(jQuery));
});

var refreshSlides = function (text, isnew = false) {
  var lines = text.split("\n");
  onWrite(lines, isnew);
};

// var preLineNumber = 1
// var isShowLineNumbers = false

// $.fn.toggleLineNumbers = function () {
//     isShowLineNumbers ? this.hideLineNumbers() : this.showLineNumbers()
//     isShowLineNumbers = !isShowLineNumbers
//     preLineNumber = this.lineCount()
// }

// $.fn.hideLineNumbers = function () {
//     $(this).css({ "left": "0px", "padding-left": "5px" })
//     $(this).parent().parent().append($(this).clone(true))
//     $(this).parent().remove()
// }

// $.fn.showLineNumbers = function () {
//     $(this).css({ "left": "40px", "padding-left": "45px" })
//     $(this).appendTo($('<div/>').addClass('lineContainer').insertBefore($(this)))
//     var numArea = $('<div/>').addClass('lineArea').attr('id', 'lineArea').insertBefore($(this))

//     preLineNumber = 0
//     addLineNumberNode(numArea, this.lineCount())

//     this.on('keydown', function (event) {
//         switch (event.keyCode) {
//             case 13: //enter
//                 addLineNumberNode(numArea, $(this).lineCount() + 1)
//                 break;
//             case 8: //backspace
//                 var nextLineNumber = $(this).lineCount()
//                 if (nextLineNumber < preLineNumber) {
//                     for (var n = preLineNumber; n > nextLineNumber; n--) {
//                         $('#lineArea').children(":last").remove()
//                         $('#lineArea').children(":last").remove()
//                     }
//                     preLineNumber = nextLineNumber
//                 }
//                 break;
//         }
//         scrollLineNumber(numArea, $(this))
//     })

//     this.on('mousedown scroll blur focus mouseover', () => {
//          scrollLineNumber(numArea, $(this))
//     })
// }

// $.fn.lineCount = function () {
//     return this.lines().length;
// }

// $.fn.lines = function () {
//     return this.val().split(/\n/)
// }

// function scrollLineNumber(lineNumber, editor) {
//     lineNumber.css('top', editor.scrollTop() * -1)
// }

// function addLineNumberNode(numArea, nextLineNumber) {
//     for (var n = preLineNumber + 1; n < nextLineNumber + 1; n++) {
//         $('<i>' + n + '</i><br/>').appendTo($('#lineArea'))
//     }
//     preLineNumber = nextLineNumber
// }
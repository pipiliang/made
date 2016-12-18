/**
 * Made - a markdown slide application
 * editor related function
 * Copyright (c) 2016-2020, liang wei. (MIT Licensed)
 * https://github.com/pipiliang/made
 */

$(document).ready(() => {
	hljs.initHighlightingOnLoad();
	var madeRenderer = new marked.Renderer();
	madeRenderer.blockquote = function(quote){
  			return '<p style="font-size:18px;"><i class="fa fa-quote-left" style="font-size:13px;color:lightgray;"></i>  ' 
  			+ quote.substring(3, quote.length - 5) 
  			+ '  <i class="fa fa-quote-right" style="font-size:13px;color:lightgray;"></i></p>';
		};

	madeRenderer.link = function(href, title, text){
  			return '<a target="_blank" href="' + href + '">' + text + '</a>';
		};

	marked.setOptions({
		highlight: function (code) {
			return self.hljs.highlightAuto(code).value;
		},
		gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        renderer: madeRenderer
	});

	var editor = MadeEditor.init()
	EditorToolBar.init(editor)
	MadeStatusBar.init()
})

var EditorToolBar = {
	init: (editor) => {
		$("#btnHeader").click(() => { editor.insertText('#')})
		$("#btnBold").click(() => { editor.toggleEnclose('**', '**', 2) })
		$("#btnItalic").click(() => { editor.toggleEnclose('*', '*', 1) })
		$("#btnStrike").click(() => { editor.toggleEnclose('~~', '~~', 2) })

		$("#btnOl").click(() => { editor.insertText('\n- ') })
		$("#btnUl").click(() => { editor.insertText('\n1. ') })
		$("#btnTable").click(() => { editor.insertText('|名称|备注|\n|----|:----:|\n|--|--|', 4) })
		$("#btnNew").click(() => { editor.insertText('\n---\n') })

		$("#btnCode").click(() => { editor.insertText('```\n\n```', 0, 1) })
		$("#btnQuote").click(() => { editor.insertText('>') })
		$("#btnLink").click(() => { editor.insertText('[](http://)', 1) })
		$("#btnImg").click(() => { editor.insertText('![](http://)', 1) })

		$("#btnQuestion").click(() => { openUrl('http://www.markdown.cn') })

		$("#btnBug").click(() => { openUrl('https://github.com/pipiliang/made/issues')})

		$("[data-toggle='tooltip']").tooltip()

		var openUrl = (url) => {
			isElectron ? ElectronMediator.openExternal(url) : window.open(url)
		}
	}
}

var MadeEditor = {

	init: () => {
		var editor = CodeMirror.fromTextArea(document.getElementById("writeArea"), {
			mode: 'markdown',
			lineNumbers: true,
			theme: "default",
			lineWrapping: "true",
			extraKeys: { "Enter": "newlineAndIndentContinueMarkdownList" }
		});

		editor.setSize('100%', '100%');
		var doc = editor.getDoc()

		MadeEditor.foucsIt(editor)

		if (isElectron) {
			var fs = require('fs')
			var router = MessageRouter.create()
			router.on('open', (event, message) => {
				console.log("open file: " + message)
				fs.readFile(message, 'utf8', function (err, data) {
					if (err) throw err
					editor.setValue(data)
					refreshSlides(data, true)
				})
			})

			router.on('save', (event, message) => {
				console.log("save file: " + message)
				fs.writeFile(message, editor.getValue(), function (err) {
					if (err) throw err
					console.log("File Saved !"); //文件被保存
				})
			})

			router.on('edit', (event, cmd) => {
				editor.execCommand(cmd)
			})

			router.on('editor-showLineNumbers', (event, msg) => {
				// $('#writeArea').toggleLineNumbers()
			})
		}

		editor.on('keyup', () => {
			refreshSlides(editor.getValue());
		})

		editor.on('cursorActivity', (i, e) => {
			var cursor = doc.getCursor();
			$('#position').html('行 ' + (cursor.line + 1) + ' 列 ' + (cursor.ch + 1))
		})

		editor.insertText = (data, cursorOffset = 0, lineOffset = 0) => {
			var cursor = doc.getCursor();
			doc.replaceRange(data, cursor);
			editor.focus()
			refreshSlides(editor.getValue());
			var cursor = doc.getCursor();
			doc.setCursor({
				line: cursor.line - lineOffset,
				ch: cursor.ch - cursorOffset
			})
		}

		editor.toggleEnclose = (before, after, cursorOffset = 0) => {
			var sel = doc.getSelection()
			if (sel.startWith(before) && sel.endWith(after)) {
				doc.replaceSelection(sel.substring(before.length, sel.length - after.length))
			} else {
				doc.replaceSelection(before + sel + after)
				if (sel.length == 0) {
					var cursor = doc.getCursor();
					doc.setCursor({
						line: cursor.line,
						ch: cursor.ch - cursorOffset
					})
				}
			}
			editor.focus()
			refreshSlides(editor.getValue());
		}

		return editor
	},

	foucsIt: (obj) => {
		if (obj.setSelectionRange) {
			setTimeout(() => {
				obj.setSelectionRange(0, 0)
				obj.focus()
			}, 100)
		} else {
			try { obj.focus() } catch (e) { }
		}
	}
}

var MadeStatusBar = {
	init: () => {
		EventPool.getInstance().add(Event.SLIDE_COUNT_CHANGED, (e) => {
			$('#pager').html('页 1/' + e.count)
		})
	}
}

$(() => {
	(($) => {
		$.fn.extend({
			insertText: function (v, offset) {
				var $t = $(this)[0];
				if ($t.selectionStart || $t.selectionStart == '0') {
					var startPos = $t.selectionStart;
					var endPos = $t.selectionEnd;
					var scrollTop = $t.scrollTop;
					$t.value = $t.value.substring(0, startPos) + v + $t.value.substring(endPos, $t.value.length);
					this.focus();
					$t.selectionStart = startPos + v.length;
					$t.selectionEnd = startPos + v.length;
					$t.scrollTop = scrollTop;
					if (arguments.length == 2) {
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
				if ($t.selectionStart || $t.selectionStart == '0') {
					var startPos = $t.selectionStart;
					var endPos = $t.selectionEnd;
					var scrollTop = $t.scrollTop;
					var sel = $t.value.substring(startPos, endPos)
					var header = $t.value.substring(0, startPos)
					var tail = $t.value.substring(endPos, $t.value.length)
					$t.value = header + before + sel + after + tail
					if (arguments.length == 3) {
						if (sel.length == 0)
							$t.setSelectionRange(startPos + offset, startPos + offset)
						else
							$t.setSelectionRange(endPos + offset * 2, endPos + offset * 2)
					}
					this.focus()
				}
			},

			getSelectedText: function () {
				if (document.getSelection) {
					return document.getSelection()
				}
				else {
					if (document.selection) {
						var textRange = document.selection.createRange()
						return textRange.text
					}
				}
			}
		})
	})(jQuery);
});

var refreshSlides = (text, isnew = false) => {
	onWrite(text, isnew)
}
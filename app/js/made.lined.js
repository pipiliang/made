var preLineNumber = 1
var isShowLineNumbers = false

$.fn.toggleLineNumbers = function () {
    isShowLineNumbers ? this.hideLineNumbers() : this.showLineNumbers()
    isShowLineNumbers = !isShowLineNumbers
    preLineNumber = this.lineCount()
}

$.fn.hideLineNumbers = function () {
    $(this).css({ "left": "0px", "padding-left": "5px" })
    $(this).parent().parent().append($(this).clone(true))
    $(this).parent().remove()
}

$.fn.showLineNumbers = function () {
    $(this).css({ "left": "40px", "padding-left": "45px" })
    $(this).appendTo($('<div/>').addClass('lineContainer').insertBefore($(this)))
    var numArea = $('<div/>').addClass('lineArea').attr('id', 'lineArea').insertBefore($(this))

    preLineNumber = 0
    addLineNumberNode(numArea, this.lineCount())

    this.on('keydown', function (event) {
        switch (event.keyCode) {
            case 13: //enter
                addLineNumberNode(numArea, $(this).lineCount() + 1)
                break;
            case 8: //backspace
                var nextLineNumber = $(this).lineCount()
                if (nextLineNumber < preLineNumber) {
                    for (var n = preLineNumber; n > nextLineNumber; n--) {
                        $('#lineArea').children(":last").remove()
                        $('#lineArea').children(":last").remove()
                    }
                    preLineNumber = nextLineNumber
                }
                break;
        }
        scrollLineNumber(numArea, $(this))
    })

    this.on('mousedown scroll blur focus mouseover', () => {
         scrollLineNumber(numArea, $(this))
    })
}

$.fn.lineCount = function () {
    return this.lines().length;
}

$.fn.lines = function () {
    return this.val().split(/\n/)
}

function scrollLineNumber(lineNumber, editor) {
    lineNumber.css('top', editor.scrollTop() * -1)
}

function addLineNumberNode(numArea, nextLineNumber) {
    for (var n = preLineNumber + 1; n < nextLineNumber + 1; n++) {
        $('<i>' + n + '</i><br/>').appendTo($('#lineArea'))
    }
    preLineNumber = nextLineNumber
}

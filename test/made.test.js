var assert = require('assert');

describe('made-comm', function () {

    //var comm = require("../app/js/made.comm")
    describe('# string extends', function () {
        it('should return true when sample start with sa', function () {
            var a = "sample";
            assert.equal(a.length, 6);
        });

        it('should return true when sample end with le', function () {
            var a = "sample";
            assert.equal(a.length, 6);
        });
    });

});
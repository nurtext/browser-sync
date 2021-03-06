"use strict";

var browserSync = require("../../../index");

var request = require("supertest");
var _       = require("lodash");
var assert  = require("chai").assert;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

describe("E2E TLS server test", function () {

    this.timeout(15000);

    var instance;

    before(function (done) {

        this.timeout(15000);

        var config = {
            server: {
                baseDir: "test/fixtures"
            },
            https: true,
            debugInfo: false,
            open: false
        };

        instance = browserSync.init(config, done);
    });

    after(function () {
        instance.cleanup();
    });

    it("serves files with the snippet added", function (done) {

        assert.isString(instance.options.snippet);

        request(instance.server)
            .get("/index.html")
            .set("accept", "text/html")
            .expect(200)
            .end(function (err, res) {
                assert.isTrue(_.contains(res.text, instance.options.snippet));
                done();
            });
    });

    it("serves the client script", function (done) {

        request(instance.server)
            .get(instance.options.scriptPaths.versioned)
            .expect(200)
            .end(function (err, res) {
                assert.isTrue(_.contains(res.text, "Connected to BrowserSync"));
                done();
            });
    });
});
"use strict";

var pmongo = require('promised-mongo');
var DataSourceMongo = require('../lib/data-source-mongo');
var Forester = require('../lib/forester.js');
var testData = require('./test-crud.json');
var request = require('supertest');
var assert = require('assert');
var should = require('should');


var connString = 'mongodb://forester_db_1:27017/forester_test';
var port = 3100;
var host = 'http://localhost:' + port;

describe('forester crud', function () {

    var db;
    var items;
    var app;

    before('generate db', async function (done) {
        db = pmongo(connString);
        await db.dropDatabase();

        items = await db.collection('users').insert(testData["userData"]);

        items = items.map(function(item){
            item._id = item._id.toString();
            return item;
        });

        console.log("qui", items);

        done();
    });

    before('start forester', async function (done) {

        app = new Forester();

        app.registerCollection(testData["collectionArticles"]);
        app.registerCollection(testData["collectionUsers"]);
        app.registerDataSource(testData["dataSource"]);
        app.registerMappings(testData["mappings"]);

        app.boot();

        await app.listen({port: port});

        done();
    });


    it('should return home', function (done) {

        request(host)
            .get('/')
            .set('Accept', 'application/json')
            .expect('Content-Type', '/json/')
            .expect(200)
            .end(function (err, res) {
                //console.log(res);
                //assert.ok(res.body === 'Hello! This is Forester!')
                done();
            });


    });



    it('should return users', function (done) {
        request(host)
            .get('/users')
            .set('Accept', 'application/json')
            .expect(200, items, done);
    });



    after('stop server', async function (done) {
        await app.close();
        done();
    });


});


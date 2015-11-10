"use strict";

var pmongo = require('promised-mongo');
var DataSourceMongo = require('../lib/data-source-mongo');
var Forester = require('../lib/forester.js');
var request = require('supertest');
var assert = require('assert');
var should = require('should');


var connString = 'mongodb://forester_db_1:27017/forester_test';
var port = 3100;
var host = 'http://localhost:' + port;

describe('forester crud', function () {

    var db;
    var app;

    var users;
    var articles;

    before('generate db', async function (done) {
        db = pmongo(connString);
        await db.dropDatabase();

        users = await db.collection('users').insert(require('./fixture/sample-users.json'));
        articles = await db.collection('articles').insert(require('./fixture/sample-articles.json'));

        users = users.map(function (item) {
            item._id = item._id.toString();
            return item;
        });

        articles = articles.map(function (item) {
            item._id = item._id.toString();
            return item;
        });


        users[0].bestArticleId = articles[0]._id;
        await db.collection('users').findAndModify({
            query: {_id: new pmongo.ObjectId(users[0]._id)},
            update: {$set: {bestArticleId: articles[0]._id}}
        });


        await db.collection('joinArticlesUsers').insert([
            {articleId: articles[0]._id, userId: users[0]._id},
            {articleId: articles[0]._id, userId: users[1]._id},
            {articleId: articles[2]._id, userId: users[2]._id}
        ]);

        done();
    });

    before('start forester', async function (done) {

        app = new Forester();

        app.registerCollection(require('./fixture/join-articles-users.json'));
        app.registerCollection(require('./fixture/articles.json'));
        app.registerCollection(require('./fixture/users.json'));
        app.registerDataSource(require('./fixture/db1.json'));
        app.registerMappings(require('./fixture/mappings.json'));

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
            .expect(200, users, done);
    });


    it('should return bestArticle (hasOne)', function (done) {
        request(host)
            .get('/users/'+users[0]._id + '/bestArticle')
            .set('Accept', 'application/json')
            .expect(200, articles[0], done);
    });

    it('should return likedArticle (hasAndBelongsToMany from users)', function (done) {
        request(host)
            .get('/users/'+users[0]._id + '/likedArticles')
            .set('Accept', 'application/json')
            .expect(200, articles[0], done);
    });



    after('stop server', async function (done) {
        await app.close();
        done();
    });


});

"use strict";

var pmongo = require('promised-mongo');
var DataSourceMongo = require('../lib/data-source-mongo');
var test = require('ava');

var mongoUri = 'mongodb://forester_db_1:27017';
var testCollectionName = 'myTestCollection';

function getTestObj() {

    var random = (0 | Math.random() * 9e6).toString(36);
    var connString = mongoUri + '/' + random;

    var ds = new DataSourceMongo(connString, testCollectionName),
        db = pmongo(connString),
        collection = db.collection(testCollectionName);

    ds.updateSchema();

    return [ds, db, collection];
}


test('updateSchema', async function (t) {

    var [ds, db, collection] = getTestObj();

    t.not((await db.getCollectionNames()).indexOf(testCollectionName), -1, 'exists collection');

    db.dropDatabase();
    t.end();
});


test('findAll', async function (t) {

    var [ds, db, collection] = getTestObj();

    var items = await ds.findAll({});
    t.is(items.length, 0, 'expect empty');

    var objs = [];
    for (var i = 1; i <= 200; i++) {
        objs.push({"name": i});
    }
    await collection.insert(objs);


    var items = await ds.findAll({});
    t.is(items.length, 200, 'expect 200 items');

    var items = await ds.findAll({'orderBy': {'name': 'ASC'}});
    t.is(items.length, 200, 'expect 200 items');
    t.is(items[0].name, 1, 'expect asc');

    var items = await ds.findAll({'orderBy': {'name': 'DESC'}});
    t.is(items.length, 200, 'expect 200 items');
    t.is(items[200 - 1].name, 200, 'expect desc');

    var items = await ds.findAll({'page': 1, 'perPage': 20});
    t.is(items.length, 20, 'expect page 1');
    t.is(items[0].name, 1, 'expect first record page 1');

    var items = await ds.findAll({'page': 2, 'perPage': 20});
    t.is(items.length, 20, 'expect page 2');
    t.is(items[0].name, 21, 'expect first record page 2');

    db.dropDatabase();
    t.end();
});


test('findById', async function (t) {

    var [ds, db, collection] = getTestObj();

    var testItem = await collection.insert({"name": "abcdef"});
    var item = await ds.findById(testItem._id);

    t.is(testItem.name, item.name);

    db.dropDatabase();
    t.end();
});

test('create', async function (t) {

    var [ds, db, collection] = getTestObj();

    var testObj = {"name": "footoo"};

    var item = await ds.create(testObj);

    var items = await collection.find();

    t.is(items.length, 1);
    t.is(testObj.name, items[0].name);

    db.dropDatabase();
    t.end();
});


test('update', async function (t) {

    var [ds, db, collection] = getTestObj();

    var item = await collection.insert({"name": "footoo"});
    t.is((await collection.findOne()).name, "footoo");

    ds.update(item._id, {"name": "qwerty"});
    t.is((await collection.findOne()).name, "qwerty");

    db.dropDatabase();
    t.end();
});


test('destroy', async function (t) {

    var [ds, db, collection] = getTestObj();

    var testItem = await collection.insert({"name": "abcdef"});

    t.is((await collection.find()).length, 1);
    await ds.destroy(testItem._id);
    t.is((await collection.find()).length, 0);

    db.dropDatabase();
    t.end();
});
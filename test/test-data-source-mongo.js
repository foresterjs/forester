"use strict";

var pmongo = require('promised-mongo');
var DataSourceMongo = require('../lib/data-source-mongo');
var test = require('ava');

var mongoUri = 'mongodb://forester_db_1:27017';

const TEST_COLL = 'myTestCollection';

function getTestObj() {

    var random = (0 | Math.random() * 9e6).toString(36);
    var connString = mongoUri + '/' + random;

    var ds = new DataSourceMongo(connString),
        db = pmongo(connString);

    ds.updateSchema(TEST_COLL);

    return [ds, db];
}


test('updateSchema', async function (t) {

    var [ds, db] = getTestObj(TEST_COLL);

    t.not((await db.getCollectionNames()).indexOf(TEST_COLL), -1, 'exists collection');

    db.dropDatabase();
    t.end();
});


test('findAll', async function (t) {

    var [ds, db] = getTestObj();

    var items = await ds.findAll({});
    t.is(items.length, 0, 'expect empty');

    var objs = [];
    for (var i = 1; i <= 200; i++) {
        objs.push({"name": i});
    }
    await db.collection(TEST_COLL).insert(objs);


    var items = await ds.findAll(TEST_COLL,{});
    t.is(items.length, 200, 'expect 200 items');

    var items = await ds.findAll(TEST_COLL,{'orderBy': {'name': 'ASC'}});
    t.is(items.length, 200, 'expect 200 items');
    t.is(items[0].name, 1, 'expect asc');

    var items = await ds.findAll(TEST_COLL,{'orderBy': {'name': 'DESC'}});
    t.is(items.length, 200, 'expect 200 items');
    t.is(items[200 - 1].name, 200, 'expect desc');

    var items = await ds.findAll(TEST_COLL,{'page': 1, 'perPage': 20});
    t.is(items.length, 20, 'expect page 1');
    t.is(items[0].name, 1, 'expect first record page 1');

    var items = await ds.findAll(TEST_COLL, {'page': 2, 'perPage': 20});
    t.is(items.length, 20, 'expect page 2');
    t.is(items[0].name, 21, 'expect first record page 2');

    db.dropDatabase();
    t.end();
});


test('findById', async function (t) {

    var [ds, db] = getTestObj();

    var testItem = await db.collection(TEST_COLL).insert({"name": "abcdef"});
    var item = await ds.findById(TEST_COLL, testItem._id);

    t.is(testItem.name, item.name);

    db.dropDatabase();
    t.end();
});

test('create', async function (t) {

    var [ds, db] = getTestObj();

    var testObj = {"name": "footoo"};

    var item = await ds.create(TEST_COLL, testObj);

    var items = await db.collection(TEST_COLL).find();

    t.is(items.length, 1);
    t.is(testObj.name, items[0].name);

    db.dropDatabase();
    t.end();
});


test('update', async function (t) {

    var [ds, db] = getTestObj();

    var item = await db.collection(TEST_COLL).insert({"name": "footoo"});
    t.is((await db.collection(TEST_COLL).findOne()).name, "footoo");

    ds.update(TEST_COLL, item._id, {"name": "qwerty"});
    t.is((await db.collection(TEST_COLL).findOne()).name, "qwerty");

    db.dropDatabase();
    t.end();
});


test('destroy', async function (t) {

    var [ds, db] = getTestObj();

    var testItem = await db.collection(TEST_COLL).insert({"name": "abcdef"});

    t.is((await db.collection(TEST_COLL).find()).length, 1);
    await ds.destroy(TEST_COLL, testItem._id);
    t.is((await db.collection(TEST_COLL).find()).length, 0);

    db.dropDatabase();
    t.end();
});

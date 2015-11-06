'use strict';

var Collection = require('./collection');
var Rest = require('./rest');
var DataSourceMongo = require('./data-source-mongo');
var koa = require('koa');
var router = require('koa-router');
var serve = require('koa-static');
var mount = require('koa-mount');
var bodyParser = require('koa-bodyparser');
var pluginAccounting = require('../accounting/plugin');
var middlewaresCommon = require('./middlewares/common');

class Forester {

  constructor() {
    this.collections = {};
    this.dataSources = {};
    this.rest = undefined;
    this.koa = koa();
    this.koa.experimental = true;
    this.koa.use(bodyParser());

    this.config = {
      "dataSources": [],
      "collections": [],
      "mappings": []
    };
  }

  registerDataSource(options) {
    this.config.dataSources[options.name] = options;
  }

  registerDataSources(datasources) {
    datasources.forEach(this.registerDataSource.bind(this));
  }

  registerCollection(options) {
    this.config.collections[options.name] = options;
  }

  registerCollections(collections) {
    collections.forEach(this.registerCollection.bind(this));
  }

  registerMapping(options) {
    this.config.mappings.push(options);
  }

  registerMappings(mappings) {
    mappings.forEach(this.registerMapping.bind(this));
  }

  init() {
    //init data source config
    var dataSourcesConfig = this.config.dataSources;
    for (var dataSourceName in dataSourcesConfig) {
      this.dataSources[dataSourceName] = new DataSourceMongo(dataSourcesConfig[dataSourceName].options);
    }

    //init collections and endpoints
    var collectionsConfig = this.config.collections;
    for (var collectionName in collectionsConfig) {
      this.collections[collectionName] = new Collection({"collectionSchema": collectionsConfig[collectionName]});
    }

    //connect data source with config
    this.config.mappings.forEach(mapping => {
      var collName = mapping.collection;
      var dsName = mapping.datasource;

      this.collections[collName].dataSource = this.dataSources[dsName];
    });
  }

  boot() {

    this.plugin(pluginAccounting);

    this.init();


    this.rest = new Rest(this);

    var routes = router();

    this.koa.use(mount('/explorer', serve(__dirname + '/../explorer')));
    routes.get('/schema', middlewaresCommon.schema({collections: this.collections, rest: this.rest}));
    routes.get('/', middlewaresCommon.hello() );

    this.koa.use(routes.routes());

    console.log("Forester is ready!");
  }

  plugin(plugin){
    plugin(this);
  }

  listen({port}) {
    return new Promise((resolve, reject) => {
      this.server = this.koa.listen(port, function (err) {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.server.close(function (err) {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }
}

module.exports = Forester;

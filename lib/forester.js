'use strict';

var Collection = require('./collection');
var Rest = require('./rest');
var Ac = require('./defender');
var DataSourceMongo = require('./data-source-mongo');
var koa = require('koa');
var router = require('koa-router');
var serve = require('koa-static');
var mount = require('koa-mount');
var jsonBody = require('./koa-json-body');

class Forester {

  constructor() {
    this.collections = {};
    this.dataSources = {};
    this.mappings = [];
    this.config = {};

    this.koa = koa();
    this.koa.experimental = true;
    jsonBody(this.koa);
    this.rest = new Rest(this);
    this.acl = new Ac(this);
  }

  registerDataSource({name, adapter, options}) {
    return this.dataSources[name] = new DataSourceMongo(options);
  }

  registerDataSources(datasources) {
    datasources.forEach(this.registerDataSource.bind(this));
  }

  registerCollection(collectionSchema) {
    return this.collections[collectionSchema.name] = new Collection({collectionSchema});
  }

  registerCollections(collections) {
    collections.forEach(this.registerCollection.bind(this));
  }

  registerMapping(mapping) {
    this.mappings.push(mapping);
    return mapping;
  }

  registerMappings(mappings) {
    mappings.forEach(this.registerMapping.bind(this));
  }

  registerStaticRoute({route, path}) {
    if(route)
      this.koa.use(mount(route, serve(path)));
    else
      this.koa.use(serve(path));
  }

  registerEndpoint(options){
    this.rest.registerEndpoint(options);
  }

  registerConfig(key, config){
    this.config[key] = config;
  }

  initCollections() {
    this.mappings.forEach(({collection, datasource}) => {
      var collectionObj = this.collections[collection];
      var dataSourceObj = this.dataSources[datasource];

      if (!collectionObj) throw new Error('Mapping err: Collection ' + collection + ' not defined or registered');
      if (!dataSourceObj) throw new Error('Mapping err: Datasource ' + datasource + ' not defined or registered');

      collectionObj.dataSource = dataSourceObj;
    });

    for (var collectionName in this.collections) {
      var collectionObj = this.collections[collectionName];
      if (!collectionObj.dataSource) {
        throw new Error('Collection err: Collection ' + collectionName + ' is not mapped to any datasource');
      }
    }
  }

  initPlugins(){
    this.use(require('../plugins/explorer/plugin.js'));
  }

  async boot() {

    this.initPlugins();
    this.initCollections();
    this.rest.boot();
    this.acl.boot();

    this.koa.use(
      router().get('/', async function (next) {
        this.body = ['Hello! This is Forester!'];
        await next;
      })
        .routes());

    console.log("Forester is ready!");
  }

  use(plugin){
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

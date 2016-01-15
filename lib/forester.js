'use strict';

var Collection = require('./collection');
var Rest = require('./rest');
var Defender = require('./defender');
var DataSourceMongo = require('./data-source-mongo');
var koa = require('koa');
const router = require('koa-simple-router');
const convert = require('koa-convert');
var serve = require('koa-static');
var mount = require('koa-mount');
var bodyParser = require('koa-bodyparser');
const qs = require('koa-qs');
const assert = require("assert");
const compose = require("koa-compose");
const koaSend = require("koa-send");

class Forester {

  constructor() {
    this.collections = {};
    this.dataSources = {};
    this.mappings = [];
    this.dataSourceDrivers = {
      'mongo' : DataSourceMongo
    };

    this.koa = new koa();
    this.koa.use(bodyParser());
    qs(this.koa);
    this.rest = new Rest(this);
  }

  registerDataSource({name, adapter, options}) {
    var driver = this.dataSourceDrivers[adapter];
    if(!driver) throw new Error(adapter + ' is not supported');

    return this.dataSources[name] = new driver(options);
  }

  registerDataSources(datasources) {
    datasources.forEach(this.registerDataSource.bind(this));
  }

  registerCollection(collectionSchema) {
    return this.collections[collectionSchema.name] = new Collection({
      collectionSchema,
      collections: this.collections
    });
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

  registerStaticRoute({route = "/", path, failback}) {

    assert(path, "Path not defined");

    var failbackMiddleware = convert(function *() {
      if (this.body) return;

      try {
        yield koaSend(this, failback, {root: path});
      } catch (e) {
        console.log(e)
      }
      console.log(this.body);
    });

    var serveMiddleware = convert(serve(path));

    if (failback) {
      this.koa.use(mount(route, compose([serveMiddleware, failbackMiddleware])));
    } else {
      this.koa.use(mount(route, serveMiddleware));
    }

  }

  registerEndpoint(options) {
    this.rest.registerEndpoint(options);
  }

  registerCheckMethod(name, middleware){

    Defender.registerCheckMethod(name, middleware);

  }

  registerDataSourceDriver(name, driver){
    this.dataSourceDrivers[name] = driver;
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

  async boot() {

    this.initCollections();
    this.rest.boot();

    this.koa.use(
      router(_ => {
        _.get('/', async function (ctx, next) {
          ctx.body = ['Hello! This is Forester!'];
          await next();
        });
      })
    );

    console.log("Forester is ready!");
  }

  use(plugin) {
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

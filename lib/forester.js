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

var builtinSchemas = [
  require("../collections/_users.json"),
  require("../collections/_tokens.json")
];
var loginMiddleware = require('./auth-middlewares/login');

class Forester {

  constructor() {
    this.collections = {};
    this.dataSources = {};
    this.mappings = [];
    this.config = {};

    this.koa = new koa();
    this.koa.use(bodyParser());
    qs(this.koa);
    this.rest = new Rest(this);
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
      this.koa.use(convert(mount(route, serve(path))));
    else
      this.koa.use(convert(serve(path)));

  }

  registerEndpoint(options) {
    this.rest.registerEndpoint(options);
  }

  registerConfig(key, config) {
    this.config[key] = config;
  }

  registerCheckMethod(name, middleware){

    Defender.registerCheckMethod(name, middleware);

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

  initPlugins() {
    this.use(require('../plugins/explorer/plugin.js'));
  }

  initDefenderRoutes() {
    loginMiddleware(this);
  }

  async boot() {

    this.initPlugins();
    this.registerCollections(builtinSchemas);
    this.initCollections();
    this.rest.boot();
    this.initDefenderRoutes();

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

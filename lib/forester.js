'use strict';

var Collection = require('./collection'),
    Rest = require('./rest'),
    DataSourceMongo = require('./data-source-mongo'),
    koaBody   = require('koa-body');

class Forester {

    constructor() {
        this.collections = {};
        this.dataSources = {};
        this.endpoints = {};

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
        datasources.forEach(this.registerDataSource);
    }

    registerCollection(options) {
        this.config.collections[options.name] = options;
    }

    registerCollections(collections) {
        collections.forEach(this.registerCollection);
    }

    registerMapping(options) {
        this.config.mappings.push(options);
    }

    registerMappings(mappings) {
        mappings.forEach(this.registerMapping);
    }

    init(){
        //init data source config
        var dataSourcesConfig = this.config.dataSources;
        for (var dataSourceName in dataSourcesConfig) {
            this.dataSources[dataSourceName] = new DataSourceMongo(dataSourcesConfig[dataSourceName].options);
        }

        //init collections and endpoints
        var collectionsConfig = this.config.collections;
        for (var collectionName in collectionsConfig) {
            this.collections[collectionName] = new Collection({"collectionSchema": collectionsConfig[collectionName]});
            this.endpoints[collectionName] = new Rest({"collection": this.collections[collectionName]});
        }

        //connect data source with config
        this.config.mappings.forEach(mapping => {
            var collName = mapping.collection;
            var dsName = mapping.datasource;

            this.collections[collName].dataSource = this.dataSources[dsName];
        });
    }

    boot(app) {

        this.init();

        app.use(koaBody());

        for (var endpointName in this.endpoints) {
            app.use(this.endpoints[endpointName].middleware());
        }

        console.log("Forester is ready!");
    }
}

module.exports = Forester;
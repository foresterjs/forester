'use strict';

var Collection = require('./collection');
var Rest = require('./rest');
var DataSourceMongo = require('./data-source-mongo');
var express = require('express');
var bodyParser = require('body-parser');

class Forester {

    constructor() {
        this.collections = {};
        this.dataSources = {};
        this.endpoints = {};
        this.express = express();

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

    boot() {

        this.init();

        this.express.use(bodyParser.urlencoded({ extended: false }));

        for (var endpointName in this.endpoints) {
            this.express.use('/' + endpointName, this.endpoints[endpointName].express);
        }

        this.express.get('/', function (req, res) {
            res.send('Hello! This is Forester!');
        });

        console.log("Forester is ready!");
    }

    listen(port) {
        this.express.listen(port);
    }
}

module.exports = Forester;
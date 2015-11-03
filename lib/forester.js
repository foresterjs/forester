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
        this.rest = undefined;
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

        this.init();

        this.express.use(bodyParser.urlencoded({extended: false}));
        this.express.use(bodyParser.json());

        this.rest = new Rest(this);

        this.express.get('/schema', (req, res) => {

            var routesDescription= {};

            for(var collectionName in this.collections){
                var collectionSchema = this.collections[collectionName].schema;
                routesDescription[collectionName] = {
                    "properties": collectionSchema.properties,
                    "relations": collectionSchema.relations,
                    "routes": this.rest.routesDescription[collectionName] || []
                };
            }

            res.json(routesDescription);
        });

        this.express.use('/explorer', express.static(__dirname + '/../explorer'));

        this.express.get('/', function (req, res) {
            res.send('Hello! This is Forester!');
        });

        console.log("Forester is ready!");
    }

    listen({port}) {
        return new Promise((resolve, reject) => {
            this.server = this.express.listen(port, function(err){
                if(err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }

    close(callback) {
        return new Promise((resolve, reject) =>{
            this.server.close(function(err){
                if(err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }
}

module.exports = Forester;
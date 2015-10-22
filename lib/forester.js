'use strict';

class Forester {

    constructor() {
        this.collections = {};
        this.dataSources = {};
    }

    registerDataSource(dataSource) {
        var dataSourceName = dataSource.name;
        this.dataSources[dataSourceName] = new DataSourceMongo(dataSource.options);
    }

    registerCollection(collectionSchema) {
        var collectionName = collectionSchema.name;
        this.collections[collectionName] = new Collection(collectionSchema);
    }

    registerMapping({collection, dataSource}) {
        this.collections[collectionName].dataSource = this.dataSources[dataSourceName];
    }

    boot() {
        
    }
}
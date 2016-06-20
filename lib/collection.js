'use strict';

var EventEmitter = require('events');
var Sanitizer = require('./sanitizer');
var Defender = require('./defender');

import Validator from './validator';

class Collection {

  constructor({dataSource, collectionSchema, collections}) {

    this.defaults = {
      page: 1,
      perPage: 20
    };

    this.dataSource = dataSource;
    this.collectionSchema = collectionSchema;
    this.collections = collections;
    this.eventEmitter = new EventEmitter();

    this.sanitizer = new Sanitizer(this.schema.properties);
    this.validator = new Validator(this.schema.properties);
    this.defender = new Defender(this);
  }

  get name() {
    return this.collectionSchema.name;
  }

  get schema() {
    return this.collectionSchema;
  }

  addMethod(name, handler) {
    this[name] = handler.bind(this);
  }

  async findAll({ where, orderBy, columns, page, perPage, include}) {
    var options = arguments[0];

    options.page = parseInt(options.page) || this.defaults.page;
    options.perPage = parseInt(options.perPage) || this.defaults.perPage;

    this.eventEmitter.emit('findAll:before', options);
    var items = await this.dataSource.findAll(this.name, options);
    if (include) items = await this.solveInclude(items, include);
    this.eventEmitter.emit('findAll:after', options, items);

    return items;
  }

  async pick(id, { include } = {}) {
    this.eventEmitter.emit('pick:before', id);
    var item = await this.dataSource.pick(this.name, id);
    if (item && include) item = await this.solveInclude(item, include);
    this.eventEmitter.emit('pick:after', id, item);

    return item;
  }

  async create(data) {

    this.eventEmitter.emit('create:before', data);
    data = await this.sanitizer.sanitize(data);

    var validation = await this.validator.validate(data);

    if (validation) {
      var item = await this.dataSource.create(this.name, data);
      this.eventEmitter.emit('create:after', data, item);
      return item;
    }
  }

  async update(id, data) {

    this.eventEmitter.emit('update:before', data);
    data = await this.sanitizer.sanitize(data);

    var validation = await this.validator.validate(data);

    if (validation) {
      var item = await this.dataSource.update(this.name, id, data);
      this.eventEmitter.emit('update:after', data, item);
      return item;
    }
  }

  async destroy(id) {

    this.eventEmitter.emit('destroy:before', id);
    var result = await this.dataSource.destroy(this.name, id);
    this.eventEmitter.emit('destroy:after', id, result);
    return result;

  }

  async exists(id) {
    this.eventEmitter.emit('exists:before', id);
    var exists = await this.dataSource.exists(this.name, id);
    this.eventEmitter.emit('exists:after', id, exists);
    return exists;
  }

  async count(where = {}) {

    var count = await this.dataSource.count(this.name, where);
    return count;
  }

  async findOrPickThroughRelation(item, relation) {
    var relationsSchema = this.schema.relations;
    var relationSchema = relationsSchema[relation];

    var type = relationSchema.type;
    var foreignKey = relationSchema.foreignKey;
    var foreignCollection = this.collections[relationSchema.collection];

    var relationsMethods = {
      belongsTo: function(){
        var id = item[foreignKey];
        return id ? foreignCollection.pick(id) : {};
      },
      hasMany: function(){
        var where = {[foreignKey]: item.id};
        return foreignCollection.findAll({where});
      },
      hasOne: function(){
        //TODO
        throw new Error('not implemented yet');
      },
      hasAndBelongsToMany: function(){
        //TODO
        throw new Error('not implemented yet');
      },
      hasManyThrough: function(){
        //TODO
        throw new Error('not implemented yet');
      }
    };

    return await relationsMethods[type]();

  }

  async solveInclude(item, include) {

    if (Array.isArray(item)) {
      for (var j = 0; j < item.length; j++) {
        await this.solveInclude(item[j], include);
      }
      return item;
    }

    for (var i = 0; i < include.length; i++) {
      var relation = include[i];
      item[relation] = await this.findOrPickThroughRelation(item, relation);
    }

    return item;
  }

  on(event, callback) {
    this.eventEmitter.on(event, callback);
  }
}

module.exports = Collection;

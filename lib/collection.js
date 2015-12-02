'use strict';

var EventEmitter = require('events'),
  Sanitizer = require('./sanitizer');
var Defender = require('./defender');

import Validator from './validator';

class Collection {

  constructor({dataSource, collectionSchema}) {

    this.defaults = {
      page: 1,
      perPage: 20
    };

    this.dataSource = dataSource;
    this.collectionSchema = collectionSchema;
    this.eventEmitter = new EventEmitter();

    this.sanitizer = new Sanitizer(); //TODO construct and inject config
    this.validator = new Validator(this.schema);
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

  async findAll({ where, orderBy, columns, page, perPage}) {
    var options = arguments[0];

    options.page = options.page || this.defaults.page;
    options.perPage = options.perPage || this.defaults.perPage;

    this.eventEmitter.emit('findAll:before', options);
    var items = await this.dataSource.findAll(this.name, options);
    this.eventEmitter.emit('findAll:after', options, items);

    return items;
  }

  async pick(id) {
    this.eventEmitter.emit('pick:before', id);
    var item = await this.dataSource.pick(this.name, id);
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

  async bulkUpdate(change, where) {
    //TODO
  }

  async bulkDestroy(where) {
    //TODO
  }

  on(event, callback) {
    this.eventEmitter.on(event, callback);
  }
}

module.exports = Collection;

'use strict';

const schemata = require('schemata');

class Sanitizer {

  constructor(collectionSchema) {
    this.collectionSchema = collectionSchema;

    var cleanSchema = {};

    for (var propertyName in collectionSchema.properties) {

      var propertySchema = collectionSchema.properties[propertyName];
      var type = propertySchema.type;

      cleanSchema[propertyName] = {
        type: Sanitizer.string2object(type)
      };

      if (propertySchema.hasOwnProperty('default')) {
        cleanSchema[propertyName].defaultValue = propertySchema.default;
      }
    }

    this.cleanSchemata = schemata(cleanSchema);

  }

  async sanitize(data) {

    //strip unknown properties is implicit
    data = this.cleanSchemata.makeDefault(data);

    return data;
  }

  static string2object(string) {
    var typeMapping = {
      "boolean": Boolean,
      "number": Number,
      "string": String,
      "object": Object,
      "date": Date,
      "array": Array
    };

    var type = typeMapping[string.toLowerCase()];
    if (!type) {
      throw new Error(string + ' object is not supported');
    }

    return type;
  }

}

module.exports = Sanitizer;

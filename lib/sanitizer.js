'use strict';

const traverse = require('traverse');

class Sanitizer {

  constructor(schema) {
    this.schema = schema;
    this.traversableSchema = traverse(schema);
  }

  sanitize(data) {

    var output = {};

    var traversableData = traverse(data);
    var traversableOutput = traverse(output);

    this.traversableSchema.forEach(function (subschema) {

      var node = this;
      if (node.isRoot || node.isLeaf) return;

      var value = traversableData.get(node.path);

      value = Sanitizer.isPrimitiveValue(value) ? value : subschema.default;

      if (Sanitizer.isPrimitiveValue(value))
        traversableOutput.set(this.path, value);
    });

    return output;
  }

  static isPrimitiveValue(value) {

    return ['boolean', 'number', 'string'].indexOf(typeof value) >= 0;

  }

}

module.exports = Sanitizer;

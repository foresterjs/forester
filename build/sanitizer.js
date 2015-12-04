'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

const traverse = require('traverse');

let Sanitizer = (function () {
  function Sanitizer(schema) {
    _classCallCheck(this, Sanitizer);

    this.schema = schema;
    this.traversableSchema = traverse(schema);
  }

  _createClass(Sanitizer, [{
    key: 'sanitize',
    value: function sanitize(data) {

      var output = {};

      var traversableData = traverse(data);
      var traversableOutput = traverse(output);

      this.traversableSchema.forEach(function (subschema) {

        var node = this;
        if (node.isRoot || node.isLeaf) return;

        var value = traversableData.get(node.path);

        value = Sanitizer.isPrimitiveValue(value) ? value : subschema.default;

        if (Sanitizer.isPrimitiveValue(value)) traversableOutput.set(this.path, value);
      });

      return output;
    }
  }], [{
    key: 'isPrimitiveValue',
    value: function isPrimitiveValue(value) {

      return ['boolean', 'number', 'string'].indexOf(typeof value) >= 0;
    }
  }]);

  return Sanitizer;
})();

module.exports = Sanitizer;
//# sourceMappingURL=sanitizer.js.map
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mschema = require('mschema');

var _mschema2 = _interopRequireDefault(_mschema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

const ValidationFail = require('./validation-fail');

let Validator = (function () {
  function Validator(schema) {
    _classCallCheck(this, Validator);

    this.schema = schema;
  }

  _createClass(Validator, [{
    key: 'validate',
    value: (function () {
      var ref = _asyncToGenerator(function* (data) {

        let validationResult = _mschema2.default.validate(data, this.schema);

        if (validationResult.valid) return true;

        let errors = {};
        validationResult.errors.forEach(function (err) {
          errors[err.property] = errors[err.property] || [];
          errors[err.property].push(err.message);
        });

        throw new ValidationFail(errors);
      });

      return function validate(_x) {
        return ref.apply(this, arguments);
      };
    })()
  }]);

  return Validator;
})();

exports.default = Validator;
//# sourceMappingURL=validator.js.map
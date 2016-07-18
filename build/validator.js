'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mschema = require('mschema');

var _mschema2 = _interopRequireDefault(_mschema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValidationFail = require('./validation-fail');

var Validator = function () {
  function Validator(schema) {
    _classCallCheck(this, Validator);

    this.schema = schema;
  }

  _createClass(Validator, [{
    key: 'validate',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(data) {
        var validationResult, errors;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                validationResult = _mschema2.default.validate(data, this.schema);

                if (!validationResult.valid) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt('return', true);

              case 3:
                errors = {};

                validationResult.errors.forEach(function (err) {
                  errors[err.property] = errors[err.property] || [];
                  errors[err.property].push(err.message);
                });

                throw new ValidationFail(errors);

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function validate(_x) {
        return _ref.apply(this, arguments);
      }

      return validate;
    }()
  }]);

  return Validator;
}();

exports.default = Validator;
//# sourceMappingURL=validator.js.map
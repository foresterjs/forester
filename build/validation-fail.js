"use strict";

var _es6Error = require('es6-error');

var _es6Error2 = _interopRequireDefault(_es6Error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ValidationFail = (function (_ExtendableError) {
  _inherits(ValidationFail, _ExtendableError);

  function ValidationFail(errors) {
    var message = arguments.length <= 1 || arguments[1] === undefined ? 'Validation error' : arguments[1];

    _classCallCheck(this, ValidationFail);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ValidationFail).call(this, message));

    _this.errors = errors;
    return _this;
  }

  return ValidationFail;
})(_es6Error2.default);

module.exports = ValidationFail;
//# sourceMappingURL=validation-fail.js.map
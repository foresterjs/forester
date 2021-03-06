'use strict';

import mschema from 'mschema';
const ValidationFail = require('./validation-fail');

export default class Validator {

  constructor(schema) {
    this.schema = schema;
  }

  async validate(data) {

    let validationResult = mschema.validate(data, this.schema);

    if (validationResult.valid) return true;

    let errors = {};
    validationResult.errors.forEach((err) => {
      errors[err.property] = errors[err.property] || [];
      errors[err.property].push(err.message);
    });

    throw new ValidationFail(errors);
  }

}

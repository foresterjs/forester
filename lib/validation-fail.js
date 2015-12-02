"use strict";

import ExtendableError from 'es6-error';

class ValidationFail extends ExtendableError {

  constructor(errors, message = 'Validation error') {
    super(message);
    this.errors = errors;
  }

}

module.exports = ValidationFail;

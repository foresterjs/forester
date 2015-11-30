"use strict";

module.exports = function (rule) {

  return async function ({body, response}, next) {

    response.status = 403;
    response.body = {};

  }
};

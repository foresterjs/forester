"use strict";

module.exports = function () {

  return async function ({response}, next) {

    response.status = 403;

  }
};

"use strict";

module.exports = function () {

  return async function ({}, next) {

    await next();

  }
};

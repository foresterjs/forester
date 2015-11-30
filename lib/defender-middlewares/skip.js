"use strict";

module.exports = function (rule) {

  return async function ({}, next) {

    await next();

  }
};

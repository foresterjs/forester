"use strict";

module.exports = function (forester) {

  forester.registerCollection(require(__dirname + "/_users.json"));
  forester.registerCollection(require(__dirname + "/_sessions.json"));

};


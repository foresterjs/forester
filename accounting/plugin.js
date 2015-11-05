"use strict";

export function plugin(forester){

  forester.registerCollection(require(__dirname + "/_users.json"));
  forester.registerCollection(require(__dirname + "/_sessions.json"));

};


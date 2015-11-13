"use strict";

var authMiddlewares = require('./defender-middlewares/auth');
var collectionsSchema = [
  require("../collections/_users.json"),
  require("../collections/_tokens.json")
];

class Defender {

  constructor(app) {

    this.app = app;

    app.registerCollections(collectionsSchema);

  }

  boot() {
    authMiddlewares(this, this.app);
  }

}

module.exports = Defender;

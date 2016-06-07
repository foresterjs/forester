"use strict";

// libraries
const Forester = require('./../lib/forester.js');
const foresterExplorer = require("forester-explorer");
const foresterAuth = require("forester-auth");
const path = require("path");

//project items
const collections = [
  require('./structure/articles.json'),
  require('./structure/categories.json'),
  require('./structure/comments.json'),
  require('./structure/join-articles-categories.json')
];
const dataSources = [
  require('./config/db1.json')
];
const mappings = require('./structure/mappings.json');
const authConfig = require('./config/auth.json');


//init forester
let app = new Forester();

//add plugins
app.use(foresterExplorer());
app.use(foresterAuth(authConfig));

//register project items
app.registerCollections(collections);
app.registerDataSources(dataSources);
app.registerMappings(mappings);
app.registerStaticRoute({route:"/", path: path.join(__dirname, "public"), failback: "index.html"});

//boot
app.boot()
  .then(() => {
    app.listen({port: 3000});
  })
  .catch((e) => {
    console.log(e.stack)
  });





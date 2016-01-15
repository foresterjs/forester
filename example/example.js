"use strict";

// libraries
const Forester = require('./../lib/forester.js');
const foresterExplorer = require("forester-explorer");
const foresterAuth = require("forester-auth");

//project items
const collections = [
  require('./json/collections/join-articles-authors.json'),
  require('./json/collections/authors.json'),
  require('./json/collections/categories.json'),
  require('./json/collections/articles.json'),
  require('./json/collections/comments.json'),
  require('./json/collections/profiles.json'),
  require('./json/collections/artists.json')

];
const dataSources = [
  require('./json/db1.json'),
  require('./json/db2.json')
];
const mappings = require('./json/mappings.json');


//init forester
let app = new Forester();

//add plugins
app.use(foresterExplorer());
app.use(foresterAuth({jwt: {secret: "change_me"}}));

//register project items
app.registerCollections(collections);
app.registerDataSources(dataSources);
app.registerMappings(require('./json/mappings.json'));

//boot
app.boot()
  .then(() => {
    app.listen({port: 3000});
  })
  .catch((e) => {
    console.log(e.stack)
  });





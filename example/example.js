"use strict";

var Forester = require('./../lib/forester.js');
var app = new Forester();

app.use(require('./auth/auth'));

app.registerConfig(require('./json/config.json'));
app.registerCollection(require('./json/join-articles-authors.json'));
app.registerCollection(require('./json/collections/authors.json'));
app.registerCollection(require('./json/collections/categories.json'));
app.registerCollection(require('./json/collections/articles.json'));
app.registerCollection(require('./json/collections/comments.json'));
app.registerCollection(require('./json/collections/profiles.json'));

app.registerDataSource(require('./json/db1.json'));
app.registerMappings(require('./json/mappings.json'));


app.boot()
  .then(() => {
  app.listen({port: 3000});
  })
  .catch((e) => {
    console.log(e.stack)
});





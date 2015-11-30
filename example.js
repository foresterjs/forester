"use strict";

var Forester = require('./lib/forester.js');
var app = new Forester();

app.registerConfig(require('./test/fixture/config.json'));
app.registerCollection(require('./test/fixture/join-articles-authors.json'));
app.registerCollection(require('./test/fixture/collections/authors.json'));
app.registerCollection(require('./test/fixture/collections/categories.json'));
app.registerCollection(require('./test/fixture/collections/articles.json'));
app.registerCollection(require('./test/fixture/collections/comments.json'));
app.registerCollection(require('./test/fixture/collections/profiles.json'));

app.registerDataSource(require('./test/fixture/db1.json'));
app.registerMappings(require('./test/fixture/mappings.json'));


app.boot()
  .then(() => {
  app.listen({port: 3000});
  })
  .catch((e) => {
    console.log(e.stack)
});





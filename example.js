"use strict";

var Forester = require('./lib/forester.js');
var app = new Forester();

app.registerConfig('jwt', {
  secret : 'change_me',
  options : {

  }
});

app.registerCollection(require('./test/fixture/join-articles-users.json'));
app.registerCollection(require('./test/fixture/users.json'));
app.registerCollection(require('./test/fixture/categories.json'));
app.registerCollection(require('./test/fixture/articles.json'));
app.registerCollection(require('./test/fixture/comments.json'));
app.registerCollection(require('./test/fixture/profiles.json'));

app.registerDataSource(require('./test/fixture/db1.json'));
app.registerMappings(require('./test/fixture/mappings.json'));


app.boot()
  .then(() => {
  app.listen({port: 3000});
  })
  .catch((e) => {
    console.log(e.stack)
});





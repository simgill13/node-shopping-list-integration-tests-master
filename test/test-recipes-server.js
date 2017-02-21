const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

// this lets us use *should* style syntax in our tests
// so we can do things like `(1 + 1).should.equal(2);`
// http://chaijs.com/api/bdd/
const should = chai.should();

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);







describe('Recipies test', function() {

  before(function(){
    return runServer();
  });
  after(function(){
    return closeServer();
  });

  it('testing the GET responce for Recipies', function(){
    return chai.request(app)
    .get('/Recipes')
    .then(function(res) {
      const expectedKeys = ['id', 'name', 'ingredients'];
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body.length.should.be.at.least(1);
      res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
          console.log('render');
      });
    });
  });


  it('tesint the POST response for Recipies', function(){

  const newRecipe = {name:"simran's baby back ribs", ingredients: ['1 cup white rice', '2 cups water', 'pinch of salt']}
    return chai.request(app)
    .post('/Recipes')
    .send(newRecipe)
    .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id', 'name', 'ingredients');
        res.body.id.should.not.be.null;
        res.body.ingredients.should.be.a('array');
        res.body.should.deep.equal(Object.assign(newRecipe, {id: res.body.id}));
    });
  });
});






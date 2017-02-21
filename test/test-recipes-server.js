const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');
const should = chai.should();

chai.use(chaiHttp);

describe('/Recipes RESTful Tests', function(){

  before(function(){
    return runServer();
  });
  after(function(){
    return closeServer();
  });
  
  //get test
  it('testing for GET calls to /Recipes', function(){
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

  //post test
  it('testing for POST calls to /Recipes', function(){
    const newRecipe = {name:"simran's baby back ribs", ingredients: ['1 cup white rice', '2 cups water', 'pinch of salt']};

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

  //delete test
  it('testing for DELETE calls to /Recipes', function(){
    return chai.request(app)
    .get('/Recipes')
    .then(function(res){
      return chai.request(app)
      .delete(`/Recipes/${res.body[0].id}`);
    })
    .then(function(res){
      res.should.have.status(204);
    });
  });

  //put test
  it('testing for PUT calls to /Recipes', function(){
    const updatedRecipe = { name : "Jared's Baby Back Ribs", ingredients : ["Ribs", "Babies", "Backs", "Jared"]};

    return chai.request(app)
    .get('/Recipes')
    .then(function(res){
      updatedRecipe.id = res.body[0].id;
      return chai.request(app)
      .put(`/Recipes/${updatedRecipe.id}`)
      .send(updatedRecipe);
    })
    .then(function(res){
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.ingredients.should.be.a('array');
      res.body.should.deep.equal(updatedRecipe);
    });
  });
});






const fs = require('fs');
const path = require('path');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
app.use(express.static('public'));

const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);
const { animals } = require('./data/animals');

  app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
      results = filterByQuery(req.query, results);
    }
    res.json(results);
  });

  app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
      res.json(result);
    } else {
      res.send(404);
    }
  });
  

//Now when we receive new post data to be added to the animals.json file, we'll take the length property of the animals
//array (because it's a one-to-one representation of our animals.json file data) and set that as the id for the new data. 
//Remember, the length property is always going to be one number ahead of the last index of the array so we can avoid any 
//duplicate values.
app.post('/api/animals', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();
  
    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
      res.status(400).send('The animal is not properly formatted.');
    } else {
      const animal = createNewAnimal(req.body, animals);
      res.json(animal);
    }
  });
  
  //Routes to handle my html files 

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });

  app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
  });

  app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
  });

  //Any other request, respond with index.html
  //The * route should always come last.
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });


  app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });

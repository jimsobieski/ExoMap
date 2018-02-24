var express = require('express');

var app = express();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var router = express.Router();
var port = process.env.PORT || 8081;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Method', 'GET, POST, OPTIONS, PUT, DELETE')
    next();
});

//CONNEXION BDD

const Sequelize = require('sequelize');
const sequelize = new Sequelize('gtfs', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});


//API ROUTES

router.route('/stops')
    .get(function(req, res) {
        sequelize.query('SELECT * FROM stops LIMIT 800', { type: sequelize.QueryTypes.SELECT})
            .then(result => {
            res.json(result);
        });

    });

app.use('/api', router);


// START

var server = app.listen(port);
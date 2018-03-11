var express = require('express');

var app = express();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var router = express.Router();
var port = process.env.PORT || 8081;

app.use(function (req, res, next) {
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

var user = sequelize.define('user', {
        login: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        token: {
            type: Sequelize.STRING
        }
    },
    {
        timestamps: false
    });


//API ROUTES

//MAP SEARCH
router.route('/geosearch')
    .post(function (req, res) {
        sequelize.query('SELECT * FROM stops WHERE (stop_lat BETWEEN ' + req.body.minLat + ' AND ' + req.body.maxLat +
            ') AND (stop_lon BETWEEN ' + req.body.minLon + ' AND ' + req.body.maxLon + ');', {type: sequelize.QueryTypes.SELECT})
            .then(result => {
            res.json(result);
    })
        ;

    });

router.route('/textsearch')
    .post(function (req, res) {
        sequelize.query('SELECT * FROM stops WHERE stop_name LIKE "%' + req.textSearch + '%"' +
            ' OR stop_name LIKE "%' + req.body.searchText + '%";', {type: sequelize.QueryTypes.SELECT})
            .then(result => {
            res.json(result);
    })
        ;

    });


//LOGIN

router.route('/login')
    .post(function (req, res) {
        user.findOne({
            where: {login: req.body.login, password: req.body.password},
        }).then(function(){
            var token = jwt.sign({login: req.body.login, password: req.body.password}, 'shhhh');
            user.update({
                token: token
            }, { where: {login: req.body.login, password: req.body.password}
            });
            res.json({ token: token });
        });
    });

router.route('/logout')
    .post(function (req, res){
        user.findOne({
            where: {token: req.body.token}
        }).then(function(){
            user.update({
                token: ''
            }, { where: {token: req.body.token}});
        });
    });

app.use('/api', router);


// START

var server = app.listen(port);
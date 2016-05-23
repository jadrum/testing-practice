var express = require('express');
var app = express();
var exports = module.exports = {}
var bodyParser = require('body-parser');

// this allows testing through diff kinds of reading
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

var locationList = [];

app.get('/', function(req, res){
    res.send('Hi Mom');
});

app.get('/users/1', function(req, res) {
    var user = {
        name: "Karen",
        email: "blah@email.com",
        phoneNumber: "1234567890",
        role: "admin"
    };
    res.send(user);
});

app.put('/users/1', function(req, res) {
    var user = {
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        role: req.body.role
    };
    res.send(user);
});

app.post('/locations', function(req, res) {
    var location = {
        addressStreet: req.body.addressStreet,
        addressCity: req.body.addressCity,
        addressZip: req.body.addressZip,
        userId: req.body.userId
    };
    locationList.push(location);
    res.send(location);
});

app.get('/users/1/location', function(req, res) {
    res.send(locationList[0]);
});

app.get('/users/2/location', function(req, res) {
    if (req.body.userId === 2) {
        res.send(locationList[0]);
    } else {
        res.sendStatus(401);
    }
});

var server = app.listen(3000, function() {
    console.log('Magic is happening on port 3000')
});

exports.closeServer = function() {
    server.close();
};

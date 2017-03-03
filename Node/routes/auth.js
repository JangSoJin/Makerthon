var express = require('express');
var router = express.Router();
var uuidV1 = require('uuid/v1');
var async = require('async');

var getUser = function(email, password) {
    req.cache.get(email, function(error, reply) {
        if (reply == 'OK') {
            req.cache.get(email+'-password', function(error, reply) {
                console.log('password:', reply);
                res.json({ reply: reply });
            });
        } else {
            res.json({ error: error });
        }
    });
};

//var crypto = require('crypto');
//var salt = 'a3wn83)#Y{B{Tsy4b;n8-bj';
//var hash = crypto.createHmac('sha256', salt);

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/register', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var uid = uuidV1();

    req.cache.set(email, true);
    req.cache.set(email+'-password', password);
    req.cache.set(email+'-uid', uid);
    req.cache.set(email+'-state', false);

    res.json({ reply: true, message: "User Registered." });
});

router.post('/login', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    var cache = req.cache;
    async.parallel([
            function(cb) { cache.get(email, function(error, reply) { cb(null, reply); }) },
            function(cb) { cache.get(email+'-password', function(error, reply) { cb(null, reply); }) },
            function(cb) { cache.get(email+'-uid', function(error, reply) { cb(null, reply); }) },
            function(cb) { cache.get(email+'-state', function(error, reply) { cb(null, reply); }) }
        ],
        function(error, data) {
            if (error) {
                console.log('error:', error);
                res.json({ reply: false, error: error });
            } else {
                if (!data[0]) res.json({ reply: false, message: "User not found." });
                else if (password != data[1]) res.json({ reply: false, message: "Invalid password." });
                else {
                    cache.set(email+'-state', true);
                    res.json({ reply: true, uid: data[2] });
                }
            }
        }
    );

    //var salted_email = hash.update(email).digest('hex');
    //var salted_password = hash.update(password).digest('hex');


    /*
    req.cache.hgetall('auth:'+salted_email, function(error, reply) {
        if (error) {
            console.log('error:', error);
            res.json({ error: error });
        }
        res.json({ reply: reply[salted_email] == salted_password });
    });
    */
});

router.post('/logout', function(req, res) {

});

module.exports = router;
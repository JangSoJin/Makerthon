var express = require('express');
var router = express.Router();

router.get('/:email', function(req, res) {
    //var uid = req.params.uid;
    var email = req.params.email;

    req.cache.get(email+'-uid', function(error, reply) {
        var uid = reply;
        console.log('reply:', reply);

        req.cache.hgetall(uid, function(error, reply) {
            if (error) {
                console.log('error:', error);
                res.json({
                    reply: reply,
                    error: error
                })
            }
            res.json({ reply: reply });
        });
    });
    /*
    req.cache.hgetall(uid, function(error, reply) {
        if (error) {
            console.log('error:', error);
            res.json({
                reply: reply,
                error: error
            });
        }
        res.json({ reply: reply });
    });
    */
});

router.post('/', function(req, res) {
    var uid = req.body.uid;
    var value = req.body.value;
    var timestamp = new Date().getTime();
    var data = {};
    data[timestamp] = value;

    req.accepts('application/json');

    console.log('data:', data);

    req.cache.hmset(uid, data, function(error, reply) {
        if (error) {
            console.log('error:', error);
            res.json({
                reply: reply,
                error: error
            });
        }
        res.json({ reply: reply });
    });

    /*
    req.cache.set(uid, value, function(error, reply) {
        if (error) {
            console.log('error:', error);
            res.json({
                result: false,
                error: error
            });
        }

        //req.cache.expire(uid, 86400);
        res.json({ reply: reply });
    });
    */
});

module.exports = router;

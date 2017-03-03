var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/register', function(req, res) {
    var email = req.body.email;
    var guard = req.body.guard; // email

    req.cache.get(guard, function(error, reply) {
        if (reply) {
            req.cache.set(email+'-guard', guard);
            res.json({ reply: reply });
        } else {
            res.json({ error: error, message: "Guardian not found." });
        }
    });
});

module.exports = router;

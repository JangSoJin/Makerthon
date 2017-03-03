var express = require('express');
var router = express.Router();

/*
var firebase = require('firebase');
var admin = require('firebase-admin');

var db = firebase.database();
*/

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/register', function(req, res) {
    var uid = req.body.uid;
    //db.ref(uid).child('gaurd').once('value', function(snapshot) {
    //    var data = snapshot.val();
    //});
    var guard = req.body.guard; // email
    admin.getUserByEmail(guard)
        .then(function(userRecord) {
            var gid = userRecord.uid;
            db.ref(uid).child('guard').set(gid)
                .then(function() {
                    res.json({result:true});
                })
                .catch(function(error) {

                });
        })
        .catch(function(error) {

        });
});

module.exports = router;

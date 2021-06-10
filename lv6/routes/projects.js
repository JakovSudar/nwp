var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/projectList', function(req, res) {
    var db = req.db;
    var collection = db.get('projectlist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
    
});

/*
 * POST to adduser.
 */
router.post('/addProject', function(req, res) {    
    var db = req.db;   
    var collection = db.get('projectlist');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deleteProject/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('projectlist');
    var userToDelete = req.params.id;
    collection.remove({ '_id' : userToDelete }, function(err) {
        res.send({ msg: '' });
    });
});

module.exports = router;
var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
  var db = req.db;
  db.collection('users').find().toArray(function (err, items) {
    res.json(items);
  });
});

/*
 * GET userlist/uid : retrieves a user given their uid
 */
router.get('/userlist/:uid', function(req, res){
  var db = req.db;
  db.collection('users').find({"uid":req.params.uid}).toArray(function (err, items) {
    res.json(items[0]);
  });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deleteuser/:uid', function(req, res) {
  /**
   * Note:
   * Later will want to create JS "Classes" objects
   * to handle all db interaction for each type
   * of data object (ex: books, users, etc.)
   *
   * Then call the methods to perform desired action here
   */
  var db = req.db;
  db.collection('users').remove({ 'uid' : req.params.uid }, function(err) {
    res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
  });
});

/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
  var db = req.db;
  db.collection('users').insert(req.body, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

module.exports = router;
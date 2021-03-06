var express = require('express');
var router = express.Router();

/*
 * GET booklist.
 */
router.get('/booklist', function(req, res) {
  var db = req.db;
  db.collection('books').find().toArray(function (err, items) {
    res.json(items);
  });
});

/*
 * GET booklist/isbn : retrieves a book given their isbn
 */
router.get('/booklist/:isbn', function(req, res){//check
  var db = req.db;
  db.collection('books').find({"isbn":req.params.isbn}).toArray(function (err, items) {
    res.json(items[0]);
  });
});
//unknown
/*
 * DELETE to deletebook.
 */
router.delete('/deletebook/:isbn', function(req, res) {
  /**
   * Note:
   * Later will want to create JS "Classes" objects
   * to handle all db interaction for each type
   * of data object (ex: books, users, etc.)
   *
   * Then call the methods to perform desired action here
   */
  var db = req.db;
  db.collection('books').remove({ 'isbn' : req.params.isbn }, function(err) {
    res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
  });
});

/*
 * POST to addbook. HANDLING
 */
router.post('/addbook', function(req, res) {
  var db = req.db;
  db.collection('books').insert(req.body, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});
/*
 * POST to updatebook. 
 */
router.post('/updatebook/:isbn', function(req, res){
  var db = req.db;
  db.collection('books').update(
    {isbn: req.params.isbn}, // query 
    {
      
    }
    )
});


/**
 *
 */
router.post('updatebook', function(req, res){

});


module.exports = router;
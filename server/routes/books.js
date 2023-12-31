// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
    //Create blankBook book object for blank form
    const blankBook = {
      "_id": "",
      "Title": "",
      "Price": "",
      "Author": "",
      "Genre": ""
    }
    res.render('books/details', {
      title: 'Add Book',
      books: blankBook
    });
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', async(req, res, next) => {
    const newbook = new book ({
      Title: req.body.title,
      Price: req.body.price,
      Author: req.body.author,
      Genre: req.body.genre
    });
    try {
      const savedBook = await newbook.save()
      console.log("add: " + newbook);
      res.redirect("/books");
    } catch(err) {
      console.log("ERROR : " + res.json({message : err}));
    }
});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', async(req, res, next) => {
    try{
      const editBook = await book.findOne({_id : req.params.id});
      console.log("get: " + editBook);
      res.render('books/details', {
        title: 'Edit Book',
        books: editBook
      });
    }catch(err){
      console.log("ERROR : " + res.json({message : err}));
    }
});

// POST - process the information passed from the details form and update the document
router.post('/:id', async(req, res, next) => {
    try {
      const updatedBook = await book.updateOne(
        { _id: req.params.id } , 
        { $set : { Title: req.body.title,
          Price: req.body.price,
          Author: req.body.author,
          Genre: req.body.genre} } );
      console.log("update: "+updatedBook);
      res.redirect("/books");
    } catch(err) {
        console.log("ERROR : " + res.json({message : err}));
    }
});

// GET - process the delete by book id
router.get('/delete/:id', async(req, res, next) => {
    try {
      const deletedBook = await book.deleteOne( { _id: req.params.id } );
      console.log("delete: "+deletedBook);
      res.redirect("/books");
    } catch(err) {
        console.log("ERROR : " + res.json({message : err}));
    }
});


module.exports = router;

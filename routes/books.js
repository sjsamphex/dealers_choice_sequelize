const router = require('express').Router();
const { conn, Book, Author } = require('../db/index');
// eslint-disable-next-line no-unused-vars
const html = require('html-template-tag');
const bookList = require('../views/bookList');
const bookDetails = require('../views/bookDetails');
const addBook = require('../views/addBook');

// express.static('./');
// router.use(express.static('public'));
// router.use(express.static('public/images'));

router.get('/', async (req, res, next) => {
  try {
    const bookData = await Book.findAll({
      include: [
        {
          model: Author,
        },
      ],
    });
    console.log(bookData);

    res.send(bookList(bookData));
  } catch (error) {
    next(error);
  }
});

router.get('/add', (req, res) => {
  res.send(addBook());
});

router.post('/', async (req, res, next) => {
  try {
    const rating = Math.floor(Math.random() * 5) + 1;
    const { author, title, content } = req.body;
    console.log('the author is' + author);
    const newBook = await Book.create({
      title,
      content,
      rating,
    });
    const newAuthor = await Author.create({ name: author });
    newBook.authorId = newAuthor.id;
    await newBook.save();
    console.log(newBook.get());
    res.redirect(`/books/${newBook.id}`);
  } catch (ex) {
    next(ex);
  }
});

router.get('/:id', async (req, res, next) => {
  let id = req.params.id;
  try {
    if (id > (await Book.count())) id = 1;

    const book = await Book.findByPk(id, {
      include: Author,
    });

    res.send(bookDetails(book));
  } catch (error) {
    next(error);
  }
});

module.exports = router;

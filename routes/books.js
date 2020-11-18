const router = require('express').Router();
const { Book, Author } = require('../db/index');
const bookList = require('../views/bookList');
const bookDetails = require('../views/bookDetails');
const addBook = require('../views/addBook');

router.get('/', async (req, res, next) => {
  try {
    const bookData = await Book.findAll({
      include: [
        {
          model: Author,
        },
      ],
    });

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
    const newBook = await Book.create({
      title,
      content,
      rating,
    });

    //check to see if Author table already has our request author entry
    const existingAuthor = await Author.findAll({
      where: {
        name: author,
      },
    });
    if (existingAuthor.length === 0) {
      //create new author in Author table
      const newAuthor = await Author.create({ name: author });
      newBook.authorId = newAuthor.id;
    } else {
      newBook.authorId = existingAuthor[0].id;
    }

    await newBook.save();
    res.redirect(`/books/${newBook.id}`);
  } catch (ex) {
    next(ex);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    let id = req.params.id;
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

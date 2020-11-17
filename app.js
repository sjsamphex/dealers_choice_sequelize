const express = require('express');
const app = express();
const morgan = require('morgan');
const fourOhFour = require('./views/404');

const { conn, syncAndSeed } = require('./db/index');

if (typeof morgan !== 'undefined') {
  app.use(morgan('dev'));
}

app.use(express.urlencoded({ extended: false }));

express.static('./');
app.use(express.static('public'));
app.use(express.static('public/images'));

app.use('/books', require('./routes/books'));

app.get('/', (req, res) => {
  res.redirect('/books');
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(404).send(fourOhFour());
});

const init = async () => {
  try {
    await conn.authenticate();
    await syncAndSeed();

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening on port: ${port}`));
  } catch (ex) {
    console.log(ex);
  }
};

init();

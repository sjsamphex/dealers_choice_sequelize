// // setting up the node-postgres driver
// const pg = require('pg');

// const postgresUrl =
//   process.env.DATABASE_URL || 'postgres://localhost/cat_books';
// const client = new pg.Client(postgresUrl);

// // connecting to the `postgres` server
// client.connect();

// // make the client available as a Node module
// module.exports = client;

//Setting up Sequelize
const Sequelize = require('sequelize');
const { STRING, UUID, UUIDV4, INTEGER } = Sequelize;

const conn = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost/cat_books'
);

const Author = conn.define('author', {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  name: {
    type: STRING(100),
    allowNull: false,
    unique: true,
  },
});

const Book = conn.define('book', {
  rating: {
    type: INTEGER,
  },
  title: {
    type: STRING,
  },
  content: {
    type: STRING(1000),
  },
  image: {
    type: STRING(20),
  },
});

Book.belongsTo(Author);
Author.hasMany(Book);

const syncAndSeed = async () => {
  await conn.sync({ force: true });

  const [Aline] = await Promise.all([
    Author.create({ name: 'Aline Alexander Newman' }),
  ]);

  const [book1] = await Promise.all([
    Book.create({
      title: 'How to Speak Cat: A Guide to Decoding Cat Language',
      rating: 4,
      image: 'HowToSpeakCat.jpg',
      content:
        'We know cats are beautiful, secretive, and independent ... but even the most loyal cat owners are often baffled by their own pets behavior. With veterinarian expert Dr. Gary Weitzman as guide, this fun book helps kids understand what cats are trying to communicate by their body language and behavior. So if youve ever wondered what Fluffy means when she is purring or moving her tail emphatically from left to right-this book is for you! It is full of insights, expert advice, and real-life cat scenarios, and showcases more than 30 poses, so you will soon learn what each meow and flick of the tail means!',
    }),
  ]);

  book1.authorId = Aline.id;
  await Promise.all([book1.save()]);
};

module.exports = {
  conn,
  syncAndSeed,
  Author,
  Book,
};

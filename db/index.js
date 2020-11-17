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
  image: {
    type: STRING(20),
  },
});

Book.belongsTo(Author);

const syncAndSeed = async () => {
  await conn.sync({ force: true });

  const [Aline] = await Promise.all([Author.create({ name: 'Aline' })]);

  const [book1] = await Promise.all([Book.create({ first_name: 'lucy' })]);

  book1.authorId = Aline.id;
  await Promise.all([book1.save()]);
};

module.exports = {
  conn,
  syncAndSeed,
  Author,
  Book,
};

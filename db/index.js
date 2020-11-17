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

  const [Aline, Jackson, Andrew, Francesco, DK] = await Promise.all([
    Author.create({ name: 'Aline Alexander Newman' }),
    Author.create({ name: 'Jackson Galaxy' }),
    Author.create({ name: 'Andrew Martila' }),
    Author.create({ name: 'Francesco Marciuliano)' }),
    Author.create({ name: 'DK' }),
  ]);

  const [book1, book2, book3, book4, book5] = await Promise.all([
    Book.create({
      title: 'How to Speak Cat: A Guide to Decoding Cat Language',
      rating: 4,
      image: 'HowToSpeakCat.jpg',
      authorId: Aline.id,
      content:
        'We know cats are beautiful, secretive, and independent ... but even the most loyal cat owners are often baffled by their own pets behavior. With veterinarian expert Dr. Gary Weitzman as guide, this fun book helps kids understand what cats are trying to communicate by their body language and behavior. So if youve ever wondered what Fluffy means when she is purring or moving her tail emphatically from left to right-this book is for you! It is full of insights, expert advice, and real-life cat scenarios, and showcases more than 30 poses, so you will soon learn what each meow and flick of the tail means!',
    }),
    Book.create({
      title: 'Total Cat Mojo: The Ultimate Guide to Life with Your Cat',
      rating: 4,
      image: 'TotalCat.jpg',
      authorId: Jackson.id,
      content:
        "Cat Mojo is the confidence that cats exhibit when they are at ease in their environment and in touch with their natural instincts—to hunt, catch, kill, eat, groom, and sleep. Problems such as litter box avoidance and aggression arise when cats lack this confidence. Jackson Galaxy's number one piece of advice to his clients is to help their cats harness their mojo. <br> This book is his most comprehensive guide yet to cat behavior and basic cat care, rooted in understanding cats better. From getting kittens off to the right start socially, to taking care of cats in their senior years, and everything in between, this book addresses the head-to-toe physical and emotional needs of cats—whether related to grooming, nutrition, play, or stress-free trips to the vet.",
    }),
    Book.create({
      title: 'Cats on Catnip',
      rating: 4,
      image: 'Catnip.jpg',
      authorId: Andrew.id,
      content:
        "A humorous collection of dozens of photos of funny and adorable cats as they play with, roll in, and chow down their favorite snack of choice -- catnip. Cats love catnip. Whether it's eating it, playing with it, or rolling around in it, catnip turns our domestic feline friends into hilarious balls of activity. Carefree and unconstrained, they are free to be silly, exceptionally playful, and downright gnarly. Professional pet photographer and self-confessed crazy cat man Andrew Marttila (the photographer behind Shop Cats of New York) captures a range of the cats' silly and expressive personalities as they react to their catnip trip. Delightful, elegant Fluffy transforms into a hell-bent renegade. Shy, reserved Mittens becomes a free-loving acrobat. In the blink of an eye, a cat's expression transforms from bored to inquisitive to playful to curious to bizarre . . . to utterly unhinged. A fun and delightful look at our furry companions, this gift book is perfect for every cat lover.",
    }),
    Book.create({
      title: 'I Could Pee on This: And Other Poems by Cats',
      rating: 4,
      image: 'CatPee.jpg',
      authorId: Francesco.id,
      content:
        'Animal lovers will laugh out loud at the quirkiness of their feline friends with these insightful and curious poems from the singular minds of funny cats. In this hilarious book of tongue-in-cheek poetry, the author of the internationally syndicated comic strip Sally Forth helps cats unlock their creative potential and explain their odd behavior to ignorant humans. With titles like "Who Is That on Your Lap?," "This Is My Chair," "Kneel Before Me," "Nudge," and "Some of My Best Friends Are Dogs," the poems collected in I Could Pee on This perfectly capture the inner workings of the cat psyche. With photos of the cat authors throughout, this whimsical volume reveals kitties at their wackiest, and most exasperating (but always lovable). Ideal for that "crazy cat lady" or "cat mom/dad" in your life this collection of poems makes for the perfect cat themed gift for anyone who\'s obsessed with our feline friends.',
    }),
    Book.create({
      title: 'The Cat Encyclopedia: The Definitive Visual Guide',
      rating: 4,
      image: 'CatEncyc.jpg',
      authorId: DK.id,
      content:
        'The Cat Encyclopedia is a comprehensive cat compendium that has all the facts about cats and kittens. It’s packed with beautifully photographed profiles of different breeds from the Maine Coon to the Khao Manee and includes information on caring for your own cat. \n This book also offers information on the science and history of house cats. Find out how cats were domesticated and developed into separate breeds, and see their prominence in art, literature, and superstition. A chapter on feline biology focuses on the anatomy of cats – including the nervous system, digestion, and muscles – and also features details on cat senses and coat patterns. \n With comprehensive help on cat care – from preparing for your cat’s arrival and essential equipment to healthcare and training – The Cat Encyclopedia is the perfect guide for cat lovers.',
    }),
  ]);

  // book1.authorId = Aline.id;
  // await Promise.all([book1.save()]);
};

module.exports = {
  conn,
  syncAndSeed,
  Author,
  Book,
};

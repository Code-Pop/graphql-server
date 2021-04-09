import shortid from "shortid";

export default {
  Query: {
    allBooks: (_, { search }, { db }) => {
      const books = db.get("books").value();
      if (!search) {
        return books;
      }
      return books.filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase())
      );
    },
    getBook: (root, { id }, { db }) =>
      db
        .get("books")
        .find({ id })
        .value(),
  },

  Mutation: {
    addBook: (_, { input }, { pubsub, db }) => {
      const newBook = {
        id: shortid.generate(),
        title: input.title,
        description: input.description || "",
        rating: input.rating || null,
        year: book.year,
      };
      db.get("books")
        .push(newBook)
        .last()
        .write();

      pubsub.publish("books", { addBook: newBook });

      return newWine;
    },
    deleteBook: (_, { id }, { db }) => {
      db.get("books")
        .remove({ id })
        .write();

      return true;
    },
  },

  Subscription: {
    bookSub: {
      resolve: (payload) => {
        return payload.addBook;
      },
      subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator("books"),
    },
  },
};

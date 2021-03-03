import shortid from "shortid";

export default {
  Query: {
    allBooks: (_, __, { db }) => db.get("books").value(),
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

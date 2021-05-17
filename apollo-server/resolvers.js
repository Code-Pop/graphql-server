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
        year: input.year,
        author: input.author,
      };
      db.get("books")
        .push(newBook)
        .last()
        .write();

      pubsub.publish("books", { addBook: newBook });

      return newBook;
    },
    deleteBook: (_, { id }, { db }) => {
      db.get("books")
        .remove({ id })
        .write();

      return true;
    },
    updateBook: (_, { input }, { db }) => {
      const { id } = input;
      let bookToUpdate = db
        .get("books")
        .find({ id })
        .value();
      db.get("books")
        .find({ id })
        .assign({
          id,
          title: input.title || bookToUpdate.title,
          description: input.description || bookToUpdate.description,
          author: input.author || bookToUpdate.author,
          year: input.year || bookToUpdate.year,
          rating: input.rating || bookToUpdate.rating,
        })
        .write();
      return bookToUpdate;
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

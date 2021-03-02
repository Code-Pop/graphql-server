const { ApolloServer, gql } = require("apollo-server");

const books = [
  {
    id: "djqkj193w12d",
    title: "The Awakening",
    author: {
      firstName: "Kate",
      lastName: "Chopin",
      yearOfBirth: 1984,
    },
  },
  {
    id: "dj39239dj3",
    title: "City of Glass",
    author: {
      firstName: "Paul",
      lastName: "Auster",
      yearOfBirth: 1935,
    },
  },
];

const typeDefs = gql`
  type Author {
    firstName: String
    lastName: String
    yearOfBirth: Int
  }

  type Book {
    id: ID
    title: String
    author: Author
    year: Int
  }

  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    books: () => books,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

// from -- GraphQL Server Tutorial with Apollo Server and Express - RWieruch
'use strict';

const { ApolloServer, gql } = require('apollo-server');

let users = {
  1: {
    id: '1',
    username: 'Robin Wieruch',
  },
  2: {
    id: '2',
    username: 'Dave Davids',
  },
};
const me = users[1];

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }
  type Query {
    users: [User!]
    me: User
    user(id: ID!): User
  }

`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    me: () => {
      return me;
    },
    // parent or root argument always returns the previously resolved field.
    user: (parent, { id }) => {
      return user[id]
    },
    users: () => {
      return Object.values(users);
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

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
let messages = {
    1: {
      id: '1',
      text: 'Hello World',
    },
    2: {
      id: '2',
      text: 'By World',
    },
  };

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const schema = gql`
  type Query {
    users: [User!]
    user(id: ID!): User
    me: User

    messages: [Message!]!
    message(id: ID!): Message!
  }

  type User {
    id: ID!
    username: String!
  }

  type Message {
    id: ID!
    text: String!
    # userId: ID!
    user: User!
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
    Query: {
      users: () => {
        return Object.values(users);
      },
      user: (parent, { id }) => {
        return users[id];
      },
      me: (parent, args, { me }) => {
        return me;
      },
      messages: () => {
        return Object.values(messages);
      },
      message: (parent, { id }) => {
        return messages[id];
      },
    },

    Message: {
      user: () => {
        return me;
      },
    },
  };

const server = new ApolloServer({
    typeDefs: schema,
    resolvers: resolvers,
    context: {
        me: users[1],
    }
});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

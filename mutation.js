'use strict';

const uuidv4 = require('uuid/v4');

const { ApolloServer, gql } = require('apollo-server');

let users = {
  1: {
    id: '1',
    username: 'Robin Wieruch',
    messageIds: [1],
  },
  2: {
    id: '2',
    username: 'Dave Davids',
    messageIds: [2],
  },
};
let messages = {
  1: {
    id: '1',
    text: 'Hello World',
    userId: '1',
  },
  2: {
    id: '2',
    text: 'By World',
    userId: '2',
  },
};
const me = users[1];


const schema = gql `
  type Query {
    users: [User!]
    user(id: ID!): User
    me: User

    messages: [Message!]!
    message(id: ID!): Message!
  },

  type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }

  type User {
    id: ID!
    username: String!
    messages: [Message!]
  }

  type Message {
    id: ID!
    text: String!
    # userId: ID!
    user: User!
  }

`;



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
  Mutation: {
    createMessage: (parent, { text }, { me }) => {
      const id = uuidv4();
      const message = {
        id,
        text,
        userId: me.id,
      };
      messages[id] = message;
      users[me.id].messageIds.push(id);

      return message;
    },
    deleteMessage: (parent, { id }) => {
      const { [id]: message, ...otherMessages } = messages;
      if (!message) {
        return false;
      }
      messages = otherMessages;
      return true;
    },
  },

  User: {
    messages: user => {
      return Object.values(messages).filter(
        message => message.userId === user.id,
      );
    },
  },

  Message: {
    user: () => {
      return me;
    },
  },
  Message: {
    user: message => {
      return users[message.userId];
    },
  },
};

const server = new ApolloServer({ typeDefs: schema, resolvers: resolvers,
  context: {
    me: users[1],
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});


/*
mutation M { 
	createMessage(
    text: "Birthday event"
  ){ text, id,  }
}

curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' --data-binary '{"query":"mutation M {\n  createMessage(text: \"Birthday event kokokoko\") {\n    text\n    id\n  }\n}\n\nquery QA {\n  messages {\n    text\n    id\n  }\n}\nmutation D {\n  deleteMessage(id: \"feb21a69-7aad-4e27-8ca3-e57d75a65b41\")\n}\n"}' --compressed

*/

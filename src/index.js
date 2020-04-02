const {GraphQLServer} = require('graphql-yoga');
const {prisma} = require('./generated/prisma-client');

const resolvers = {
  Query: {
    info: () => `API Proof of concept`,
    feed: (root, args, context, info) => context.prisma.links(),
    link: (root, {id}, context) => context.prisma.link({id}),
  },
  Mutation: {
    post: (root, {url, description}, context) => context.prisma.createLink({
      url,
      description,
    }),
    updateLink: (root, {id, url, description}, context) => context.prisma.updateLink({
      data: {
        url,
        description,
      },
      where: {id}
    }),
    deleteLink: (root, {id}, context) => context.prisma.deleteLink({id}),
  },
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {prisma},
});

server.start(() => console.log(`Server running on http://localhost:4000`));
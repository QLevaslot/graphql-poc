const info = () => `API Proof of concept`;
const feed = (root, args, context, info) => context.prisma.links();
const link = (root, {id}, context) => context.prisma.link({id});

module.exports = {
  info,
  feed,
  link,
};

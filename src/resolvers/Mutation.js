const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');

const post = (root, {url, description}, context) => context.prisma.createLink({
  url,
  description,
});
const updateLink = (root, {id, url, description}, context) => context.prisma.updateLink({
  data: {
    url,
    description,
  },
  where: {id}
});
const deleteLink = (root, {id}, context) => context.prisma.deleteLink({id});

const signup = async (parent, args, context, info) => {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.createUser({...args, password});
  const token = jwt.sign({userId: user.id}, APP_SECRET);
  return {
    token,
    user,
  }
};

const login = async (parent, args, context, info) => {
  const user = await context.prisma.user({email: args.email});
  if (!user) {
    throw new Error('No such user found')
  }
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error('Invalid password')
  }
  const token = jwt.sign({userId: user.id}, APP_SECRET);

  // 3
  return {
    token,
    user,
  }
};

module.exports = {
  signup,
  login,
  post,
  updateLink,
  deleteLink,
}
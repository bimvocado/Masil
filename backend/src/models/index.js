const sequelize = require('../config/db');
const User = require('./user.model');
const Brand = require('./brand.model');
const Stuff = require('./stuff.model');
const Post = require('./post.model');
const Comment = require('./comment.model');
const Scrap = require('./scrap.model');
const Category = require('./category.model');
const Interaction = require('./interaction.model');

module.exports = {
  sequelize,
  User,
  Brand,
  Stuff,
  Post,
  Comment,
  Scrap,
  Category,
  Interaction,
};
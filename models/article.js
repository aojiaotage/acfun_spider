const mongoose = require('mongoose');
const { Schema } = mongoose;

const articleSchema = new Schema({
  acfunId: String,
  content: String,
  articleContentHtml: String,
  createdAt: { type: Number, default: Date.now.valueOf() },
  originCreatedAt: Number,
  title: String,
  tags: [
    {
      name: String,
      value: String,
      score: Number,
    }],
});

const articleModel = mongoose.model('article', articleSchema);

module.exports = {
  model: articleModel,
};

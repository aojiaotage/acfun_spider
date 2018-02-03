const { MongoClient } = require('mongodb');
const logger = require('../utils/loggers/logger');

async function recalculateTagScores() {
  const db = await MongoClient.connect('mongodb://localhost:27017/acfun');
  const cursor = db.collection('articles').find({}, { tags: 1 });

  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    const recaculatedTags = [];
    const titleTags = doc.tags.filter(t => t.name === 'ARTICLE_TAG_TITLE')
      .sort((prev, next) => next.score - prev.score)
      .map((e, i, a) => {
        return {
          name: e.name,
          value: e.value,
          score: e.score / a[0].score,
        };
      });

    const categoryTags = doc.tags.filter(t => t.name === 'ARTICLE_CATEGORY')
      .map((t) => {
        return {
          name: t.name,
          value: t.value,
          score: 0.7,
        };
      });
    const tagNameTags = doc.tags.filter(t => t.name === 'ARTICLE_TAG_NAME')
      .map((t) => {
        return {
          name: t.name,
          value: t.value,
          score: 0.5,
        };
      });
    const sysTags = doc.tags.filter(t => t.name === 'ARTICLE_TAG_SYS')
      .map((t) => {
        return {
          name: t.name,
          value: t.value,
          score: 0.4,
        };
      });
    const userTags = doc.tags.filter(t => t.name === 'ARTICLE_TAG_USER')
      .map((t) => {
        return {
          name: t.name,
          value: t.value,
          score: 0.4,
        };
      });

    recaculatedTags.push(...titleTags);
    recaculatedTags.push(...categoryTags);
    recaculatedTags.push(...tagNameTags);
    recaculatedTags.push(...sysTags);
    recaculatedTags.push(...userTags);

    await db.collection('articles')
      .updateOne({ _id: doc._id }, { $set: { tags: recaculatedTags } });
  }
}

switch (process.argv[2]) {
  case 'recalculate_tag_scores':
    recalculateTagScores()
      .then(() => {
        process.exit(0);
      })
      .catch((e) => {
        console.log(e);
        logger.error(
          'error executing script for recalculating tag scores',
          { err: e },
        );
        process.exit(1);
      });
    break;
  default:
    break;
}

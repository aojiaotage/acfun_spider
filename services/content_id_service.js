const redis = require('./redis_service');

const ACFUN_ID_SET_REDIS_KEY = 'acfun_id_set';
const ACFUN_ARTICLE_GOT_ID_SET = 'acfun_article_got_id_set';
async function generateAcfunIdsToRedis(min, max) {
  const ITERATION = 10000;
  const t1 = Date.now().valueOf();
  const arr = new Array(ITERATION);
  for (let i = min; i < max; i++) {
    for (let j = 0; j < ITERATION; j++) {
      const v = i * ITERATION + j;
      arr[j] = v;
    }
    await redis.sadd(ACFUN_ID_SET_REDIS_KEY, arr);
  }
  const t2 = Date.now().valueOf();
  console.log(t2-t1);
}

async function getRandomAcfunIds(count) {
  const ids = await redis.spop(ACFUN_ID_SET_REDIS_KEY, count);
  return ids;
}

async function markArticleIdSucceed(id) {
  await redis.sadd(ACFUN_ARTICLE_GOT_ID_SET, id);
}

async function idBackInPool(id) {
  await redis.sadd(ACFUN_ID_SET_REDIS_KEY, id);
}

async function getRemainingIDCount() {
  return await redis.scard(ACFUN_ID_SET_REDIS_KEY)
    .then(r=>Number(r));
}

module.exports = {
  generateAcfunIdsToRedis,
  getRandomAcfunIds,
  markArticleIdSucceed,
  idBackInPool,
  getRemainingIDCount,
};

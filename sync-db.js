const db = require('./db');

const _ = require('underscore');
const moment = require('moment');

const srcCategory = require('./models/category');
const dstCategory = require('./models_backup/category');
const srcJoke = require('./models/joke');
const dstJoke = require('./models_backup/joke');
const srcList = require('./models/list');
const dstList = require('./models_backup/list');
const srcPost = require('./models/post');
const dstPost = require('./models_backup/post');
const srcUser = require('./models/user');
const dstUser = require('./models_backup/user');
const srcTenthings = require('./models/games/tenthings');
const dstTenthings = require('./models_backup/games/tenthings');
const srcTenthingsStats = require('./models/stats/tenthings');
const dstTenthingsStats = require('./models_backup/stats/tenthings');

const syncDB = async () => {

  let N = 0;

  const categories = await srcCategory.find({}).exec();
  await dstCategory.deleteMany({});
  await dstCategory.insertMany(categories);
  console.log(`${categories.length} categories synced`);

  await dstJoke.deleteMany({});
  const jokes = await srcJoke.find({}).exec();
  await dstJoke.insertMany(jokes);
  console.log(`${jokes.length} jokes synced`);

  const users = await srcUser.find({}).exec();
  await dstUser.deleteMany({});
  await dstUser.insertMany(users);
  console.log(`${users.length} users synced`);

  await dstList.deleteMany({});
  N = 0;
  const listCursor = await srcList.find().cursor();
  await listCursor.eachAsync(list => {
    N++;
    if (N % 50 === 0) console.log(`${N} lists synced`);
    return dstList.insertMany([list]);
  });
  console.log(`loop all ${N} lists success`);

  /*
    const posts = await srcPost.find({}).exec();
    await dstPost.deleteMany({});
    await dstPost.insertMany(posts);
    console.log(`${posts.length} posts synced`);
  	*/

  const stats = await srcTenthingsStats.find({}).exec();
  await dstTenthingsStats.deleteMany({});
  await dstTenthingsStats.insertMany(stats);
  console.log(`${stats.length} stats synced`);


  await dstTenthings.deleteMany({});
  N = 0;
  const tenthingsCursor = await srcTenthings.find().cursor();
  await tenthingsCursor.eachAsync(game => {
    N++;
    if (N % 50 === 0) console.log(`${N} games synced`);
    //console.log(`id of the ${N}th game: ${game.chat_id}`);
    return dstTenthings.insertMany([game]);
  });
  console.log(`loop all ${N} games success`);

  process.exit(22);
};


syncDB();
//updateImages();
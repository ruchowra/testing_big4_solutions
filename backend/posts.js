/* eslint @typescript-eslint/no-var-requires: 0 */
/* eslint import/no-dynamic-require: 0 */
/* eslint global-require: 0 */
/* eslint no-await-in-loop: 0 */
/**
  Migrations script - run this with npm to create migration files, run migration files and rollback migration files.
*/

const fs = require('fs');
const moment = require('moment');
const { MongoClient } = require('mongodb');
const path = require('path');

async function asyncForEach(array, callback, done) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
  done();
}

// Envloader javascript implementation
Object.defineProperty(exports, '__esModule', { value: true });
try {
  const data = fs.readFileSync(path.resolve(process.cwd(), 'config/.env'), 'utf8');
  data.split('\n').forEach((line) => {
    if (line.trim().substr(0, 1) === '#') {
      return;
    }
    const [key, val] = line.split('=');
    if (typeof val === 'undefined') {
      return;
    }
    process.env[key.replace(' ', '_').toUpperCase().trim()] = val.trim();
  });
} catch (err) {
  throw err;
}
// End envloader
//require('.env').load();

//const hosts = `${process.env.MONGOHOST}:${process.env.MONGOPORT}`;


//const mongoUrl = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}@${hosts}/${process.env.MONGODB}${process.env.MONGOREPL ? `?replicaSet=${process.env.MONGOREPL}` : ''}`;
const mongoUrl = `mongodb+srv://admin:Pass123@cluster0-qlopb.mongodb.net/ratt_spar?retryWrites=true&w=majority`
MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, async (err, client) => {
  if (err) {
    process.stderr.write(`Error when connecting to database: ${err.message}\n`);
    return;
  }
  const db = client.db('ratt_spar');
  const metadata = await db.collection('posts').findOne({ type: 'metadata' });


  if (process.argv.length === 2 || process.argv[2].toLowerCase() === 'run') {
    const migrationFiles = fs.readdirSync('posts').filter(file => file.match(/[0-9]*-.*\.js/i) !== null);
    const nextNum = Number(metadata.num) + 1;
    let count = 0;
    asyncForEach(migrationFiles, async (file) => {
      const result = await db.collection('posts').findOne({ name: file });
      if (!result) {
        try {
          const migration = require(path.join(process.cwd(), 'posts', file)).migrate;
          count++;
          await migration(db);
          await db.collection('posts').insertOne({
            type: 'posts',
            name: file,
            num: nextNum,
            date: new Date(),
            name: 'Harish'
          });
        } catch (error) {
          process.stderr.write(`Error when running ${file}: ${error.message}`);
        }
      }
    }, async () => {
      if (count > 0) {
        await db.collection('posts').updateOne({ type: 'metadata' },
          {
            $set: {
              num: nextNum,
              'last-run': new Date(),
            },
          });
      }
      process.stdout.write(`Ran ${count} posts.\n`);
      client.close();
    });
  } else if (process.argv[2].toLowerCase() === 'create') {
    if (process.argv.length < 4) {
      process.stderr.write('npm migration create requires one or more migration names to create.\n');
    } else {
      const names = process.argv.slice(3);
      const timestamp = Number(`${moment().format('x')}00`);
      for (let i = 0; i < names.length; i++) {
        const fileContents = `// Migration file for collection ${names[i]}

module.exports.migrate = async function migrate(db) {
  const collection = db.collection('${names[i]}');
};

module.exports.rollback = async function rollback(db) {
  const collection = db.collection('${names[i]}');
};
`;
        const fileName = `${String(timestamp + i)}-${names[i]}.js`;
        fs.writeFileSync(path.join(process.cwd(), 'migrations', fileName), fileContents);
      }
      client.close();
    }
  } else if (process.argv[2].toLowerCase() === 'rollback') {
    if (metadata.num === 0) {
      process.stdout.write('Nothing to rollback.\n');
      client.close();
      return;
    }
    const posts = await db.collection('posts').find({ type: 'migration', num: metadata.num }).toArray();
    let count = 0;
    asyncForEach(posts, async (element) => {
      const migration = require(path.join(process.cwd(), 'posts', element.name)).rollback;
      await migration(db);
      count++;
    }, async () => {
      await db.collection('posts').deleteMany({ type: 'migration', num: metadata.num });
      await db.collection('posts').updateOne({ type: 'metadata' },
        {
          $set: {
            num: metadata.num - 1,
            'last-run': new Date(),
          },
        });
      process.stdout.write(`Rolled back ${count} posts.\n`);
      client.close();
    });
  } else if (process.argv[2].toLowerCase() === 'init') {
    await db.collection('posts').createIndex({ name: 1 });
    await db.collection('posts').insertOne({ type: 'metadata', num: 0, 'last-run': 0 });
    client.close();
  }
});

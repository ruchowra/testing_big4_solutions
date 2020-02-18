const { MongoClient } = require('mongodb');
import config from './config.js';


// MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, async (err:any, client:[]) => {
//   if (err) {
//     process.stderr.write(`Error when connecting to database: ${err.message}\n`);
//     return;
//   }
//   const db = client.db('ratt_spar');
//   const metadata = await db.collection('migrations').findOne({ type: 'metadata' });

// });

let _db:any;
// module.exports = {
//     getDb,
//     initDb
// };
function initDb(callback:any) {
    if (_db) {
        console.warn("Trying to init DB again!");
        return callback(null, _db);
    }
    MongoClient.connect(config.db.connectionString, config.db.connectionOptions, connected);
    function connected(err:any, db:any) {
        if (err) {
            process.stderr.write(`Error when connecting to database: ${err.message}\n`);
            return callback(err);
        }
        console.log("DB initialized - connected to: " + config.db.connectionString.split("@")[1]);
        _db = db.db('ratt_spar');
        return callback(null, _db);
    }
}

function getDb() {
    console.log(_db, "Db has not been initialized. Please called init first.");
    return _db;
}

export { getDb, initDb}
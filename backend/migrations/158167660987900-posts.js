// Migration file for collection posts

module.exports.migrate = async function migrate(db) {
  const collection = db.collection('posts');
};

module.exports.rollback = async function rollback(db) {
  const collection = db.collection('posts');
};

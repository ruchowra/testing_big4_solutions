// Migration file for collection migrations

module.exports.migrate = async function migrate(db) {
  const collection = db.collection('migrations');
};

module.exports.rollback = async function rollback(db) {
  const collection = db.collection('migrations');
};

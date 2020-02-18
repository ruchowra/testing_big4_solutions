# Migrations
Migrations are classes that expose the functions
`migrate(connection)` and `rollback(connection)`.

Using the command `npm run migrations create <name>`, a file will be automatically scaffolded in the migrations folder. The filename of the migration will be `<timestamp>-<name>.js` and the class inside will be use `name` both as a name of the class, but also as a name for the collection to migrate.

The command `npm run migrations rollback` will roll-back the latest migration.
What action is taken on rollback is described by the `rollback` function in the class.

The command `npm run migrations` without any argument will run any migrations that have not yet been run.
What action is taken on migration is described by the `migrate` function in the class.
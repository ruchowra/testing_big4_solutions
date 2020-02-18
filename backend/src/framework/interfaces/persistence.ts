/* eslint @typescript-eslint/no-explicit-any: 0 */
import { injectable } from 'inversify';

// Only here to allow for injection of different databases.
// Repositories can program towards specific implementations
// by using named bindings.
@injectable()
abstract class IPersistence {
  // Provide a way to handle the underlying driver
  // For example, this returns the MongoDBClient used when connecting to the database.
  public async abstract getUnderlying(): Promise<any>;
  // The only thing this interface does is expose a way for a consumer to
  // access an underlying method of persistence. It makes no assumptions on how
  // this persistence is structured.
  public async abstract getPersistence(): Promise<any>;
}

export default IPersistence;

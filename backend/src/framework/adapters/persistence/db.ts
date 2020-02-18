import { isUndefined } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import IPersistence from '@framework/interfaces/persistence';

type ResolveValue<T> = T | PromiseLike<T>;

class DbContext {
  private collection: {nextId: number, data: {[key: string]: any}[]} = { nextId: 1, data: [] }; // eslint-disable-line
  private fileName: string;
  public constructor(collection: string) {
    try {
      this.fileName = path.join(process.env.ROOTDIR, 'databases', `${collection}.json`);
      const content = fs.readFileSync(this.fileName, 'utf-8');
      this.collection = JSON.parse(content);
    } catch (_err) {
      this.collection = {
        nextId: 1,
        data: [],
      };
    }
  }

  /**
   * Find data in the database based on union of criteria.
   * @param criteria Object containing key: value pairs, all of which must match.
   *
   * @returns element contained in the database.
   */

  public find(criteria: {[key: string]: any}): {[key: string]: any}[] { // eslint-disable-line
    if (Object.keys(criteria).length === 0) {
      return this.collection.data;
    }
    const ret: {[key: string]: any}[] = []; // eslint-disable-line
    this.collection.data.forEach((element): void => {
      const criteriaKeys = Object.keys(criteria);
      const elementKeys = Object.keys(element);
      let add = -1;
      criteriaKeys.forEach((key): void => {
        if (elementKeys.indexOf(key) !== -1) {
          if (element[key] === criteria[key] && add !== 0) {
            add = 1;
          } else {
            add = 0;
          }
        }
      });
      if (add === 1) {
        ret.push(element);
      }
    });
    return ret;
  }

  /**
   * Save data to the collection
   * @param data The data to be saved to the collection
   */
  public async save(data: {[key: string]: any}): Promise<any> { // eslint-disable-line
    const saveData = data;
    saveData._id = Number(saveData._id);
    const index = this.getIndexOf(saveData._id);
    if (index !== -1) {
      this.collection.data[index] = saveData;
    } else {
      saveData._id = this.collection.nextId++;
      this.collection.data.push(saveData);
    }
    return saveData;
  }

  /**
   * Store the collection to disk.
   */
  public async commit(): Promise<void> {
    const ret = new Promise<void>((resolve: ((value?: ResolveValue<void>) => void),
      reject: ((reason?: any) => void)): void => {  // eslint-disable-line
      fs.writeFile(this.fileName, JSON.stringify(this.collection, null, 2), (err: any) : void => { // eslint-disable-line
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    return ret;
  }

  public async delete(criteria: {[key: string]: any}): Promise<void> { // eslint-disable-line
    const matches = this.find(criteria);
    matches.forEach((match: {[key: string]: any}): void => { // eslint-disable-line
      const index = this.getIndexOf(match._id);
      if (index !== -1) {
        this.collection.data.splice(index, 1);
      }
    });
  }

  private getIndexOf(criteria: number): number { // eslint-disable-line
    return this.collection.data.findIndex((value: {[key: string]: any}): boolean => { // eslint-disable-line
      return value._id === criteria;
    });
  }
}

class Db extends IPersistence {
  private contexts: {[key: string]: DbContext} = {};
  public async getPersistence(): Promise<Db> {
    return this;
  }

  public async getUnderlying(): Promise<Db> {
    return this;
  }

  public async open(collection: string): Promise<DbContext> {
    if (!fs.existsSync(path.join(process.env.ROOTDIR, 'databases'))) {
      fs.mkdirSync(path.join(process.env.ROOTDIR, 'databases'));
    }
    if (isUndefined(this.contexts[collection])) {
      this.contexts[collection] = new DbContext(collection);
    }
    return this.contexts[collection];
  }
}

export default Db;
export { DbContext };

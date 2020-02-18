/* eslint-disable */
import 'reflect-metadata';
import { expect } from 'chai';
import IPersistence from '@framework/interfaces/persistence';
import EventBus from '@framework/di/event-bus';

/* eslint-disable */

interface Dictionary {
  [key: string]: any
}

class mockCollection {
  private collection: Dictionary[] = [];
  public async find(_query: Dictionary, _options: Dictionary): Promise<Dictionary[]> {
    return this.collection;
  }

  public async insert(data: Dictionary[]): Promise<void> {
    data.forEach((element: Dictionary): void => {
      this.collection.push(element);
    });
  }
  public async insertOne(data: Dictionary): Promise<void> {
    this.insert([data]);
  }
}

class mockDb {
  private col: mockCollection = new mockCollection();

  public async collection(_name: string): Promise<mockCollection> {
    return this.col;
  }
}

class mockClient {
  private _db: mockDb = new mockDb();
  private session:mockSession = new mockSession();
  public async db(): Promise<mockDb> {
    return this._db;
  }

  public startSession(): mockSession {
    return this.session;
  }
}

type callback = () => Promise<void>;

class mockSession {
  public async withTransaction(callbk: callback): Promise<void> {
    return callbk();
  }

  public async abortTransaction(): Promise<void> {

  }
}

class MockPersistence extends IPersistence {
  private client: mockClient = new mockClient();
  public async getPersistence(): Promise<mockDb> {
    return this.client.db();
  }
  public async getUnderlying(): Promise<mockClient> {
    return this.client;
  }
} 
const persistence = new MockPersistence();
const eBus: EventBus = new EventBus(persistence);
describe('Framework', () => {
  describe('EventBus', () => {
    it('should insert an event into its collection', async () => {
      EventBus.emit('test', {});
      const client = await persistence.getUnderlying();
      const db = await client.db();
      const collection = await db.collection('');
      const ret = await collection.find({}, {});
      expect(ret[0].name).to.not.be.undefined;
      expect(ret[0].name).to.equal('test');
    });
  });
});
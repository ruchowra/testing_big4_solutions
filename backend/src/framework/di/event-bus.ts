/* eslint @typescript-eslint/no-explicit-any: 0 */
/* eslint no-console: 0 */
/* eslint class-methods-use-this: 0 */
// Class for maintaining an event queue system, with offline-queuing capabilities.

import { ObjectId } from 'mongodb';
import { injectable } from 'inversify';
import IEventHandler from '@framework/interfaces/event-handler';
import EventFactory from '@framework/di/event-factory';
import IPersistence from '@framework/interfaces/persistence';

type HandlerEntry = [string, {new (): IEventHandler}];

interface HandlerCollection {
  [key: string]: HandlerEntry[];
}

interface Payload {
  [key: string]: any;
}

interface EventSpec {
  _id: ObjectId;
  name: string;
  payload: Payload;
  timestamp: number;
}


@injectable()
class EventBus {
  private static emitLog: string[];
  private static mongo: IPersistence;
  private static handlers: HandlerCollection = { };

  private async runEvents(): Promise<void> {
    const client = await EventBus.mongo.getUnderlying();
    const session = client.startSession();
    try {
      await session.withTransaction(async (): Promise<void> => {
        const db = await client.db();
        const queue = await db.collection('event_queue');
        const result = queue.find({}, { sort: { timestamp: 1 }, limit: Number(process.env.EVENTMAX) });
        const events: EventSpec[] = [];
        const handledEvents = Object.keys(EventBus.handlers);
        await result.forEach((doc: EventSpec): void => {
          events.push(doc);
          queue.deleteOne(doc);
        });
        events.forEach((doc: EventSpec): void => {
          if (handledEvents.indexOf(doc.name) !== -1) {
            const handlerArray = EventBus.handlers[doc.name];
            const event = EventFactory.create(doc);
            for (let i = 0; i < handlerArray.length; i++) {
              const propagate = (new handlerArray[i][1]()).handleEvent(event);
              if (!propagate) {
                break;
              }
            }
          }
        });
      });
    } catch (err) {
      session.abortTransaction();
      process.stderr.write(`Error in eventbus runEvents: ${err.message}\n`);
    }
  }

  public startInterval(): void {
    // setInterval(async (): Promise<void> => this.runEvents(), Number(process.env.EVENTREFRESH));
  }

  public static registerHandler(EventName: string, Handler: HandlerEntry): void {
    const keys = Object.keys(EventBus.handlers);
    if (keys.indexOf(EventName) === -1) {
      EventBus.handlers[EventName] = [
        Handler,
      ];
    } else {
      const index = EventBus.handlers[EventName].findIndex((entry: HandlerEntry): boolean => {
        return entry[0] === Handler[0];
      });
      if (index === -1) {
        EventBus.handlers[EventName].push(Handler);
      }
    }
  }

  public static getHandlers(): HandlerCollection {
    return EventBus.handlers;
  }

  public static deregisterHandler(EventName: string, HandlerType: string): void {
    const keys = Object.keys(EventBus.handlers);
    if (keys.indexOf(EventName) !== -1) {
      const index = EventBus.handlers[EventName].findIndex((entry: HandlerEntry): boolean => {
        return entry[0] === HandlerType;
      });
      if (index === -1) {
        EventBus.handlers[EventName].splice(index, 1);
      }
    }
  }

  public static async emit(EventName: string, Payload: Payload): Promise<void> {
    if (process.env.TEST) {
      EventBus.emitLog.push('EventName');
      return;
    }
    const client = await EventBus.mongo.getUnderlying();
    const session = client.startSession();
    try {
      await session.withTransaction(async (): Promise<void> => {
        const db = await client.db();
        const queue = await db.collection('event_queue');
        queue.insertOne({
          name: EventName,
          payload: Payload,
          timestamp: Date.now() * 1000,
        });
      });
    } catch (err) {
      session.abortTransaction();
      process.stderr.write(`Error emitting event ${EventName}: ${err}\n`);
    }
  }

  public constructor(mongo: IPersistence) {
    EventBus.mongo = mongo;
  }

  public static flushLog(): string[] {
    const log = EventBus.emitLog;
    EventBus.emitLog = [];
    return log;
  }
}

export default EventBus;

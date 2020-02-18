// Events are added to this registry using the @event decorator.
// import path from 'path';
import IEvent from '@framework/interfaces/event';

interface EventCollection {
  [key: string]: {new (...rest: any[]): IEvent}; // eslint-disable-line
}

interface Constructor {
  new(...rest: any[]): IEvent; // eslint-disable-line
}

export default class EventRegistry {
  private static _registry: EventCollection = {};
  public static registerEvent(Name: string, fun: Constructor): void {
    EventRegistry._registry[Name] = fun;
  }

  public static hasEvent(Name: string): boolean {
    return typeof EventRegistry._registry[Name] !== 'undefined';
  }

  public static getEventConstructor(Name: string): Constructor | false {
    if (Object.keys(EventRegistry._registry).indexOf(Name) === -1) {
      return false;
    }
    return EventRegistry._registry[Name];
  }
}

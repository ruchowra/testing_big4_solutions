import 'reflect-metadata';
import EventRegistry from '@framework/di/event-registry';
import IEvent from '@framework/interfaces/event';
import { injectable } from 'inversify';

interface Event<T extends IEvent> {
  new (...rest: any[]): T; // eslint-disable-line
}

function RegisterEvent<T extends IEvent>(EventName: string): (target: Event<T>) => Event<T> {
  return function decoratorFunction(target: Event<T>): Event<T> {
    EventRegistry.registerEvent(EventName, target);

    return injectable()(target);
  };
}

export default RegisterEvent;

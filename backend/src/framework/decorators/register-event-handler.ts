/* eslint @typescript-eslint/no-explicit-any: 0 */
import 'reflect-metadata';
import EventBus from '@framework/di/event-bus';
import IEventHandler from '@framework/interfaces/event-handler';

interface Handler<T extends IEventHandler> {
  new (): T;
}

function RegisterEventHandler<T extends IEventHandler>(EventName: string): (target: Handler<T>) => Handler<T> {
  return function decoratorFunction(target: Handler<T>): Handler<T> {
    EventBus.registerHandler(EventName, [target.prototype.constructor.name, target]);
    return target;
  };
}

export default RegisterEventHandler;

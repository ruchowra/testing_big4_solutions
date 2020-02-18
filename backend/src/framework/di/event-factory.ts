/* eslint @typescript-eslint/no-explicit-any: 0 */
// Factory for creation of the correct event types, used primarily by the event bus

import IEvent from '@framework/interfaces/event';
import EventRegistry from '@framework/di/event-registry';

interface EventSpec {
  name: string;
  payload: { [key: string]: any };
  timestamp: number;
}

export default class EventFactory {
  public static create(EventSpec: EventSpec): IEvent {
    const constructor = EventRegistry.getEventConstructor(EventSpec.name);
    if (!constructor) {
      throw new Error(`No event registered with name ${EventSpec.name}`);
    }
    return new constructor(EventSpec);
  }
}

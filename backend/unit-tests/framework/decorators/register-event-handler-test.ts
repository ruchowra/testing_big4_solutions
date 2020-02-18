/* eslint-disable */
import {expect} from 'chai';
import RegisterEventHandler from '@framework/decorators/register-event-handler';
import IEventHandler from '@framework/interfaces/event-handler';
import IEvent from '@framework/interfaces/event';
import EventBus from '@framework/di/event-bus';
import { decorate } from 'inversify';
describe('Framework', () => {
  describe('Decorators', () => {
    describe('Testing @RegisterEventHandler decorator', () => {
      it('should add an event handler to the event bus\' handler registry', () => {
        const decorator = RegisterEventHandler('TestEvent')
        class EventHandler extends IEventHandler {
          public async handleEvent(_Event: IEvent): Promise<boolean> {
            return true;
          }
        }
        decorate(decorator, EventHandler);
        expect(EventBus.getHandlers().TestEvent).to.not.be.undefined;
      })
    });
  });
});
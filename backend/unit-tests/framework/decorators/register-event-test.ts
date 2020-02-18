/* eslint-disable */
import {expect} from 'chai';
import IEvent from '@framework/interfaces/event';
import RegisterEvent from '@framework/decorators/register-event';
import EventRegistry from '@framework/di/event-registry';
describe('Framework', () => {
  describe('Decorators', () => {
    describe('Testing @RegisterEvent decorator', () => {
      it('should add an event name to the event registry', () => {
        @RegisterEvent('TestEvent')
        class _testEvent extends IEvent {
        }
        expect(EventRegistry.hasEvent('TestEvent')).to.be.true;
      })
    });
  });
});
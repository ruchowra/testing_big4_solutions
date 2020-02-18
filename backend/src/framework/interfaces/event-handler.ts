import IEvent from './event';

abstract class IEventHandler {
  public async abstract handleEvent(Event: IEvent): Promise<boolean>;
}

export default IEventHandler;

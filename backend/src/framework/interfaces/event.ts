/* eslint @typescript-eslint/no-explicit-any: 0 */

interface Payload {
  [key: string]: any;
}
interface EventSpec {
  name: string;
  payload: Payload;
  timestamp: number;
}

class IEvent {
  protected _EventName: string;
  protected _Payload: Payload;
  protected _Timestamp: number;

  public constructor(EventSpec: EventSpec) {
    this._EventName = EventSpec.name;
    this._Payload = EventSpec.payload;
    this._Timestamp = Object.keys(EventSpec).indexOf('timestamp') === -1 ? Date.now() * 1000 : EventSpec.timestamp;
  }

  public get EventName(): string {
    return this._EventName;
  }

  public get Payload(): Payload {
    return this._Payload;
  }

  public get Timestamp(): number {
    return this._Timestamp;
  }

  public get Serialize(): EventSpec {
    return {
      name: this._EventName,
      payload: this._Payload,
      timestamp: this._Timestamp,
    };
  }
}

export default IEvent;
export { EventSpec };

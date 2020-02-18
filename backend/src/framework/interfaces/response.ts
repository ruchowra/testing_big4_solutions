/* eslint @typescript-eslint/no-explicit-any: 0 */
/* eslint class-methods-use-this: 0 */

import { OutgoingHttpHeaders } from 'http';
import { injectable } from 'inversify';

@injectable()
abstract class IResponse {
  protected body: object;

  public abstract setResponse(res: any): void;

  public abstract get Headers(): OutgoingHttpHeaders;

  public abstract get StatusCode(): number;

  public abstract get Body(): object;

  public abstract setHeader(name: string, value: string): IResponse;

  public abstract setStatusCode(code: number): IResponse;

  public abstract setBody(body: object): IResponse;

  public abstract transform(): [any, object];

  public abstract get response(): any;
  public abstract set(key: string, value: any): IResponse;
  public abstract get(key: string): any;
}

export default IResponse;

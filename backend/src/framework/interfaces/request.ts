/* eslint @typescript-eslint/no-explicit-any: 0 */
import { IncomingHttpHeaders } from 'http';
import { injectable } from 'inversify';
import { isUndefined } from 'util';

interface PermissionObject {
  [key: string]: boolean | PermissionObject;
}

interface UserObject {
  _id: string;
  name: string;
  'is-admin': boolean;
}

interface TokenPayload {
  user: UserObject;
  permissions: PermissionObject;
  iat: number;
  iss: string;
  exp: number;
  [key: string]: any;
}

@injectable()
abstract class IRequest {
  protected tokenPayload: TokenPayload;
  protected user: UserObject;
  protected permissions: PermissionObject;

  protected headers: IncomingHttpHeaders;

  public get User(): UserObject {
    return this.user;
  }

  public set User(user: UserObject) {
    this.user = user;
  }

  public get Permissions(): PermissionObject {
    return this.permissions;
  }

  public set Permissions(permissions: PermissionObject) {
    this.permissions = permissions;
  }

  public get TokenPayload(): TokenPayload {
    return this.tokenPayload;
  }

  public set TokenPayload(payload: TokenPayload) {
    if (isUndefined(payload.user) || isUndefined(payload.permissions)) {
      throw new Error('Invalid token data');
    }
    this.tokenPayload = payload;
    this.user = payload.user;
    this.permissions = payload.permissions;
  }

  public abstract setRequest(req: any): void;

  public abstract get method(): string;

  public abstract getHeader(name: string): string | string[] | undefined;

  public abstract isContentType(type: string): boolean;

  public abstract get params(): object;

  public abstract get url(): string;

  public abstract get cleanUrl(): string;

  public abstract get baseUrl(): string;

  public abstract getQueryString(override: {[key: string]: string}): string;

  public abstract get request(): any;

  public abstract get(key: string): any;

  public abstract set(key: string, value: any): IRequest;
}

export default IRequest;
export { TokenPayload };

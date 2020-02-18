/* eslint class-methods-use-this: 0 */
/* eslint @typescript-eslint/no-explicit-any: 0 */

import IAuthenticationService from '@interfaces/application-services/authentication';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';

type ResolveFun<T> = (value?: T | PromiseLike<T>) => void;
type RejectFun = (reason?: any) => void;

class MockAuthenticationService extends IAuthenticationService {
  public invalidTokens: string[] = [];
  public permissions: {
    [key: string]: {
      [key: string]: boolean;
    };
  } = {};

  public user: {
    _id: string;
    name: string;
    title: string;
  } = {
    _id: '',
    name: 'Test User',
    title: 'Test Title',
  }

  public async verify(tokenString: string): Promise<string | object> {
    if (this.invalidTokens.indexOf(tokenString) === -1) {
      return {};
    }
    return new Promise<string|object>((resolve, reject): void => {
      jwt.verify(tokenString, process.env.JWTSECRET, {
        algorithms: ['HS512'],
        issuer: 'Ratt Spar',
      }, (err, result): void => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  public async createToken(userId: string): Promise<string> {
    const { user, permissions } = this;
    user._id = userId;
    const payload = Object.assign(user, permissions);
    return jwt.sign(payload, process.env.JWTSECRET, {
      algorithm: 'HS512',
      expiresIn: process.env.JWTLIFETIME,
      subject: userId,
      issuer: 'Ratt Spar',
    });
  }

  public async invalidateToken(token: string): Promise<void> {
    this.invalidTokens.push(token);
  }

  public async createSecureCookieHash(value: string): Promise<string> {
    const ret = new Promise<string>((resolve: ResolveFun<string>, reject: RejectFun): void => {
      try {
        const result = crypto.createHmac('sha256', process.env.COOKIEKEY).update(value).digest('base64');
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
    return ret;
  }
}

export default MockAuthenticationService;

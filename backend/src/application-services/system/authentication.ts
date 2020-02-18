
/* eslint class-methods-use-this: 0 */

import * as jwt from 'jsonwebtoken';
import IAuthenticationService, { JwtPayload } from '@interfaces/application-services/authentication';
import Bind from '@framework/decorators/bind';
import TYPES from '@framework/di/types';
import * as crypto from 'crypto';
import InjectRepository from '@framework/decorators/inject-repository';
import IAuthorRepository from '@interfaces/repositories/author-repository';

type ResolveFun<T> = (value?: T | PromiseLike<T>) => void;
type RejectFun = (reason?: any) => void; // eslint-disable-line

@Bind<AuthenticationService>(TYPES.AuthenticationService)
class AuthenticationService extends IAuthenticationService {
  @InjectRepository('UserRepository') private users: IAuthorRepository;
  // Consider using database store?
  private invalidTokens: string[] = [];

  public async verify(tokenString: string): Promise<string | object> {
    if (this.invalidTokens.indexOf(tokenString) !== -1) {
      return {};
    }
    return new Promise<string|object>((resolve, reject): void => {
      jwt.verify(tokenString, process.env.JWTSECRET, {
        algorithms: ['HS512'],
        issuer: 'Ratt Spar',
      }, (err, payload): void => {
        if (err) {
          reject(err);
        } else {
          resolve(payload);
        }
      });
    });
  }

  public async createToken(userId: string, payload: JwtPayload, refresh: boolean): Promise<string> {
    return new Promise<string>((resolve, reject): void => {
      jwt.sign(payload, process.env.JWTSECRET, {
        algorithm: 'HS512',
        expiresIn: refresh ? process.env.JWTREFRESHLIFETIME : process.env.JWTLIFETIME,
        subject: userId,
        issuer: 'Ratt Spar',
      }, (err, token): void => {
        if (err) {
          reject(err);
        }
        resolve(token);
      });
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

export default AuthenticationService;

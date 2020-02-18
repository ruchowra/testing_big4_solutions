import IMiddleware from '@framework/interfaces/middleware';
import { inject } from 'inversify';
import TYPES from '@framework/di/types';
import IAuthenticationService from '@interfaces/application-services/authentication';
import { TokenPayload } from '@framework/interfaces/request';
import { isUndefined } from 'util';
import Bind from '@framework/decorators/bind';

@Bind<AuthenticationMiddleware>(TYPES.Middleware, 'Authentication')
class AuthenticationMiddleware extends IMiddleware {
  @inject(TYPES.AuthenticationService) protected Authentication: IAuthenticationService;
  public async action(): Promise<boolean> {
    const authorization = this.request.getHeader('Authorization') as string;
    const cookie = this.request.request.cookies[process.env.COOKIENAME];
    // Check secure cookie exists
    if (isUndefined(cookie)) {
      this.response.setStatusCode(401);
      this.response.setBody({
        reason: 'Unauthorized',
      });
      return false;
    }
    const encCookiePromise = this.Authentication.createSecureCookieHash(cookie);
    if (isUndefined(authorization)) {
      this.response.setStatusCode(401);
      this.response.setBody({
        reason: 'Missing authorization header',
      });
      return false;
    }
    const [scheme, token] = authorization.split(' ');
    if (scheme !== 'Bearer') {
      this.response.setStatusCode(401);
      this.response.setBody({
        reason: 'Invalid authorization scheme',
      });
      return false;
    }
    try {
      const payloadPromise = this.Authentication.verify(token);
      const encCookie = await encCookiePromise;
      const payload = await payloadPromise;

      this.request.TokenPayload = payload as TokenPayload;
      if (encCookie !== (payload as TokenPayload).cookie) {
        this.response.setStatusCode(401);
        this.response.setBody({
          reason: 'Unauthorized',
        });
        return false;
      }
    } catch (err) {
      this.response.setStatusCode(401);
      this.response.setBody({
        reason: err.message,
      });
      return false;
    }
    return true;
  }
}

export default AuthenticationMiddleware;

import IApiController from '@framework/interfaces/api-controller';
import ExtApiController from '@framework/decorators/extended-api-controller';
import ExtApiAction from '@framework/decorators/extended-api-action';
import InjectRepository from '@framework/decorators/inject-repository';
import IUserRepository from '@interfaces/repositories/user-repository';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import TYPES from '@framework/di/types';
import IAuthenticationService from '@interfaces/application-services/authentication';
import { inject } from 'inversify';
import IAuthorRepository from '@interfaces/repositories/author-repository';

@ExtApiController<LoginController>(
  'login',
  false,
)
export default class LoginController extends IApiController {
  @InjectRepository('UserRepository') private users: IUserRepository;
  @InjectRepository('AuthorRepository') private userNames: IAuthorRepository;
  @inject(TYPES.AuthenticationService) private auth: IAuthenticationService;

  @ExtApiAction('post', '', ['email', 'password'], '', false)
  public async loginAction(email: string, password: string): Promise<void> {
    try {
      const user = await this.users.getUserByEmail(email.toLowerCase());
      if (!user) {
        this.response.setStatusCode(403);
        this.response.setBody({
          data: {
            message: 'Invalid Credentials',
          },
        });
      } else if (bcrypt.compareSync(password, user.getPasswordHash())) {
        const author = await this.userNames.getAuthor(user.Identifier.toString());
        const cookieString = crypto.pseudoRandomBytes(16).toString('hex');
        const cookie = this.auth.createSecureCookieHash(cookieString);
        this.response.response.cookie(process.env.COOKIENAME, cookieString, {
          httpOnly: true,
          secure: true,
        });
        const token = this.auth.createToken(user.Identifier.toString(), {
          user: {
            _id: author.Identifier.toString(),
            name: author.getName(),
            'is-admin': author.getIsAdmin(),
          },
          cookie: await cookie,
          permissions: {
            messages: {
              read: true,
              write: true,
              delete: true,
            },
          },
        }, false);
        const refreshToken = this.auth.createToken(user.Identifier.toString(),
          { userId: author.Identifier.toString() }, true);
        this.response.setBody({
          data: {
            token: await token,
            refreshToken: await refreshToken,
            cookie: await cookie,
          },
        });
        this.response.setStatusCode(200);
      } else {
        this.response.setStatusCode(403);
        this.response.setBody({
          data: {
            message: 'Invalid Credentials',
          },
        });
      }
    } catch (err) {
      this.response.setStatusCode(500);
      this.response.setBody({
        data: {
          message: 'Internal server error',
        },
      });
    }
  }

  @ExtApiAction('post', 'register', ['email', 'name', 'password', ['isAdmin', false]], '', false)
  public async registerAction(email: string, name: string, password: string, isAdmin: boolean = false): Promise<void> {
    if (!email
        || email.length === 0
        || !name
        || name.length === 0
        || !password
        || password.length === 0) {
      this.response.setStatusCode(400);
      this.response.setBody({
        success: false,
        data: {
          message: 'Invalid parameters.',
        },
      });
      return;
    }
    const user = await this.users.getUserByEmail(email.toLowerCase());
    if (user) {
      this.response.setStatusCode(409);
      this.response.setBody({
        data: {
          message: 'Email already in use.',
        },
      });
    } else {
      const pwd = bcrypt.hashSync(password, 5);
      await this.users.saveUser(email.toLowerCase(), name, pwd, isAdmin);
    }
  }

  @ExtApiAction('get', 'refresh-token/:token', ['token'], '', false)
  public async refreshTokenAction(token: string): Promise<void> {
    try {
      const payload = (await this.auth.verify(token)) as {
        userId: string;
        [key: string]: any; // eslint-disable-line
      };
      const author = await this.userNames.getAuthor(payload.userId);
      const cookieString = crypto.pseudoRandomBytes(16).toString('hex');
      const cookie = this.auth.createSecureCookieHash(cookieString);
      this.response.response.cookie(process.env.COOKIENAME, cookieString, {
        httpOnly: true,
        secure: true,
      });
      const authToken = this.auth.createToken(payload.userId, {
        user: {
          _id: author.Identifier.toString(),
          name: author.getName(),
          'is-admin': author.getIsAdmin(),
        },
        cookie: await cookie,
        permissions: {
          messages: {
            read: true,
            write: true,
            delete: true,
          },
        },
      }, false);
      this.response.setBody({
        data: {
          token: await authToken,
        },
      });
      this.response.setStatusCode(200);
    } catch (err) {
      this.response.setBody({
        data: {
          message: 'Invalid refresh token',
        },
      });
      this.response.setStatusCode(401);
    }
  }
}

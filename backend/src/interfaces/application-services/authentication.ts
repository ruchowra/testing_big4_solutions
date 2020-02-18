import { injectable } from 'inversify';

/* eslint  @typescript-eslint/no-explicit-any: 0 */
/**
 *
 */

interface PermissionObject {
  [key: string]: boolean | PermissionObject;
}

interface JwtPayload {
  iat: number;
  exp: number;
  user: {
    _id: string;
    name: string;
    title: string;
    role: 'user' | 'admin' | 'superuser';
    [key: string]: any;
  };
  permissions: PermissionObject;
  [key: string]: any;
}

/*
  Interface for authentication service,
  allows for the creation, verification and invalidation of JSON webtoken for authentication.

  The payload should contain:
  - A user field, with user ID, name and title information as well as user role
  (superuser, organization administrator, user) at minimum. More information is allowed.
  - A permissions field, which is a nested object structure that describes what permissions a user has.
  Example:
  {
    user: {
      _id: '1234567890ab',
      name: 'Test Testsson',
      signature: 'TeTe',
      title: 'Caretaker',
      role: 'user',
      orgId: '0123456789a',
    },
    permissions: {
      notes: {
        cdef01234567: {
          create: false,
          read: true,
          update: true,
          delete: false,
        },
        890123456789: {
          create: true,
          read: true,
          update: true,
          delete: true
        }
      }
    }
  }
  Example gives user permissions to specific journal IDs.
*/
@injectable()
abstract class IAuthenticationService {
  /*
    Given a JSON webtoken string (extracted from request header in middleware),
    verify that it is a valid token and return the payload.

    If invalid, the function throws Error!
  */
  public async abstract verify(token: string): Promise<string | object>;
  /*
    Create a signed token given a userId and a payload. The application service
    should take the UserID, fetch the user's data from the database, and add it to the
    payload.
  */
  public async abstract createToken(userId: string, payload: {[key: string]: any}, refresh: boolean): Promise<string>; // eslint-disable-line
  /*
    Mark a given token as invalid. The verify function should ensure that a token being used is not
    invalid, by checking against an invalid-token store.
  */
  public async abstract invalidateToken(token: string): Promise<void>;

  /*
    Asynchronously generate hash value for secure cookie. Use this to ensure that
    the same method is used to create and verify cookie strings.
  */
  public async abstract createSecureCookieHash(value: string): Promise<string>;
}

export default IAuthenticationService;
export { JwtPayload };

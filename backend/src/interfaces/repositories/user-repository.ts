import UserAccount from '@domain-objects/accounts/user-account';
import { injectable } from 'inversify';

@injectable()
export default abstract class IUserRepository {
  public async abstract getUser(_id: string): Promise<UserAccount>;
  public async abstract getUserByEmail(email: string): Promise<UserAccount>;
  public async abstract saveUser(email: string, name: string, password: string, isAdmin: boolean): Promise<boolean>;
}

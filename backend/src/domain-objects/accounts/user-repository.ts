import UserAccount from '@domain-objects/accounts/user-account';
import IUserRepository from '@interfaces/repositories/user-repository';
import NamedInject from '@framework/decorators/named-inject';
import TYPES from '@framework/di/types';
import Db from '@framework/adapters/persistence/db';
import Bind from '@framework/decorators/bind';

@Bind<UserRepository>(TYPES.Repository, 'UserRepository')
class UserRepository extends IUserRepository {
  @NamedInject(TYPES.Persistence, 'Db') private persistence: Db;

  public async getUser(_id: string): Promise<UserAccount> {
    const db = await this.persistence.getPersistence();
    const userContext = await db.open('users');
    const user = userContext.find({ _id });
    if (user.length === 0) {
      return undefined;
    }
    return UserAccount.createUserAccount(user[0] as {
      _id: string | number;
      email: string;
      password: string;
    });
  }

  public async getUserByEmail(email: string): Promise<UserAccount> {
    const db = await this.persistence.getPersistence();
    const userContext = await db.open('users');
    const user = userContext.find({ email });
    if (user.length === 0) {
      return undefined;
    }
    return UserAccount.createUserAccount(user[0] as {
      _id: string | number;
      email: string;
      password: string;
    });
  }

  public async saveUser(email: string, name: string, password: string, isAdmin: boolean): Promise<boolean> {
    const db = await this.persistence.getPersistence();
    const userContext = await db.open('users');
    userContext.save({
      _id: '',
      email,
      name,
      password,
      'is-admin': isAdmin,
    });
    userContext.commit();
    return true;
  }
}

export default UserRepository;

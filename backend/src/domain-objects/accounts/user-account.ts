import { AggregateRoot } from '@framework/ddd';

export default class UserAccount extends AggregateRoot {
  private email: string;
  private password: string;

  public getEmail(): string {
    return this.email;
  }

  public getPasswordHash(): string {
    return this.password;
  }

  public static createUserAccount(user: {
    _id: string | number;
    email: string;
    password: string;
  }): UserAccount {
    const ret = new UserAccount(String(user._id));
    ret.email = user.email;
    ret.password = user.password;
    return ret;
  }
}

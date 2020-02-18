import { Entity } from '@framework/ddd';

interface AuthorObject {
  _id: string;
  name: string;
  'is-admin': boolean;
}

export default class Author extends Entity {
  private name: string;
  private isAdmin: boolean;

  public getIsAdmin(): boolean {
    return this.isAdmin;
  }

  public getName(): string {
    return this.name;
  }

  public toObject(): AuthorObject {
    return {
      _id: this.Identifier.toString(),
      name: this.name,
      'is-admin': this.isAdmin,
    };
  }

  public static createAuthor(author: AuthorObject): Author {
    const ret = new Author(author._id);
    ret.name = author.name;
    ret.isAdmin = author['is-admin'];
    return ret;
  }
}

export { AuthorObject };

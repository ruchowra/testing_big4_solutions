import NamedInject from '@framework/decorators/named-inject';
import TYPES from '@framework/di/types';
import IAuthorRepository from '@interfaces/repositories/author-repository';
import Db from '@framework/adapters/persistence/db';
import Bind from '@framework/decorators/bind';
import Author, { AuthorObject } from './author';

@Bind<AuthorRepository>(TYPES.Repository, 'AuthorRepository')
class AuthorRepository extends IAuthorRepository {
  @NamedInject(TYPES.Persistence, 'Db') private persistence: Db;

  public async getAuthor(_id: string): Promise<Author> {
    const db = await this.persistence.getPersistence();
    const authorContext = await db.open('users');
    const author = authorContext.find({ _id: Number(_id) });
    if (author.length === 0) {
      return undefined;
    }
    return Author.createAuthor(author[0] as AuthorObject);
  }
}

export default AuthorRepository;

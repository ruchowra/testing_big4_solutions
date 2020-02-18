import Author from '@domain-objects/post/author';
import { injectable } from 'inversify';

@injectable()
export default abstract class IAuthorRepository {
  public async abstract getAuthor(_id: string): Promise<Author>;
}

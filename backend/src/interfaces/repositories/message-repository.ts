import Message from '@domain-objects/post/message';
import { injectable } from 'inversify';
import { Identifier } from '@framework/ddd';

@injectable()
export default abstract class IMessageRepository {
  public async abstract getMessages(): Promise<Message[]>;
  public async abstract saveMessage(message: Message): Promise<Message>;
  public async abstract findMessage(id: Identifier): Promise<Message>;
  public async abstract deleteMessage(id: Identifier): Promise<void>;
}

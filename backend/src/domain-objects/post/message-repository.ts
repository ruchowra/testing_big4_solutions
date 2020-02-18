import IMessageRepository from '@interfaces/repositories/message-repository';
import NamedInject from '@framework/decorators/named-inject';
import TYPES from '@framework/di/types';
import Bind from '@framework/decorators/bind';
import IPersistence from '@framework/interfaces/persistence';
import { Identifier } from '@framework/ddd';
import Message, { MessageObject } from '@domain-objects/post/message';
import { DbContext } from '@framework/adapters/persistence/db';

@Bind<MessageRepository>(TYPES.Repository, 'MessageRepository')
class MessageRepository extends IMessageRepository {
  @NamedInject(TYPES.Persistence, 'Db') private persistence: IPersistence;

  public async getMessages(): Promise<Message[]> {
    const db = await this.persistence.getPersistence();
    const postContext = await db.open('posts');
    const posts = postContext.find({});
    const ret: Message[] = [];
    posts.forEach((post: {[key: string]: any}): void => { // eslint-disable-line
      ret.push(Message.createMessage(post as MessageObject));
    });
    postContext.commit();
    return ret;
  }

  public async saveMessage(message: Message): Promise<Message> {
    const db = await this.persistence.getPersistence();
    const postContext = await db.open('posts');
    const messageObj = await postContext.save(message.toObject());
    postContext.commit();
    return Message.createMessage(messageObj);
  }

  public async findMessage(id: Identifier): Promise<Message> {
    const db = await this.persistence.getPersistence();
    const postContext = await db.open('posts');
    const msg = postContext.find({ _id: Number(id.toString()) });
    if (msg.length !== 0) {
      return Message.createMessage(msg[0] as MessageObject);
    }
    throw new Error('Message not found.');
  }

  public async deleteMessage(id: Identifier): Promise<void> {
    const db = await this.persistence.getPersistence();
    const postContext: DbContext = await db.open('posts');
    postContext.delete({ _id: Number(id.toString()) });
    postContext.commit();
  }
}

export default MessageRepository;

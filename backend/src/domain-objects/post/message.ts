import { isUndefined } from 'util';
import { AggregateRoot } from '@framework/ddd';
import Author, { AuthorObject } from './author';

interface MessageObject {
  _id: string;
  message: string;
  author: AuthorObject;
  replies: MessageObject[];
  created: number;
}

export default class Message extends AggregateRoot {
  private message: string;
  private author: Author;
  private replies: Message[];
  private created: Date;

  /* TODO: Fill out methods. */
  public getMessage(): string {
    return this.message;
  }

  public getAuthor(): Author {
    return this.author;
  }

  public getReplies(): Message[] {
    return this.replies;
  }

  public removeReply(index: number): void {
  }

  public addReply(reply: Message): void {
  }

  public getReplyCount(): number {
    return null;
  }

  public toObject(): MessageObject {
    return {
      _id: this.Identifier.toString(),
      message: this.message,
      author: this.author.toObject(),
      replies: this.replies.map((reply: Message): MessageObject => {
        return reply.toObject();
      }),
      created: this.created.getTime(),
    };
  }

  public static createMessage(message: MessageObject): Message {
    const ret = new Message(message._id);
    ret.message = message.message;
    ret.replies = (isUndefined(message.replies))
      ? []
      : message.replies.map((reply: MessageObject): Message => {
        return Message.createMessage(reply);
      });
    ret.created = new Date(message.created);
    ret.author = Author.createAuthor(message.author);
    return ret;
  }
}

export { MessageObject };

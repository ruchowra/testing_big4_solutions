import Identifier from './identifier';

export default abstract class Entity {
  protected readonly _id: Identifier

  public constructor(id: Identifier | string) {
    this._id = typeof id === 'string' ? new Identifier(id) : id;
  }

  public get Identifier(): Identifier {
    return this._id;
  }

  public equals(entity: Entity): boolean {
    return this._id.equals(entity._id);
  }
}

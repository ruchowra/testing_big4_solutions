export default class Identifier {
  protected readonly val: string;

  public constructor(id: string) {
    this.val = id.toLowerCase();
  }

  public get Value(): string {
    return this.val;
  }

  public equals(other: Identifier): boolean {
    return this.val === other.Value;
  }

  public valueOf(): string {
    return this.val.valueOf();
  }

  public toString(): string {
    return this.val.toString();
  }
}

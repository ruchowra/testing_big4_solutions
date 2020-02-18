/* eslint class-methods-use-this: 0 */

export default abstract class IFactory {
  public create<T>(Type: {new (...rest: any[]): T}, ...rest: any[]): T { // eslint-disable-line
    return new Type(...rest);
  }
}

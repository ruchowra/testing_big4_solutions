/* eslint @typescript-eslint/no-explicit-any: 0 */
/* eslint class-methods-use-this: 0 */

import { injectable } from 'inversify';

interface ParamObject {
  [key: string]: any;
}

@injectable()
abstract class IValidator {
  public abstract Validate(params: ParamObject): boolean;
}

export default IValidator;

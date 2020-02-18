import IApiController from '@framework/interfaces/api-controller';
import TYPES from '@framework/di/types';
import Bind from './bind';
import Route from './module';
import Module from './api-controller';

interface Constructor<T extends IApiController> {
  new(): T;
}

function ExtApiController<T extends IApiController>(moduleName: string,
  constant: boolean = false): ((target: Constructor<T>) => Constructor<T>) {
  return (target: Constructor<T>): Constructor<T> => {
    const BindDecorator = Bind<T>(TYPES.ApiController, `${moduleName}/${target.name}`, constant);
    const ModuleDecorator = Route<T>(moduleName);
    return Module<T>(ModuleDecorator(BindDecorator(target)));
  };
}

export default ExtApiController;

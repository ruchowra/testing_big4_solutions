import { injectable } from 'inversify';

interface Constructor<T> {
  new(...rest: any[]): T; // eslint-disable-line
}

function Bind<T>(symbol: symbol, name: string = '', constant: boolean = false): (target: Constructor<T>) => Constructor<T> {
  return function decoratorFunction(target: Constructor<T>): Constructor<T> {
    if (typeof process.env.TEST !== 'undefined') {
      // Do not auto-bind in test environments.
      return target;
    }
    Reflect.defineMetadata('bind:injectable', true, target);
    if (name !== '') {
      Reflect.defineMetadata('bind:named', true, target);
      Reflect.defineMetadata('bind:name', name, target);
    } else {
      Reflect.defineMetadata('bind:named', false, target);
      Reflect.defineMetadata('bind:name', '', target);
    }
    Reflect.defineMetadata('bind:symbol', symbol, target);
    Reflect.defineMetadata('bind:constant', constant, target);
    const Injectable = injectable();
    return Injectable(target);
  };
}

export default Bind;

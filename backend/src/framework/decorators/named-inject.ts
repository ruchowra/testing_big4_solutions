import { inject, named } from 'inversify';

function NamedInject(symbol: symbol, name: string): (target: any, propertyKey: string) => void { // eslint-disable-line
  return (target: Function, propertyKey: string): void => {
    const injectDecorator = inject(symbol);
    const namedDecorator = named(name);
    namedDecorator(target, propertyKey);
    injectDecorator(target, propertyKey);
  };
}

export default NamedInject;

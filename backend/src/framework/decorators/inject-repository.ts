import TYPES from '@framework/di/types';
import { inject, named } from 'inversify';

function InjectRepository(name: string): (
  target: any,  // eslint-disable-line
  propertyKey: string) => void {
  return (target: any, // eslint-disable-line
    propertyKey: string): void => {
    const injectDecorator = inject(TYPES.Repository);
    const namedDecorator = named(name);
    namedDecorator(target, propertyKey);
    injectDecorator(target, propertyKey);
  };
}

export default InjectRepository;

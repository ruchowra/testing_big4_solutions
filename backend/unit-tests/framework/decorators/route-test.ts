/* eslint-disable */
import 'reflect-metadata';
import {expect} from 'chai';
import Route from '@framework/decorators/route';
import IApiController from '@framework/interfaces/api-controller';


describe('Framework', () => {
  describe('Decorators', () => {
    describe('Testing @Route decorator', () => {
      it('should store route information in metadata', () => {
        class _ApiController extends IApiController {
          @Route('get', 'endpoint')
          public testAction(_arg: string) {
        
          }
        }
        expect(Reflect.getMetadata('action:method', _ApiController.prototype, 'testAction')).to.equal('get');
        expect(Reflect.getMetadata('action:endpoint', _ApiController.prototype, 'testAction')).to.equal('endpoint');
      })
    });
  });
});
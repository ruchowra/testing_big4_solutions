/* eslint-disable */
import 'reflect-metadata';
import {expect} from 'chai';
import IApiController from '@framework/interfaces/api-controller';
import UseMiddleware from '@framework/decorators/middleware';
describe('Framework', () => {
  describe('Decorators', () => {
    describe('Testing @UseMiddleware decorator', () => {
      it('should throw if action is not named *Action', () => {
        expect( () => {
          class _ApiController extends IApiController {
            @UseMiddleware('test')
            public test(_arg: string) {

            }
          }
        }).to.throw();
      });
      it('should maintain a list of used middleware in action\'s metadata', () => {
        class _ApiController extends IApiController {
          @UseMiddleware('test')
          public testAction(_arg: string) {

          }
        }
        expect(Reflect.getMetadata('action:middleware', _ApiController.prototype, 'testAction')).to.contain('test');
      })
    });
  });
});
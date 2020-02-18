/* eslint-disable */
import 'reflect-metadata';
import {expect} from 'chai';
import ApiAction from '@framework/decorators/api-action';
import IApiController from '@framework/interfaces/api-controller';

describe('Framework', () => {
  describe('Decorators', () => {
    describe('Testing @ApiAction decorator', () => {
      it('should throw if action is not named *Action', () => {
        expect( () => {
          class _ApiController extends IApiController {
            @ApiAction(['_arg'])
            public test(_arg: string) {

            }
          }
        }).to.throw();
      });
      it('should maintain a list of controller actions in controller\'s metadata', () => {
        class _ApiController extends IApiController {
          @ApiAction(['_arg'])
          public testAction(_arg: string) {

          }
          @ApiAction(['_arg'])
          public test2Action(_arg: string) {

          }
        }
        expect(Reflect.getMetadata('controller:actions', _ApiController.prototype)).to.contain('test').and.to.contain('test2');
      })
    });
  });
});
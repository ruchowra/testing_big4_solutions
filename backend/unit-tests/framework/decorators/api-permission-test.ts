/* eslint-disable */
import 'reflect-metadata';
import {expect} from 'chai';
import ApiPermission from '@framework/decorators/api-permission';
import IApiController from '@framework/interfaces/api-controller';

describe('Framework', () => {
  describe('Decorators', () => {
    describe('Testing @ApiPermission decorator', () => {
      it('should throw if action is not named *Action', () => {
        expect( () => {
          class _ApiController extends IApiController {
            @ApiPermission('permission')
            public test(_arg: string) {

            }
          }
        }).to.throw();
      });
      it('should store permission information in method\'s metadata', () => {
        class _ApiController extends IApiController {
          @ApiPermission('data.permission.string')
          public testAction(_arg: string) {

          }
        }
        expect(Reflect.getMetadata('action:permission', _ApiController.prototype, 'testAction')).to.equal('data.permission.string');
      })
    });
  });
});
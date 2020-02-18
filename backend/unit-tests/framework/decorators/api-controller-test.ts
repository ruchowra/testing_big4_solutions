/* eslint-disable */
import 'reflect-metadata';
import {expect} from 'chai';
import ApiController from '@framework/decorators/api-controller';
import IApiController from '@framework/interfaces/api-controller';
import { decorate } from 'inversify';


class _ApiController extends IApiController {

}

describe('Framework', () => {
  describe('Decorators', () => {
    describe('Testing @ApiController decorator', () => {
      it('should fail if decorated class does not have any registered actions', () => {
        expect(() => {
          decorate(ApiController, _ApiController);
        }).to.throw();
      });
      it('should create a list of all a controller\'s action metadata', () => {
        Reflect.defineMetadata('controller:actions', ['Action'], _ApiController.prototype);
        expect(() => {
          decorate(ApiController, _ApiController);
        }).to.not.throw();
      })
    });
  });
});
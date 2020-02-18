/* eslint-disable */
import 'reflect-metadata';
import {expect} from 'chai';
import Module from '@framework/decorators/module';
import IApiController from '@framework/interfaces/api-controller';
import { decorate } from 'inversify';

describe('Framework', () => {
  describe('Decorators', () => {
    describe('Testing @Module decorator', () => {
      it('should create metadata for class', () => {
        class ApiController extends IApiController {

        }
        expect(() => {
          const decorator = Module('test')
          decorate(decorator, ApiController);
          Reflect.getMetadata('controller:module', ApiController)
        }).to.equal('test');
      })
    });
  });
});
/* eslint-disable */
import 'reflect-metadata';
import {expect} from 'chai';
import Bind from '@framework/decorators/bind';
describe('Framework', () => {
  describe('Decorators', () => {
    describe('Testing @Bind decorator', () => {
      it('should create metadata on decorated class', () => {
        @Bind(Symbol.for('test'), 'testName', true)
        class _testClass {}
        expect(Reflect.getMetadata('bind:injectable', _testClass)).to.be.true;
        expect(Reflect.getMetadata('bind:named', _testClass)).to.be.true;
        expect(Reflect.getMetadata('bind:constant', _testClass)).to.be.true;
        expect(Reflect.getMetadata('bind:symbol', _testClass)).to.equal(Symbol.for('test'));
        expect(Reflect.getMetadata('bind:name', _testClass)).to.equal('testName');
      });
    });
  });
});
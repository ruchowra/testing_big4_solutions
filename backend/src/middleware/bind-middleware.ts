/* eslint import/no-mutable-exports: 0 */
// import IMiddleware from '@framework/interfaces/middleware';
import { Container } from 'inversify';
import AutoBind from '@framework/di/autobind';

export default async function bindMiddleware(container: Container): Promise<void> {
  AutoBind(__dirname, container);
}

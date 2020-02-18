import 'reflect-metadata';
import { Container } from 'inversify';
import TYPES from '@framework/di/types';

import ObjectBindings from '@domain-objects/bind-objects';
import MiddlewareBindings from '@middleware/bind-middleware';
import APIBindings from '@api/bind-api-controllers';
import DomainServiceBindings from '@domain-services/bind-domain-services';
import ApplicationServiceBindings from '@application-services/bind-application-services';

import { Request, Response } from '@framework/adapters/express';
import IRequest from '@framework/interfaces/request';
import IResponse from '@framework/interfaces/response';
// import IValidator from '@framework/interfaces/validator';
import IPersistence from '@framework/interfaces/persistence';
import Db from '@framework/adapters/persistence/db';
// import EventBus from '@framework/di/event-bus';

interface MongoOptions {
  hosts: string;
  port: string;
  user: string;
  password: string;
  db: string;
  replSet?: boolean | string;
}

interface MysqlOptions {
  host: string;
  user: string;
  password: string;
}

async function BindInterfaces(): Promise<Container> {
  const container = new Container();
  // Bind default types
  container.bind<IRequest>(TYPES.Request).to(Request);
  container.bind<IResponse>(TYPES.Response).to(Response);

  container.bind<IPersistence>(TYPES.Persistence).toConstantValue(new Db());

  await ObjectBindings(container);
  await DomainServiceBindings(container);
  await ApplicationServiceBindings(container);
  await MiddlewareBindings(container);
  await APIBindings(container);

  return container;
}

export default BindInterfaces;

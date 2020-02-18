import * as path from 'path';
import * as fs from 'fs';
import { Container } from 'inversify';
import IApiController from '@framework/interfaces/api-controller';
import RoutesRegistry from '@framework/di/routes-registry';
import TYPES from '@framework/di/types';

async function bind<T>(Constructor: {new (...rest: any[]): T}, // eslint-disable-line
  container: Container): Promise<void> {
  try {
    const constant = Reflect.getMetadata('bind:constant', Constructor);
    const named = Reflect.getMetadata('bind:named', Constructor);
    const name = Reflect.getMetadata('bind:name', Constructor);
    const symbol = Reflect.getMetadata('bind:symbol', Constructor);
    if (constant && named) {
      container.bind(symbol).toConstantValue(new Constructor()).whenTargetNamed(name);
    } else if (!constant && named) {
      container.bind(symbol).to(Constructor).whenTargetNamed(name);
    } else if (constant && !named) {
      container.bind(symbol).toConstantValue(new Constructor());
    } else {
      container.bind(symbol).to(Constructor);
    }
    if (Constructor.prototype instanceof IApiController) {
      await RoutesRegistry.registerController(container.getNamed<IApiController>(TYPES.ApiController, name),
        name,
        container);
    }
  } catch (err) {
    throw err;
  }
}
async function scanFolder(folderName: string, container: Container): Promise<void> {
  try {
    const allFiles = fs.readdirSync(folderName);
    const scriptFiles = allFiles.filter((name: string): boolean => {
      return name.indexOf('.map') === -1;
    });

    scriptFiles.forEach(async (filename: string): Promise<void> => {
      if (filename === __filename && filename.indexOf('bindings') !== -1) {
        return;
      }
      if (fs.statSync(path.join(folderName, filename)).isDirectory()) {
        scanFolder(path.join(folderName, filename), container);
      } else {
        const target = (await import(path.join(folderName, filename))).default;
        if (typeof target !== 'undefined' && Reflect.hasMetadata('bind:injectable', target)) {
          await bind(target, container);
        }
      }
    });
  } catch (err) {
    throw err;
  }
}

export default function AutoBind(dirname: string, container: Container): void {
  try {
    const allFiles = fs.readdirSync(dirname);
    const directories = allFiles.filter((name: string): boolean => {
      return fs.statSync(path.join(dirname, name)).isDirectory();
    });
    directories.forEach(async (folderName: string): Promise<void> => {
      try {
        await scanFolder(path.join(dirname, folderName), container);
      } catch (err) {
        process.stderr.write(`Error in autobind: ${err.message}\n`);
      }
    });
  } catch (err) {
    throw err;
  }
}

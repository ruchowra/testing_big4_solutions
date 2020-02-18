import * as path from 'path';
import * as fs from 'fs';
import IEvent from '@framework/interfaces/event';

function RegisterEvent(_Type: {new (...rest: any[]): IEvent}): void { // eslint-disable-line
  // No-op; just trigger decorators.
}

export default async (): Promise<void> => {
  const allFiles = fs.readdirSync(__dirname);
  const files = allFiles.filter((name: string): boolean => {
    return name.indexOf('.map') === -1;
  });
  files.forEach(async (filename: string): Promise<void> => {
    RegisterEvent(await import(path.join(__dirname, filename)));
  });
};

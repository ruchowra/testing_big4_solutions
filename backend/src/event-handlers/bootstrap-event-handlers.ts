/* eslint @typescript-eslint/no-explicit-any: 0 */
import * as path from 'path';
import * as fs from 'fs';
import IEventHandler from '@framework/interfaces/event-handler';

function RegisterEventHandler(_Type: {new (): IEventHandler}): void {
  // No-op; just trigger decorators.
}

export default async (): Promise<void> => {
  const allFiles = fs.readdirSync(__dirname);
  const files = allFiles.filter((name: string): boolean => {
    return name.indexOf('.map') === -1;
  });
  files.forEach(async (filename: string): Promise<void> => {
    RegisterEventHandler(await import(path.join(__dirname, filename)));
  });
};

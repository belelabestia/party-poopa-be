import { readFileSync } from 'fs';
import { join } from 'path';

export const init = (modulePath: string) => (path: string) => {
  const fileName = `${path}.sql`;
  const fullPath = join(modulePath, fileName);

  try {
    return readFileSync(fullPath, 'utf-8');
  }
  catch (error) {
    console.error('failed to import sql file', error);
    throw error;
  }
};

import { readFileSync } from 'fs';

const query = (path: string) => readFileSync(`./sql/${path}.sql`, 'utf-8');

export const admin = {
  register: query('admin/register'),
  login: query('admin/login')
};

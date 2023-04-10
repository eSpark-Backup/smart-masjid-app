import { create } from 'apisauce';

export const api = create({
  baseURL: 'http://smartmasjid-api-qa.futuriklabs.com/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

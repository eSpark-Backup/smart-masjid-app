import { create } from 'apisauce';
import { userStore } from '../store/UserStore';

const USER_TOKEN: any = userStore?.token?.get();

export const api = create({
  baseURL: 'https://smartmasjid-api-qa.futuriklabs.com/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: USER_TOKEN ? `Bearer ${USER_TOKEN}` : '',
  },
});

export const xApi = create({
  baseURL: 'https://smartmasjid-api-qa.futuriklabs.com/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'x-api-key':
      'Wmv6F6nHVJkMl8NesNgkNBSj6nveWxytOnmV9aGPxuN5j2ZDhOmoYeI9TdxyhvwA',
  },
});

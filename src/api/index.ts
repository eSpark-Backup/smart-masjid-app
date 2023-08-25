import { create } from 'apisauce';
import { userStore } from '../store/UserStore';

const USER_TOKEN: any = userStore?.token?.get();
const BASE_URL: string = 'https://smartmasjid-api-qa.futuriklabs.com/';

export const api = create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: USER_TOKEN ? `Bearer ${USER_TOKEN}` : '',
  },
});

export const xApi = create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'x-api-key':
      'Wmv6F6nHVJkMl8NesNgkNBSj6nveWxytOnmV9aGPxuN5j2ZDhOmoYeI9TdxyhvwA',
  },
});

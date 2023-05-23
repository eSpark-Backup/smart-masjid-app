import { create } from 'apisauce';
import { userStore } from '../store/UserStore';

const USER_TOKEN: any = userStore?.token?.get();

export const api = create({
  baseURL: 'http://smartmasjid-api-qa.futuriklabs.com/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: USER_TOKEN
      ? `Bearer ${USER_TOKEN}`
      : '',
  },
});

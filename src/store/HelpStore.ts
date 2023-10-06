import { hookstate } from '@hookstate/core';
import { HelpStoreProps } from '../types';

export const helpStore = hookstate<HelpStoreProps>({
  FAQs: [],
  reasons: [],
});

import { hookstate } from '@hookstate/core';
import { ExternalStoreProps, HelpStoreProps } from '../types';

export const helpStore = hookstate<HelpStoreProps>({
  FAQs: [],
  reasons: [],
});

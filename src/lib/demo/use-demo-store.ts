'use client';

import { useSyncExternalStore } from 'react';
import { demoStore } from './store';

export function useDemoStore() {
  const store = useSyncExternalStore(
    (onStoreChange) => demoStore.subscribe(onStoreChange),
    () => demoStore,
    () => demoStore
  );

  return store;
}

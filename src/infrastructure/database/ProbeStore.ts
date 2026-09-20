import type { OfflineProbe } from '../../domain/probe/OfflineProbe';

export type StorageMode = 'native-sqlcipher' | 'web-indexeddb';

export interface ProbeStore {
  readonly mode: StorageMode;
  init(): Promise<void>;
  save(probe: OfflineProbe): Promise<void>;
  list(): Promise<OfflineProbe[]>;
}

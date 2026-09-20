import { offlineProbeSchema, type OfflineProbe } from '../../domain/probe/OfflineProbe';
import type { ProbeStore } from './ProbeStore';

const DATABASE_NAME = 'seaf-web-dev';
const STORE_NAME = 'offline_probe';
const DATABASE_VERSION = 1;

export class WebIndexedDbProbeStore implements ProbeStore {
  readonly mode = 'web-indexeddb' as const;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    this.db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error('Impossible d’ouvrir IndexedDB'));
    });
  }

  async save(probe: OfflineProbe): Promise<void> {
    const db = this.requireDb();
    const validated = offlineProbeSchema.parse(probe);

    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).put(validated);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error('Écriture IndexedDB impossible'));
      transaction.onabort = () => reject(transaction.error ?? new Error('Transaction IndexedDB annulée'));
    });
  }

  async list(): Promise<OfflineProbe[]> {
    const db = this.requireDb();

    return new Promise<OfflineProbe[]>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const request = transaction.objectStore(STORE_NAME).getAll();

      request.onsuccess = () => {
        const probes = request.result
          .map((value) => offlineProbeSchema.parse(value))
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        resolve(probes);
      };

      request.onerror = () => reject(request.error ?? new Error('Lecture IndexedDB impossible'));
    });
  }

  private requireDb(): IDBDatabase {
    if (!this.db) {
      throw new Error('IndexedDB n’est pas initialisée');
    }
    return this.db;
  }
}

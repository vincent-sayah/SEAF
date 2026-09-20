import {
  CapacitorSQLite,
  SQLiteConnection,
  type SQLiteDBConnection
} from '@capacitor-community/sqlite';
import { offlineProbeSchema, type OfflineProbe } from '../../domain/probe/OfflineProbe';
import type { ProbeStore } from './ProbeStore';

const DATABASE_NAME = 'seaf';
const DATABASE_VERSION = 1;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS offline_probe (
  id TEXT PRIMARY KEY NOT NULL,
  created_at TEXT NOT NULL,
  label TEXT NOT NULL,
  xapi_statement TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS xapi_outbox (
  id TEXT PRIMARY KEY NOT NULL,
  statement_id TEXT NOT NULL UNIQUE,
  payload_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  attempt_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  last_attempt_at TEXT,
  last_error TEXT,
  synced_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_xapi_outbox_status
  ON xapi_outbox(status);
`;

export class NativeSqliteProbeStore implements ProbeStore {
  readonly mode = 'native-sqlcipher' as const;

  private readonly sqlite = new SQLiteConnection(CapacitorSQLite);
  private db: SQLiteDBConnection | null = null;

  async init(): Promise<void> {
    const encryptionConfigured = (await this.sqlite.isInConfigEncryption()).result;

    if (!encryptionConfigured) {
      throw new Error('Le chiffrement SQLite natif n’est pas activé dans capacitor.config.ts');
    }

    const hasSecret = (await this.sqlite.isSecretStored()).result;

    if (!hasSecret) {
      await this.sqlite.setEncryptionSecret(this.generateSecret());
    }

    const consistent = (await this.sqlite.checkConnectionsConsistency()).result;
    const existingConnection = consistent
      ? (await this.sqlite.isConnection(DATABASE_NAME, false)).result
      : false;

    this.db = existingConnection
      ? await this.sqlite.retrieveConnection(DATABASE_NAME, false)
      : await this.sqlite.createConnection(
          DATABASE_NAME,
          true,
          'secret',
          DATABASE_VERSION,
          false
        );

    await this.db.open();
    await this.db.execute(SCHEMA);
  }

  async save(probe: OfflineProbe): Promise<void> {
    const db = this.requireDb();
    const validated = offlineProbeSchema.parse(probe);

    await db.run(
      `INSERT OR REPLACE INTO offline_probe
        (id, created_at, label, xapi_statement)
       VALUES (?, ?, ?, ?)`,
      [
        validated.id,
        validated.createdAt,
        validated.label,
        validated.xapiStatement
      ]
    );
  }

  async list(): Promise<OfflineProbe[]> {
    const db = this.requireDb();
    const result = await db.query(
      `SELECT
         id,
         created_at AS createdAt,
         label,
         xapi_statement AS xapiStatement
       FROM offline_probe
       ORDER BY created_at DESC`
    );

    return (result.values ?? []).map((value) => offlineProbeSchema.parse(value));
  }

  private requireDb(): SQLiteDBConnection {
    if (!this.db) {
      throw new Error('La base SQLite n’est pas initialisée');
    }
    return this.db;
  }

  private generateSecret(): string {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
}

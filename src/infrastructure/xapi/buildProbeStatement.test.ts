import { describe, expect, it } from 'vitest';
import { buildProbeStatement } from './buildProbeStatement';

describe('buildProbeStatement', () => {
  it('conserve un identifiant stable et marque le test comme terminé', () => {
    const id = '11111111-1111-4111-8111-111111111111';
    const timestamp = '2026-09-20T16:00:00.000Z';

    const statement = buildProbeStatement(id, timestamp);

    expect(statement.id).toBe(id);
    expect(statement.timestamp).toBe(timestamp);
    expect(statement.result.completion).toBe(true);
    expect(statement.result.success).toBe(true);
    expect(statement.object.id).toContain('/phase0/offline-probe');
  });
});

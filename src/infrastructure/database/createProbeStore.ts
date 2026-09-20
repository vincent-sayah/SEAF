import { Capacitor } from '@capacitor/core';
import type { ProbeStore } from './ProbeStore';
import { NativeSqliteProbeStore } from './NativeSqliteProbeStore';
import { WebIndexedDbProbeStore } from './WebIndexedDbProbeStore';

export function createProbeStore(): ProbeStore {
  if (Capacitor.isNativePlatform()) {
    return new NativeSqliteProbeStore();
  }

  return new WebIndexedDbProbeStore();
}

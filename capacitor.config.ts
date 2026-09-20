import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.gouv.defense.marine.seaf',
  appName: 'S.E.A.F.',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      iosIsEncryption: true,
      iosKeychainPrefix: 'seaf',
      iosBiometric: {
        biometricAuth: false,
        biometricTitle: 'S.E.A.F.'
      },
      androidIsEncryption: true,
      androidBiometric: {
        biometricAuth: false,
        biometricTitle: 'S.E.A.F.',
        biometricSubTitle: 'Accès aux données locales'
      }
    }
  }
};

export default config;

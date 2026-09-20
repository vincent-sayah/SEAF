# Phase 0 — Socle technique

Cette phase implémente un prototype technique minimal destiné à valider les choix structurants avant les modules métier.

## Ce qui est inclus

- React + TypeScript + Ionic ;
- packaging Capacitor ;
- SQLite natif chiffré SQLCipher ;
- génération automatique d'une passphrase sur le terminal au premier lancement ;
- IndexedDB comme stockage web de développement uniquement ;
- détection de l'état réseau sans dépendance de la saisie au réseau ;
- génération locale d'un statement xAPI de test ;
- table `xapi_outbox` préparée côté SQLite ;
- test unitaire du statement xAPI.

## Test navigateur

```bash
npm install
npm run dev
```

Le navigateur utilise IndexedDB. Ce mode permet de tester la persistance et l'ergonomie, mais il ne représente pas le niveau de sécurité de la cible native.

## Test Android

```bash
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Sur Android, la base `seaf` est créée chiffrée via SQLCipher.

### Scénario de validation

1. lancer S.E.A.F. ;
2. créer plusieurs tests locaux ;
3. couper totalement le réseau ;
4. créer un nouveau test ;
5. fermer l'application ;
6. relancer la tablette/application ;
7. vérifier que les enregistrements sont toujours présents ;
8. remettre le réseau ;
9. la présence du réseau doit être détectée sans affecter les données locales.

L'envoi HTTP vers le LRS n'est volontairement pas activé dans cette phase tant que l'URL, le mode d'authentification et la version xAPI du LRS cible ne sont pas figés.

## Limite volontaire

Le répertoire natif `android/` ou `ios/` n'est pas versionné dans ce premier scaffold. Il sera généré après validation du système d'exploitation cible des tablettes.

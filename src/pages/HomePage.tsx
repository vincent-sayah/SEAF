import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { OfflineProbe } from '../domain/probe/OfflineProbe';
import { createProbeStore } from '../infrastructure/database/createProbeStore';
import { buildProbeStatement } from '../infrastructure/xapi/buildProbeStatement';

export default function HomePage() {
  const store = useMemo(() => createProbeStore(), []);
  const [ready, setReady] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const [probes, setProbes] = useState<OfflineProbe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const reload = useCallback(async () => {
    setProbes(await store.list());
  }, [store]);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    void (async () => {
      try {
        await store.init();
        await reload();
        setReady(true);
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : String(reason));
      }
    })();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [reload, store]);

  const createProbe = async () => {
    setBusy(true);
    setError(null);

    try {
      const id = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      const statement = buildProbeStatement(id, createdAt);

      await store.save({
        id,
        createdAt,
        label: `Test local du ${new Date(createdAt).toLocaleString('fr-FR')}`,
        xapiStatement: JSON.stringify(statement)
      });

      await reload();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setBusy(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="seaf-toolbar">
          <IonTitle>
            S.E.A.F<span className="seaf-title-dot">.</span>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="seaf-content">
        <main className="seaf-shell">
          <section className="seaf-intro">
            <h1>Socle technique — Phase 0</h1>
            <p>
              Validation de la persistance locale, du fonctionnement sans réseau et de la
              préparation xAPI avant le développement des modules métier.
            </p>
          </section>

          <section className="seaf-grid" aria-label="État technique">
            <IonCard className="seaf-card">
              <IonCardHeader>
                <IonCardTitle>Stockage</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonBadge color={store.mode === 'native-sqlcipher' ? 'success' : 'warning'}>
                  {store.mode}
                </IonBadge>
                <p>
                  {store.mode === 'native-sqlcipher'
                    ? 'SQLite local chiffré par SQLCipher.'
                    : 'IndexedDB non chiffré réservé au développement web.'}
                </p>
              </IonCardContent>
            </IonCard>

            <IonCard className="seaf-card">
              <IonCardHeader>
                <IonCardTitle>Réseau</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="seaf-status">
                  <span className={`seaf-status-dot ${online ? 'online' : ''}`} />
                  {online ? 'Connexion détectée' : 'Mode hors-ligne'}
                </div>
                <p>La persistance locale ne dépend pas de cet état.</p>
              </IonCardContent>
            </IonCard>

            <IonCard className="seaf-card">
              <IonCardHeader>
                <IonCardTitle>Base locale</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {ready ? (
                  <IonText color="success">Initialisée et disponible.</IonText>
                ) : error ? (
                  <IonText color="danger">Erreur d’initialisation.</IonText>
                ) : (
                  <IonSpinner name="crescent" />
                )}
              </IonCardContent>
            </IonCard>
          </section>

          <section className="seaf-probe-list">
            <IonButton disabled={!ready || busy} onClick={() => void createProbe()}>
              {busy ? 'Écriture…' : 'Créer un test local'}
            </IonButton>

            {error && (
              <IonCard color="danger">
                <IonCardContent>{error}</IonCardContent>
              </IonCard>
            )}

            <h2>Enregistrements persistés : {probes.length}</h2>

            <IonList inset>
              {probes.length === 0 ? (
                <IonItem>
                  <IonLabel>Aucun test local enregistré.</IonLabel>
                </IonItem>
              ) : (
                probes.map((probe) => (
                  <IonItem key={probe.id}>
                    <IonLabel>
                      <h3>{probe.label}</h3>
                      <p className="seaf-probe-id">{probe.id}</p>
                      <p>Statement xAPI préparé localement.</p>
                    </IonLabel>
                  </IonItem>
                ))
              )}
            </IonList>
          </section>
        </main>
      </IonContent>
    </IonPage>
  );
}

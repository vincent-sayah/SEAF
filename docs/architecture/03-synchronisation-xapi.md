# 03 — Synchronisation xAPI / LRS

## 1. Objectif

La synchronisation transforme une évaluation finalisée en un ou plusieurs statements xAPI et les transmet au LRS lorsque le réseau est disponible.

L'évaluation locale reste valide même si le LRS est indisponible.

## 2. Compatibilité xAPI

L'architecture doit isoler la version xAPI derrière un adaptateur.

Deux modes sont prévus :

- **xAPI 1.0.3** pour compatibilité avec les LRS existants ;
- **xAPI 2.0** lorsque le LRS cible le supporte.

La version effective sera paramétrable et testée contre le LRS cible avant mise en production.

## 3. Stratégie de statement

La proposition initiale est de générer au minimum un statement final par évaluation.

Structure logique :

```json
{
  "id": "<uuid-stable>",
  "actor": {
    "objectType": "Agent",
    "account": {
      "homePage": "https://seaf.example/identities",
      "name": "<identifiant-eleve>"
    }
  },
  "verb": {
    "id": "<verbe-xapi>"
  },
  "object": {
    "id": "https://seaf.example/forms/<form-id>/versions/<version>"
  },
  "result": {
    "score": {
      "raw": 15,
      "min": 0,
      "max": 20
    },
    "duration": "PT2M10S",
    "extensions": {
      "https://seaf.example/xapi/extensions/<field-key>": "<valeur>"
    }
  },
  "context": {
    "registration": "<uuid-session-evaluation>",
    "extensions": {
      "https://seaf.example/xapi/context/session-code": "BAT MECAN 2026.1"
    }
  },
  "timestamp": "<date-de-levaluation>"
}
```

Le namespace définitif des activités, verbes et extensions devra être stable et documenté.

## 4. Outbox pattern

Une synchronisation fiable ne doit pas générer le statement uniquement au moment de l'appel réseau.

Flux proposé :

```text
Évaluation finalisée
       |
       v
Transaction SQLite
  - sauvegarde évaluation
  - génération statement
  - insertion XapiOutbox
       |
       v
Utilisateur continue hors-ligne
       |
       v
Connexion disponible
       |
       v
Moteur de synchronisation
       |
       +--> succès --> status = synced
       |
       +--> erreur --> status = pending/error + retry ultérieur
```

Le statement possède un UUID stable créé avant l'envoi.

## 5. Idempotence

Le même résultat ne doit pas être dupliqué lors d'une coupure réseau.

La stratégie recommandée est :

- UUID xAPI déterminé localement ;
- payload figé avant premier envoi ;
- réutilisation du même `statementId` lors d'une reprise ;
- validation du code HTTP et journalisation de l'accusé de réception ;
- aucun passage à `synced` avant succès confirmé.

L'utilisation de `PUT /statements?statementId=...` sera privilégiée lorsque le LRS cible respecte correctement cette opération, car elle facilite l'idempotence.

## 6. Déclenchement

Deux niveaux sont proposés :

- bouton **Synchroniser** toujours disponible ;
- détection réseau pour afficher « connexion disponible — N éléments à synchroniser ».

Le réseau ne déclenche pas obligatoirement un envoi silencieux. Le comportement automatique ou manuel doit être configurable selon les règles d'exploitation.

## 7. Écran de synchronisation

L'utilisateur doit voir :

- nombre d'évaluations en attente ;
- dernière synchronisation réussie ;
- état du LRS ;
- nombre d'erreurs ;
- bouton de relance ;
- détail technique accessible aux administrateurs, sans exposer les secrets.

## 8. Authentification LRS

Les secrets LRS ne doivent jamais être stockés dans LocalStorage, IndexedDB en clair, un fichier de configuration web ou le dépôt Git.

Ils sont conservés dans le coffre sécurisé natif.

Le moteur xAPI reçoit les secrets uniquement au moment de l'appel réseau.

## 9. Données xAPI détaillées

Les champs dynamiques du formulaire sont convertis selon leur nature :

| Champ SEAF | Représentation xAPI proposée |
|---|---|
| Note /20 | `result.score.raw/min/max/scaled` |
| Chronomètre principal | `result.duration` |
| Autres chronos | `result.extensions` en durée ISO 8601 |
| Nombre | extension typée JSON number |
| Case à cocher | extension boolean |
| Texte | extension string |

Pour les formulaires complexes, une future version pourra générer plusieurs statements spécialisés tout en conservant un statement récapitulatif.

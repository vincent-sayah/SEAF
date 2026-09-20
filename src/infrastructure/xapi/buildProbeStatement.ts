export interface ProbeStatement {
  id: string;
  actor: {
    objectType: 'Agent';
    account: {
      homePage: string;
      name: string;
    };
  };
  verb: {
    id: string;
    display: {
      'fr-FR': string;
    };
  };
  object: {
    objectType: 'Activity';
    id: string;
    definition: {
      name: {
        'fr-FR': string;
      };
    };
  };
  result: {
    completion: true;
    success: true;
    extensions: {
      'https://seaf.marine/xapi/extensions/offline-probe': true;
    };
  };
  timestamp: string;
}

export function buildProbeStatement(id: string, timestamp: string): ProbeStatement {
  return {
    id,
    actor: {
      objectType: 'Agent',
      account: {
        homePage: 'https://seaf.marine/identities',
        name: 'seaf-phase0-device'
      }
    },
    verb: {
      id: 'http://adlnet.gov/expapi/verbs/completed',
      display: {
        'fr-FR': 'a terminé'
      }
    },
    object: {
      objectType: 'Activity',
      id: 'https://seaf.marine/activities/phase0/offline-probe',
      definition: {
        name: {
          'fr-FR': 'Test de persistance hors-ligne S.E.A.F.'
        }
      }
    },
    result: {
      completion: true,
      success: true,
      extensions: {
        'https://seaf.marine/xapi/extensions/offline-probe': true
      }
    },
    timestamp
  };
}

import React from 'react';
import { createRoot } from 'react-dom/client';
import { setupIonicReact } from '@ionic/react';
import App from './App';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/flex-utils.css';
import './theme.css';

setupIonicReact({
  mode: 'md'
});

const root = document.getElementById('root');

if (!root) {
  throw new Error('Élément #root introuvable');
}

createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ColorModeProvider } from '@/lib/colorMode';
import { ScoresProvider } from '@/lib/scores';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorModeProvider>
      <ScoresProvider>
        <App />
      </ScoresProvider>
    </ColorModeProvider>
  </StrictMode>,
);

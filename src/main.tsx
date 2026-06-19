import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import LeadFunnel from './LeadFunnel';
import StickyCTA from './StickyCTA';
import ExitIntent from './ExitIntent';
import { FunnelProvider, useFunnel } from './state';

/*
  heroMode:
    'hookB'   — live default: single hook, leads with the money
    'hookA'   — single hook, leads with the leak
    'compare' — design-review mode: both hooks side by side with labels
  showVideo — VSL section (off by default; flip to true to drop in an embed)
*/
function Root() {
  const { theme } = useFunnel();
  return (
    <div data-theme={theme}>
      <LeadFunnel heroMode="hookB" showVideo={false} showLeaks />
      <StickyCTA />
      <ExitIntent />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FunnelProvider>
      <Root />
    </FunnelProvider>
  </React.StrictMode>
);

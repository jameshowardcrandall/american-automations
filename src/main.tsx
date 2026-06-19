import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import LeadFunnel from './LeadFunnel';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/*
      heroMode:
        'hookB'   — live default: single hook, leads with the money ($3,000+/mo)
        'hookA'   — single hook, leads with the leak
        'compare' — design-review mode: shows both hooks side by side with labels
      Flip this to A/B test or preview. The design tool defaulted to 'compare';
      a live visitor should only ever see one hook, so the shipped default is 'hookB'.
    */}
    <LeadFunnel heroMode="hookB" showVideo={false} showLeaks />
  </React.StrictMode>
);

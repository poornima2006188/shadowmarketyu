import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <PrivyProvider
        appId="cmnhim5ig007b0bjl9ykv9r7h"
        config={{
          loginMethods: ['google'],
          appearance: {
            theme: 'dark',
            accentColor: '#10b981',
            showWalletLoginFirst: false,
          },
        }}
      >
        <App />
      </PrivyProvider>
    </BrowserRouter>
);

reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom/client';
// Import the Auth0Provider from '@auth0/auth0-react'.
// Wrap the entire <App /> component with the Auth0Provider.
// Configure it with the 'domain' and 'clientId' from the Auth0 dashboard, loading them from environment variables.
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import './index.css';

const domain = process.env.REACT_APP_AUTH0_DOMAIN!;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID!;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
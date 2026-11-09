import { ClerkProvider } from '@clerk/clerk-react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ClerkAuthBridge } from './components/ClerkAuthBridge.tsx';
import './index.css';

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const application = clerkPublishableKey ? (
  <ClerkProvider
    publishableKey={clerkPublishableKey}
    afterSignOutUrl="/login"
    appearance={{ variables: { colorPrimary: '#2563eb' } }}
  >
    <ClerkAuthBridge>
      <App />
    </ClerkAuthBridge>
  </ClerkProvider>
) : (
  <App />
);

createRoot(document.getElementById('root')!).render(application);

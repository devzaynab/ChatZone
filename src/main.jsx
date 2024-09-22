import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthContextProvider } from './Context/AuthContext.jsx';
import { ChatContextProvider } from './Context/ChatContext.jsx';

createRoot(document.getElementById('root')).render(

<AuthContextProvider>
<ChatContextProvider>

  <StrictMode>
     <App />
  </StrictMode>
   
</ChatContextProvider>
</AuthContextProvider>
);

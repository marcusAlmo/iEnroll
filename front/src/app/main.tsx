import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router';
import "./input.css";
import "./output.css"; 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {/* <AppProvider> */}
        <App />
      {/* </AppProvider> */}
    </BrowserRouter>
  </StrictMode>,
)

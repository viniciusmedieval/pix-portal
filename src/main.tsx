
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

// Create a root element
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

// Create a client
const root = createRoot(rootElement);

// Render the application within error boundaries
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

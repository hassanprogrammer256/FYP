// src/main.jsx
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css'
import { store } from './app/store.js';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from './components/ui/toast-context.jsx';
import ToastContainer from './components/ui/ToastContainer.jsx';

createRoot(document.getElementById('root')).render(
  <Router>
    <Provider store={store}>
      <ToastProvider>
        <App />
        <ToastContainer />
      </ToastProvider>
    </Provider>
  </Router>
);
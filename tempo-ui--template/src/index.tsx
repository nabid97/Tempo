import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import for React 18
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import theme from './themes/theme';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement); // Use createRoot

root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>
);

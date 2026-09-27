import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import App from './App';
import Cursor from './Cursor';
import CommandPalette from './components/CommandPalette';
import MatrixCanvas from './components/MatrixCanvas';
import MiniPlayer from './components/MiniPlayer';
import ErrorBoundary from './ErrorBoundary';

const ProjectDetail = React.lazy(() => import('./ProjectDetail'));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Cursor />
        <MatrixCanvas />
        <CommandPalette />
        <MiniPlayer />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import App from './App';
import Cursor from './Cursor';
import ErrorBoundary from './ErrorBoundary';

const ProjectDetail = React.lazy(() => import('./ProjectDetail'));
const CommandPalette = React.lazy(() => import('./components/CommandPalette'));
const MatrixCanvas = React.lazy(() => import('./components/MatrixCanvas'));
const MiniPlayer = React.lazy(() => import('./components/MiniPlayer'));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Cursor />
        <Suspense fallback={null}>
          <MatrixCanvas />
          <CommandPalette />
          <MiniPlayer />
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

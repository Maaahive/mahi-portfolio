import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import App from './App';
import ProjectDetail from './ProjectDetail';
import Cursor from './Cursor';
import ParticleCanvas from './components/ParticleCanvas';
import CommandPalette from './components/CommandPalette';
import MiniPlayer from './components/MiniPlayer';
import ErrorBoundary from './ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Cursor />
        <ParticleCanvas />
        <CommandPalette />
        <MiniPlayer />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

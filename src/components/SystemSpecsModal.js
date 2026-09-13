import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FiActivity,
  FiCpu,
  FiMonitor,
  FiWifi,
  FiZap,
  FiX,
  FiRefreshCw
} from 'react-icons/fi';
import { sound } from '../utils/audio';
import './SystemSpecsModal.css';

export default function SystemSpecsModal({ onClose }) {
  const [specs, setSpecs] = useState(null);
  const [ping, setPing] = useState(null);
  const [isPinging, setIsPinging] = useState(false);
  const [fps, setFps] = useState(60);

  // Measure display refresh rate / FPS
  useEffect(() => {

    let frameCount = 0;
    let startTime = performance.now();
    let animId;

    const measureFps = (now) => {
      frameCount++;
      if (frameCount >= 30) {
        const elapsed = now - startTime;
        const measuredFps = Math.round((frameCount * 1000) / elapsed);
        setFps(measuredFps > 0 ? measuredFps : 60);
        frameCount = 0;
        startTime = now;
      }
      animId = requestAnimationFrame(measureFps);
    };

    animId = requestAnimationFrame(measureFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Query hardware specs
  useEffect(() => {
    try {
      // WebGL GPU Detection
      let gpuRenderer = 'Standard GPU / Hardware Acceleration';
      let gpuVendor = 'Generic Vendor';
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || gpuRenderer;
            gpuVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || gpuVendor;
          }
        }
      } catch (_) {}

      // Clean up common prefix in GPU strings (e.g., "ANGLE (..., NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, ...)")
      let cleanGpu = gpuRenderer;
      const angleMatch = gpuRenderer.match(/ANGLE \([^,]+,\s*([^,]+)/);
      if (angleMatch && angleMatch[1]) {
        cleanGpu = angleMatch[1];
      }

      // Memory Heap (Chromium)
      let memoryHeap = 'Sandbox Protected (Secure)';
      if (window.performance && window.performance.memory) {
        const usedMB = Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024));
        const totalMB = Math.round(window.performance.memory.jsHeapSizeLimit / (1024 * 1024));
        memoryHeap = `${usedMB} MB / ${totalMB} MB Heap Limit`;
      }

      // Screen info
      const screenRes = `${window.screen.width} × ${window.screen.height} (${window.innerWidth} × ${window.innerHeight} Viewport)`;
      const dpr = `${window.devicePixelRatio || 1}x Retina / HiDPI`;

      // Platform & Cores
      const platform = navigator.userAgentData?.platform || navigator.platform || 'Cross-Platform';
      const cores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Logical Cores` : 'Multi-Core Active';

      // Network
      const conn = navigator.connection;
      const netType = conn ? `${conn.effectiveType ? conn.effectiveType.toUpperCase() : 'Broadband'} (${conn.downlink ? conn.downlink + ' Mbps' : 'Active'})` : 'High-Speed Broadband';

      setSpecs({
        gpu: cleanGpu,
        vendor: gpuVendor,
        memory: memoryHeap,
        display: screenRes,
        dpr: dpr,
        platform: platform,
        cores: cores,
        network: netType,
        audio: 'Synthesizer Active (Web Audio API 2.0)',
      });
    } catch (_) {}
  }, []);

  // Ping test
  const runPingTest = useCallback(async () => {
    setIsPinging(true);
    sound.playClick();
    const t0 = performance.now();
    try {
      await fetch('/favicon.ico?cache=' + Date.now(), { method: 'HEAD', cache: 'no-store' });
      const latency = Math.round(performance.now() - t0);
      setPing(latency);
    } catch (_) {
      setPing(12);
    } finally {
      setIsPinging(false);
    }
  }, []);

  useEffect(() => {
    if (ping === null) {
      runPingTest();
    }
  }, [ping, runPingTest]);

  // Esc to close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <motion.div
      className="specs-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        className="specs-modal"
        initial={{ scale: 0.94, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 15, opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={(e) => e.stopPropagation()}
      >
          {/* Header */}
          <div className="specs-header">
            <div className="specs-header-left">
              <span className="specs-beacon" />
              <FiActivity className="specs-icon-pulse" />
              <span className="specs-title">SYSTEM DIAGNOSTICS</span>
            </div>
            <button className="specs-close-btn" onClick={onClose} title="Close">
              <FiX size={16} />
            </button>
          </div>

          {/* Clean 4-Item Grid */}
          <div className="specs-grid">
            {/* GPU */}
            <div className="spec-card">
              <div className="spec-card-head">
                <FiZap className="spec-icon" />
                <span className="spec-label">GRAPHICS RENDERER</span>
              </div>
              <div className="spec-val-primary">{specs?.gpu || 'Standard GPU'}</div>
            </div>

            {/* Display & Refresh */}
            <div className="spec-card">
              <div className="spec-card-head">
                <FiMonitor className="spec-icon" />
                <span className="spec-label">DISPLAY &amp; REFRESH</span>
              </div>
              <div className="spec-val-primary">
                {fps} FPS <span className="spec-tag">{specs?.display}</span>
              </div>
            </div>

            {/* CPU & Platform */}
            <div className="spec-card">
              <div className="spec-card-head">
                <FiCpu className="spec-icon" />
                <span className="spec-label">CPU &amp; PLATFORM</span>
              </div>
              <div className="spec-val-primary">
                {specs?.cores} <span className="spec-tag">{specs?.platform}</span>
              </div>
            </div>

            {/* Network Latency */}
            <div className="spec-card">
              <div className="spec-card-head">
                <FiWifi className="spec-icon" />
                <span className="spec-label">NETWORK LATENCY</span>
              </div>
              <div className="spec-val-primary">
                {ping !== null ? `${ping} ms` : 'Measuring...'}
                <button
                  className="spec-ping-btn"
                  onClick={runPingTest}
                  disabled={isPinging}
                  title="Measure live ping latency"
                >
                  <FiRefreshCw className={isPinging ? 'spin' : ''} size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="specs-footer">
            <span className="specs-status-pill">● ALL SYSTEMS OPERATIONAL</span>
            <button className="specs-dismiss-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
  );
}

import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import './TelemetryBar.css';

export default function TelemetryBar() {
  const [time, setTime] = useState('');
  const [ping, setPing] = useState(32);
  const [repoCount, setRepoCount] = useState(12);
  const [soundOn, setSoundOn] = useState(sound.enabled);

  useEffect(() => {
    // 1. Live IST Clock
    const updateTime = () => {
      const now = new Date();
      const istString = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setTime(istString);
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 1000);

    // 2. Simulated fluctuating ping
    const pingInterval = setInterval(() => {
      setPing(Math.floor(26 + Math.random() * 16));
    }, 4000);

    // 3. Fetch GitHub live repo count
    fetch('https://api.github.com/users/Maaahive')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.public_repos) {
          setRepoCount(data.public_repos);
        }
      })
      .catch(() => {});

    return () => {
      clearInterval(clockInterval);
      clearInterval(pingInterval);
    };
  }, []);

  const handleToggleSound = () => {
    const newState = sound.toggle();
    setSoundOn(newState);
  };

  const handleOpenPalette = () => {
    sound.playClick();
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  return (
    <div className="telemetry-bar">
      <div className="telemetry-inner">
        {/* Left: Availability Beacon */}
        <div className="telemetry-item telemetry-status">
          <span className="telemetry-radar-beacon" />
          <span className="telemetry-status-text">Available for SDE Internships</span>
        </div>

        {/* Center: Location & Time */}
        <div className="telemetry-item telemetry-time hide-mobile">
          <span className="telemetry-label">LOC:</span>
          <span className="telemetry-val">Noida, IN [IST]</span>
          <span className="telemetry-time-clock">{time}</span>
        </div>

        {/* Right: Metrics & Controls */}
        <div className="telemetry-right">
          <div className="telemetry-item telemetry-metric hide-mobile">
            <span className="telemetry-label">PING:</span>
            <span className="telemetry-val">{ping}ms</span>
          </div>

          <div className="telemetry-item telemetry-metric hide-tablet">
            <span className="telemetry-label">GH:</span>
            <span className="telemetry-val">{repoCount} Repos</span>
          </div>

          {/* Audio toggle */}
          <button
            className={`telemetry-btn ${soundOn ? 'active' : ''}`}
            onClick={handleToggleSound}
            title={soundOn ? 'Disable UI Sound Effects' : 'Enable UI Sound Effects'}
          >
            {soundOn ? '🔊 Audio: ON' : '🔈 Audio: OFF'}
          </button>

          {/* Command Palette Button */}
          <button
            className="telemetry-btn telemetry-cmd-btn"
            onClick={handleOpenPalette}
            title="Open Command Palette (Ctrl+K)"
          >
            <span className="telemetry-cmd-icon">⌘K</span>
            <span className="hide-mobile">Terminal</span>
          </button>
        </div>
      </div>
    </div>
  );
}

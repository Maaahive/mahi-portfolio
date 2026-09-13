import React, { useState, useEffect } from "react";
import { sound } from "../utils/audio";
import "./TelemetryBar.css";

export default function TelemetryBar() {
  const [time, setTime] = useState("");
  const [ping, setPing] = useState(32);
  const [repoCount, setRepoCount] = useState(12);
  const [soundOn, setSoundOn] = useState(sound.enabled);

  useEffect(() => {
    // 1. Live IST Clock
    const updateTime = () => {
      const now = new Date();
      const istString = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setTime(istString);
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 1000);

    // 2. Simulated fluctuating network ping
    const pingInterval = setInterval(() => {
      setPing(Math.floor(26 + Math.random() * 16));
    }, 4000);

    // 3. Live GitHub API count
    fetch("https://api.github.com/users/Maaahive")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.public_repos) {
          setRepoCount(data.public_repos);
        }
      })
      .catch(() => {});

    // 4. Sync sound state changes
    const onSoundChange = (e) => {
      setSoundOn(e.detail);
    };
    window.addEventListener("sound-changed", onSoundChange);

    return () => {
      clearInterval(clockInterval);
      clearInterval(pingInterval);
      window.removeEventListener("sound-changed", onSoundChange);
    };
  }, []);

  const handleToggleSound = () => {
    const newState = sound.toggle();
    setSoundOn(newState);
    window.dispatchEvent(new CustomEvent("sound-changed", { detail: newState }));
  };

  const handleOpenPalette = () => {
    sound.playClick();
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  return (
    <header className="telemetry-bar">
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

          {/* Sound Toggle */}
          <button
            type="button"
            className={`telemetry-btn telemetry-sound-btn ${soundOn ? "active" : ""}`}
            onClick={handleToggleSound}
            title={soundOn ? "Click to Mute Sound FX" : "Click to Enable Tactile Sound FX"}
          >
            <span>{soundOn ? "🔊 Audio: ON" : "🔈 Audio: OFF"}</span>
          </button>

          {/* Command Palette Trigger */}
          <button
            type="button"
            className="telemetry-btn telemetry-cmd-btn"
            onClick={handleOpenPalette}
            title="Open Command Palette (Ctrl+K)"
          >
            <span className="telemetry-cmd-icon">⌘K</span>
            <span className="hide-mobile">Terminal</span>
          </button>
        </div>
      </div>
    </header>
  );
}

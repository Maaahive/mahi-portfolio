import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiChevronDown, FiChevronUp, FiExternalLink } from 'react-icons/fi';
import { sound } from '../utils/audio';
import offTrackLogo from '../assets/projects/off-track/logo.png';
import './MiniPlayer.css';

// Chill lo-fi ambient audio stream (royalty-free stream)
const LOFI_STREAM_URL = 'https://stream.zeno.fm/f3wvbbqmdg8uv';

export default function MiniPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.4;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, []);

  const togglePlay = () => {
    sound.playClick();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        // Fallback or autoplay blocked
      });
    }
  };

  const toggleMute = () => {
    sound.playClick();
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className={`mini-player-root ${isCollapsed ? 'collapsed' : ''}`}>
      <audio ref={audioRef} src={LOFI_STREAM_URL} preload="none" />

      {/* Floating Widget Card */}
      <div className="mini-player-card">
        {/* Left: Spinning Vinyl Disc Logo */}
        <div
          className={`mini-player-vinyl ${isPlaying ? 'playing' : ''}`}
          onClick={() => setIsCollapsed(!isCollapsed)}
          title="Off-Track Audio Engine"
        >
          <img src={offTrackLogo} alt="Off-Track Logo" className="mini-player-logo-img" />
          <div className="mini-player-needle-dot" />
        </div>

        {!isCollapsed && (
          <div className="mini-player-body">
            <div className="mini-player-info">
              <div className="mini-player-title-row">
                <span className="mini-player-brand">Off-Track Engine</span>
                <button
                  className="mini-player-case-study-btn"
                  onClick={() => navigate('/projects/off-track')}
                  title="View Off-Track Case Study"
                >
                  <FiExternalLink size={10} />
                </button>
              </div>
              <div className="mini-player-track">Chill Lofi Study Beats</div>

              {/* Animated Equalizer Bars */}
              <div className={`mini-player-equalizer ${isPlaying ? 'active' : ''}`}>
                <span className="eq-bar bar-1" />
                <span className="eq-bar bar-2" />
                <span className="eq-bar bar-3" />
                <span className="eq-bar bar-4" />
                <span className="eq-bar bar-5" />
              </div>
            </div>

            {/* Controls */}
            <div className="mini-player-controls">
              <button
                className="mini-player-ctrl-btn mini-player-play-btn"
                onClick={togglePlay}
                title={isPlaying ? 'Pause' : 'Play Lo-Fi Stream'}
              >
                {isPlaying ? <FiPause size={13} /> : <FiPlay size={13} style={{ marginLeft: '2px' }} />}
              </button>

              <button
                className="mini-player-ctrl-btn"
                onClick={toggleMute}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <FiVolumeX size={12} /> : <FiVolume2 size={12} />}
              </button>

              <button
                className="mini-player-ctrl-btn"
                onClick={() => setIsCollapsed(true)}
                title="Collapse player"
              >
                <FiChevronDown size={12} />
              </button>
            </div>
          </div>
        )}

        {isCollapsed && (
          <button
            className="mini-player-expand-btn"
            onClick={() => setIsCollapsed(false)}
            title="Expand Off-Track Player"
          >
            <FiChevronUp size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  SiElectron,
  SiSpotify,
  SiNodedotjs,
  SiJavascript,
  SiReact,
  SiSocketdotio,
  SiMongodb,
  SiTailwindcss,
  SiGithub,
  SiExpress,
  SiAnsys,
  SiScikitlearn,
  SiPython,
} from "react-icons/si";
import {
  FiArrowLeft,
  FiExternalLink,
  FiDownload,
  FiUsers,
  FiEye,
  FiGitBranch,
  FiMaximize2,
  FiX,
  FiBookOpen,
} from "react-icons/fi";
import { PiWaveformBold } from "react-icons/pi";
import { LuCircuitBoard } from "react-icons/lu";

// Images - Off-Track
import offTrackLogo from "./assets/projects/off-track/logo.png";
import offTrackPlayer from "./assets/projects/off-track/player.png";
import offTrackLyrics from "./assets/projects/off-track/lyrics.png";
import offTrackAppearance from "./assets/projects/off-track/appearance.png";
import offTrackShortcuts from "./assets/projects/off-track/shortcuts.png";
import offTrackCovers from "./assets/projects/off-track/covers.png";
import offTrackQueue from "./assets/projects/off-track/queue.png";

// Images - Cartel
import cartelLanding from "./assets/projects/cartel/landing.png";
import cartelLobby from "./assets/projects/cartel/lobby.png";
import cartelCatalog from "./assets/projects/cartel/catalog.png";
import cartelSplitCart from "./assets/projects/cartel/split-cart.png";
import cartelCheckout from "./assets/projects/cartel/checkout.png";

// Images - SIW Sensor
import siwPrototype from "./assets/projects/siw-sensor/sensor-prototype.jpg";
import siwOilTesting from "./assets/projects/siw-sensor/oil-testing.jpg";
import siwVnaSetup from "./assets/projects/siw-sensor/vna-setup.jpg";
import siwOilsenseGui from "./assets/projects/siw-sensor/oilsense-gui.png";
import siwOilsensePrediction from "./assets/projects/siw-sensor/oilsense-prediction.png";
import siwDielectricGui from "./assets/projects/siw-sensor/dielectric-gui.png";
import siwHfssModel from "./assets/projects/siw-sensor/hfss-model.png";
import siwS11Response from "./assets/projects/siw-sensor/s11-response.png";

import "./ProjectDetail.css";

const PROJECT_DETAILS = {
  "off-track": {
    id: "001",
    name: "Off-Track",
    logo: offTrackLogo,
    tagline: "Lightweight floating frosted-glass desktop music player. Ad-free YouTube audio streaming with two-way Spotify library sync.",
    status: "Desktop App",
    heroImg: offTrackPlayer,
    heroCaption: "Floating frosted-glass desktop player with dynamic waveform visualizer and transparent canvas.",
    github: "https://github.com/Maaahive/Off-Track",
    live: null,
    downloadUrl: "https://github.com/Maaahive/Off-Track/releases",
    tech: [
      { name: "Electron", Icon: SiElectron, color: "#47848f" },
      { name: "Node.js", Icon: SiNodedotjs, color: "#68a063" },
      { name: "JavaScript", Icon: SiJavascript, color: "#f7df1e" },
      { name: "Spotify API", Icon: SiSpotify, color: "#1db954" },
    ],
    problem: [
      "Every modern music streaming option has a compromise. Spotify free tier interrupts listening with audio ads and locks down mobile features. YouTube Music has a vast catalog but lives trapped in a heavy browser tab, competing for RAM and CPU with your work applications.",
      "I wanted something featherlight - a frameless, floating desktop widget that feels like a native operating system utility rather than another bloated browser window.",
      "Off-Track bridges both ecosystems: it connects to your existing Spotify account to access your curated playlists and liked songs, but streams the underlying audio directly from YouTube ad-free without web browser overhead."
    ],
    howItWorks: [
      "Electron powers the native desktop shell. The architecture is split cleanly between a background main process and an optimized renderer process. The main process handles operating system integrations: OAuth 2.0 PKCE authentication with Spotify, local configuration caching, global keyboard hook listeners, and child-process audio streaming.",
      "Spotify Web API is utilized strictly for high-fidelity metadata - tracks, artists, album artwork, and user playlists. When playback is triggered, the engine resolves the track via YouTube audio streaming protocols (ytdl-core / yt-dlp) and pipes the stream directly through HTML5 audio.",
      "The window is engineered with hardware-accelerated CSS backdrop filters for true frosted-glass transparency. It supports an always-on-top 'Ghost Mode' that lets you click through the player to background applications while music keeps playing."
    ],
    gallery: [
      {
        title: "Synced Real-Time Lyrics",
        desc: "Karaoke-style synchronized live lyrics fetched in real-time, featuring line-by-line glow animation and microsecond offset tuning.",
        img: offTrackLyrics,
      },
      {
        title: "Glass Transparency & Themes",
        desc: "Deep visual customization with transparency sliders, brightness controls, and built-in aesthetic themes (Pure Glass, Cyber Glow, Midnight Lo-Fi).",
        img: offTrackAppearance,
      },
      {
        title: "Global Background Shortcuts",
        desc: "System-wide keyboard shortcuts (Ctrl+F search, Ctrl+G transparency, Ctrl+Y sync) that work even when running other games or full-screen apps.",
        img: offTrackShortcuts,
      },
      {
        title: "Album Art & Spinning Vinyl",
        desc: "Custom cover manager allowing listeners to upload custom artwork, choose preloaded retro covers, or toggle a rotating physical vinyl animation.",
        img: offTrackCovers,
      },
      {
        title: "Up Next Queue Management",
        desc: "Quick-access playback queue drawer with drag-and-drop reordering, instantaneous filtering, and queue flushing.",
        img: offTrackQueue,
      },
    ],
    hardPart: [
      "The most complex engineering challenge was the Spotify-to-YouTube matching bridge. Because the two platforms have completely different search indexes, querying a Spotify title on YouTube often returned live concert bootlegs, 10-hour loops, speed-up remixes, or acoustic covers rather than the official master recording.",
      "To solve this, I designed a multi-stage scoring heuristic: first filtering candidate videos by strict artist and title token overlap, then computing duration variance (rejecting results that differed by more than 8 seconds), and penalizing titles containing terms like 'live', 'cover', 'instrumental', or 'remix' unless explicitly specified in the Spotify metadata.",
      "This increased automated track matching precision to over 96%, creating a seamless listening experience that rarely requires manual intervention."
    ],
    stats: [
      { value: "100+", label: "Release Downloads", Icon: FiDownload },
      { value: "81", label: "Repo Views (14d)", Icon: FiEye },
      { value: "19", label: "Unique Visitors", Icon: FiUsers },
    ],
    reflection: "Off-Track started as a personal itch to build a better audio companion and became a project with real, enthusiastic daily users. Building a desktop application required mastering packaging, inter-process communication, and system hooks - giving me deep appreciation for software that stays responsive and out of the user's way."
  },

  cartel: {
    id: "002",
    name: "Cartel",
    logo: null,
    tagline: "Real-time collaborative grocery shopping platform with automated bill splitting and synchronized multi-user carts.",
    status: "Live on Render",
    heroImg: cartelCheckout,
    heroCaption: "Automated checkout calculation: itemized individual goods, fractional shared items, and proportional delivery fee distribution.",
    github: "https://github.com/Maaahive/Cartel",
    live: "https://cartel-f4hf.onrender.com/",
    tech: [
      { name: "React", Icon: SiReact, color: "#61dafb" },
      { name: "Node.js", Icon: SiNodedotjs, color: "#68a063" },
      { name: "Express", Icon: SiExpress, color: "#ffffff" },
      { name: "Socket.IO", Icon: SiSocketdotio, color: "#010101" },
      { name: "MongoDB", Icon: SiMongodb, color: "#47a248" },
      { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#38bdf8" },
    ],
    problem: [
      "Ordering groceries with flatmates or teammates is notoriously chaotic. One person collects fragmented orders across WhatsApp messages, attempts to remember who asked for which brand of chips, pays the entire bill upfront, and then spends tedious time calculating who owes what.",
      "Inevitably, someone forgets what they requested, joint items like milk or cooking oil cause awkward math arguments, and settlement delays drag on for weeks.",
      "Cartel eliminates this entirely. Everyone connects to a synchronized session using a 6-character room code, browses the store catalog together, adds items for themselves or marks items to split, and watches the shared bill calculate everyone's exact share in real time."
    ],
    howItWorks: [
      "The architecture is centered on full-duplex WebSocket communication via Socket.IO built on top of an Express REST backend. When a host initiates a session, a cryptographic room code is generated and bound to an active MongoDB session document.",
      "Every user action - toggling a shared item, updating quantities, or joining a split - emits a granular event to the server. The server acts as the single source of truth, updating session state atomically and broadcasting differential state updates to all sockets subscribed to that room.",
      "Security is handled via stateless JWT authentication stored in HTTP-only cookies. Even if someone accidentally refreshes or loses connection, session persistence allows them to immediately rejoin their active cart without data loss."
    ],
    gallery: [
      {
        title: "Session Lobby & Room Codes",
        desc: "Instant session creation with shareable 6-digit codes. Live avatar badges display all connected members as they join the room.",
        img: cartelLobby,
      },
      {
        title: "Interactive Catalog & Dual Actions",
        desc: "Product grid offering dual-action buttons on every item: 'Add for me' for private items or 'Split' to invite flatmates to share the cost.",
        img: cartelCatalog,
      },
      {
        title: "Live Shared Cart & Real-Time Sync",
        desc: "Dynamic cart view showing both private items and shared items with instant member tags and one-click 'Join Split' or 'Leave Split' controls.",
        img: cartelSplitCart,
      },
      {
        title: "Per-Person Automated Settlement",
        desc: "Final checkout breakdown generating itemized receipt cards for each participant, dividing shared items into exact fractional shares and distributing delivery fees.",
        img: cartelCheckout,
      },
      {
        title: "Minimalist Onboarding",
        desc: "Distraction-free entry page allowing users to either launch a new shopping session or join an existing circle in seconds.",
        img: cartelLanding,
      },
    ],
    hardPart: [
      "The most challenging problem was preventing race conditions and cart state divergence during simultaneous multi-user edits. In high-latency conditions, two roommates clicking 'Join Split' on the same item within milliseconds could result in duplicate entries or conflicting fractional totals.",
      "Instead of optimistic client-side mutation, I implemented an event-driven server-authoritative pipeline. Every mutation is queued and processed serially against the session state in memory, validated against inventory constraints, and persisted before broadcasting the updated snapshot.",
      "This eliminated desynchronization bugs entirely while maintaining instantaneous sub-50ms visual updates over WebSockets."
    ],
    stats: [
      { value: "44", label: "Git Clones (14d)", Icon: FiGitBranch },
      { value: "23", label: "Unique Cloners", Icon: FiUsers },
      { value: "Live", label: "Deployed on Render", Icon: FiExternalLink },
    ],
    reflection: "Cartel was my deep dive into real-time collaborative state. It forced me to think rigorously about distributed state ownership, WebSocket life cycles, and edge cases where multiple users interact with shared financial data simultaneously. Seeing over 23 developers clone and study the repository proved the relevance of the problem."
  },

  "siw-oil-sensor": {
    id: "003",
    name: "ML-Assisted SIW Microwave Sensor",
    logo: null,
    tagline: "Substrate Integrated Waveguide (SIW) resonant microwave sensor for rapid, non-destructive edible oil adulteration detection, combined with RF characterization and a Machine Learning classification pipeline.",
    status: "Research Paper & Prototype",
    paperTitle: "MACHINE LEARNING-ASSISTED SIW MICROWAVE SENSOR FOR RAPID AND NON-DESTRUCTIVE DETECTION OF MUSTARD OIL ADULTERATION",
    authors: "Mahi Agarwal, Navya Jain, Dr. Abhay Kumar, Dr. Nidhi Tewari, Prof. Shweta Srivastava",
    affiliation: "Department of Electronics and Communication Engineering, Jaypee Institute of Information Technology, Noida",
    heroImg: siwPrototype,
    heroCaption: "Fabricated Substrate Integrated Waveguide (SIW) sensor prototype on FR-4 PCB with plated via fences, complementary split ring resonator (CSRR) sensing aperture, and 50Ω SMA connector.",
    github: null,
    live: null,
    tech: [
      { name: "Core ECE", Icon: LuCircuitBoard, color: "#10b981" },
      { name: "Ansys HFSS", Icon: SiAnsys, color: "#f59e0b" },
      { name: "RF & VNA", Icon: PiWaveformBold, color: "#a855f7" },
      { name: "Machine Learning", Icon: SiScikitlearn, color: "#f97316" },
      { name: "Python", Icon: SiPython, color: "#3776ab" },
    ],
    problem: [
      "Edible oil adulteration—most notably blending premium mustard oil with cheaper palmolein or mineral oils—poses widespread consumer health hazards and commercial exploitation across global food supply chains.",
      "Traditional testing techniques such as High-Performance Liquid Chromatography (HPLC), Argemone Oil Adulteration Kits, and Gas-Liquid Chromatography (GLC) provide chemical accuracy, but they are inherently destructive, slow, reagent-intensive, and require trained laboratory staff. This makes everyday screening in local markets and distribution checkpoints impossible.",
      "We set out to engineer a low-cost, portable, reusable, and instantaneous alternative that characterizes liquid purity non-destructively through microwave dielectric perturbation (7 GHz to 12 GHz), supplemented by an automated software classification pipeline."
    ],
    howItWorks: [
      "Electromagnetic Sensor Design: Modeled in Ansys HFSS, the sensor utilizes Substrate Integrated Waveguide (SIW) technology fabricated on an economical 1.6 mm FR-4 substrate (εr ≈ 4.4). Dense metalized via walls (1 mm diameter, 1.5 mm pitch) trap electromagnetic fields like a metallic cavity resonator while maintaining planar PCB simplicity. A pair of Complementary Split Ring Resonators (CSRRs) are etched at the tip to concentrate fringing electric fields in the sensing zone.",
      "Dielectric Perturbation Sensing: When the CSRR aperture is immersed into oil, the liquid acts as a dielectric load. Because pure mustard oil and palmolein adulterant have differing dielectric permittivities (εr), altering the adulterant concentration (10% to 50%) shifts the resonant frequency (8.20 GHz – 8.38 GHz) and alters reflection loss (|S11|) measured on an Anritsu Vector Network Analyzer.",
      "Dual-GUI & ML Inference Pipeline: To automate analysis, we engineered two custom software systems: a Tkinter GUI to calculate empirical dielectric constants from coaxial capacitance bench measurements (DSL-01), and 'OilSense', a dark-mode desktop app. OilSense feeds standardized VNA frequency-magnitude curves into a 300-tree Random Forest classifier to instantly predict impurity percentage tiers without manual S-parameter inspection."
    ],
    gallery: [
      {
        title: "Fabricated SIW Sensor Prototype",
        desc: "Double-sided FR-4 PCB sensor showing the plated via fences, 50Ω microstrip feedline, SMA port, and dual CSRR defect sensing rings.",
        img: siwPrototype,
      },
      {
        title: "VNA In-Situ Immersion Testing",
        desc: "Calibrated Anritsu VNA reflection measurement (S11) while dipping the CSRR sensing region into pure and adulterated mustard oil samples.",
        img: siwOilTesting,
      },
      {
        title: "OilSense ML Detection App",
        desc: "Desktop machine learning application predicting adulteration levels and presenting immediate purity badges (e.g. '50% Adulteration - High Adulteration').",
        img: siwOilsensePrediction,
      },
      {
        title: "OilSense Architecture & Model Dashboard",
        desc: "Trained Random Forest model interface evaluating 201-point frequency sweeps received directly from VNA CSV exports.",
        img: siwOilsenseGui,
      },
      {
        title: "Dielectric Constant Calculator GUI",
        desc: "Custom Python Tkinter app fitting dC/dh slopes from the SES Instruments DSL-01 coaxial cylinder to calculate liquid dielectric constants (k ≈ 3.127 for pure oil).",
        img: siwDielectricGui,
      },
      {
        title: "Ansys HFSS Electromagnetic Model",
        desc: "Full-wave 3D simulation setup including wave port excitation, via-wall cavity boundaries, and cylindrical sample container.",
        img: siwHfssModel,
      },
      {
        title: "Measured S11 Resonant Shifts",
        desc: "Experimental return loss curves from 7 to 12 GHz showing monotonic resonance dips and depth changes from pure oil down to 50% adulteration.",
        img: siwS11Response,
      },
      {
        title: "Portable VNA Measurement Bench",
        desc: "One-port calibration and testing station running frequency sweeps over the X-band (7 GHz – 12 GHz) with SOL calibration.",
        img: siwVnaSetup,
      },
    ],
    hardPart: [
      "Optimizing High-Q Cavity Resonance on Lossy FR-4: Standard microwave substrates like Rogers RT/duroid offer low loss tangents but are cost-prohibitive for mass food-safety deployment. Standard FR-4 is lossy (tan δ ≈ 0.02), which broadens resonance dips and dampens Q-factor. We performed iterative parametric sweeps in HFSS—tuning via pitch, cavity dimensions, and CSRR ring widths—to produce sharp, repeatable resonance notches with over -20 dB return loss.",
      "Navigating ML Generalization with Dense Waveform Sweeps: While our Random Forest model reached 95% training accuracy on the 1,407-point dataset, 5-fold cross-validation yielded 21.61% ± 2.36%. The challenge was that 201 sweep points across 6 closely spaced adulteration levels (10% to 50%) caused high variance between cross-validation folds. Addressing this required candid scientific analysis in the paper on the necessity of broader sample sets and continuous regression features.",
      "Repeatable Immersion & Cross-Contamination Control: Viscous oils leave residual films that distort subsequent electromagnetic measurements. We established a rigorous cleaning protocol using 80% ethanol solvent washes and controlled drying intervals, combined with rigid foam jig fixtures to maintain exact millimeter immersion depth."
    ],
    stats: [
      { value: "7–12 GHz", label: "Frequency Range", Icon: PiWaveformBold },
      { value: "10%–50%", label: "Adulterant Range", Icon: FiEye },
      { value: "5 Authors", label: "Paper Contributors", Icon: FiUsers },
      { value: "1,407 pts", label: "VNA ML Points", Icon: LuCircuitBoard },
    ],
    reflection: "This project bridged the gap between electromagnetic theory, hardware prototyping, and modern software engineering. Taking a concept from Maxwell's equations and HFSS 3D modeling through PCB fabrication, VNA bench validation, and finally into Python GUIs and Machine Learning models showed me the true power of marrying core ECE hardware with intelligent software."
  },
};

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeModalImg, setActiveModalImg] = useState(null);

  const project = PROJECT_DETAILS[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div className="pd-not-found">
        <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Case Study Not Found</h2>
        <p style={{ color: '#9ca3af', maxWidth: '420px', textAlign: 'center', margin: 0 }}>
          The requested project case study was not found or has returned to the main portfolio.
        </p>
        <button onClick={() => navigate("/")} className="pd-back-btn" style={{ marginTop: '0.5rem' }}>
          <FiArrowLeft size={16} />
          <span>Back to portfolio</span>
        </button>
      </div>
    );
  }

  return (
    <div className="pd-root">
      {/* Background ambient blobs */}
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />

      <div className="pd-container">
        {/* Navigation back */}
        <motion.button
          className="pd-back-btn"
          onClick={() => navigate("/")}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FiArrowLeft size={16} />
          <span>Back to portfolio</span>
        </motion.button>

        {/* Header section */}
        <motion.div
          className="pd-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="pd-header-top">
            <div className="pd-header-meta">
              <span className="pd-id">{`// ${project.id}`}</span>
              {project.status && (
                <span className="pd-status-badge">
                  <span className="live-dot" />
                  {project.status}
                </span>
              )}
            </div>

            {project.logo && (
              <div className="pd-project-logo-wrap">
                <img src={project.logo} alt={`${project.name} Logo`} className="pd-project-logo" />
              </div>
            )}
          </div>

          <h1 className="pd-title">{project.name}</h1>
          <p className="pd-tagline">{project.tagline}</p>

          {project.paperTitle && (
            <div
              className="pd-paper-banner"
              style={{
                background: "rgba(168, 85, 247, 0.08)",
                border: "1px solid rgba(168, 85, 247, 0.25)",
                borderRadius: "8px",
                padding: "0.9rem 1.15rem",
                margin: "1.1rem 0 1.25rem",
                fontSize: "0.82rem",
                color: "#e2e8f0",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  color: "var(--purple-light, #c084fc)",
                  fontWeight: 600,
                  fontSize: "0.72rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "0.4rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                }}
              >
                <FiBookOpen size={14} /> Research Paper & Minor Project
              </div>
              <div
                style={{
                  fontWeight: 600,
                  marginBottom: "0.4rem",
                  color: "#f8fafc",
                  fontSize: "0.86rem",
                  lineHeight: 1.4,
                }}
              >
                "{project.paperTitle}"
              </div>
              <div style={{ color: "#94a3b8", fontSize: "0.76rem", lineHeight: 1.5 }}>
                <strong style={{ color: "#cbd5e1" }}>Authors:</strong> {project.authors}
              </div>
              {project.affiliation && (
                <div style={{ color: "#64748b", fontSize: "0.72rem", marginTop: "0.25rem" }}>
                  {project.affiliation}
                </div>
              )}
            </div>
          )}

          <div className="pd-tech-row">
            {project.tech.map(({ name, Icon, color }) => (
              <span className="pd-tech-tag" key={name}>
                <Icon size={14} style={{ color }} />
                <span>{name}</span>
              </span>
            ))}
          </div>

          <div className="pd-header-links">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="pd-link-btn pd-link-secondary"
              >
                <SiGithub size={16} />
                <span>Source Code</span>
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="pd-link-btn pd-link-primary"
              >
                <FiExternalLink size={16} />
                <span>Live Demo</span>
              </a>
            )}
            {project.downloadUrl && (
              <a
                href={project.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="pd-link-btn pd-link-primary"
              >
                <FiDownload size={16} />
                <span>Download App</span>
              </a>
            )}
          </div>
        </motion.div>

        {/* Hero showcase image */}
        <motion.div
          className="pd-hero-img-wrap"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img
            src={project.heroImg}
            alt={project.name}
            className="pd-hero-img clickable"
            loading="eager"
            decoding="async"
            onClick={() => setActiveModalImg({ src: project.heroImg, title: project.name })}
          />
          <div className="pd-hero-caption">{project.heroCaption}</div>
        </motion.div>

        {/* Content sections */}
        <div className="pd-content">
          {/* The Problem */}
          <motion.section
            className="pd-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="pd-section-label">01 // The Problem</div>
            {project.problem.map((para, idx) => (
              <p className="pd-prose" key={idx}>
                {para}
              </p>
            ))}
          </motion.section>

          <div className="pd-divider" />

          {/* How It Works */}
          <motion.section
            className="pd-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="pd-section-label">02 // Architecture & How It Works</div>
            {project.howItWorks.map((para, idx) => (
              <p className="pd-prose" key={idx}>
                {para}
              </p>
            ))}
          </motion.section>

          <div className="pd-divider" />

          {/* Visual Showcase Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <motion.section
              className="pd-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="pd-section-label">03 // Visual Walkthrough & Features</div>
              <p className="pd-prose pd-prose-lead">
                Key user workflows and architectural interfaces captured from the production build:
              </p>

              <div className="pd-gallery-grid">
                {project.gallery.map((item, idx) => (
                  <div className="pd-gallery-card" key={idx}>
                    <div
                      className="pd-gallery-thumb-wrap clickable"
                      onClick={() => setActiveModalImg({ src: item.img, title: item.title })}
                    >
                      <img src={item.img} alt={item.title} className="pd-gallery-thumb" loading="lazy" decoding="async" />
                      <div className="pd-gallery-overlay">
                        <FiMaximize2 size={20} />
                      </div>
                    </div>
                    <div className="pd-gallery-meta">
                      <div className="pd-gallery-title">{item.title}</div>
                      <p className="pd-gallery-desc">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          <div className="pd-divider" />

          {/* The Hard Part */}
          <motion.section
            className="pd-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="pd-section-label">04 // The Hardest Technical Challenge</div>
            {project.hardPart.map((para, idx) => (
              <p className="pd-prose" key={idx}>
                {para}
              </p>
            ))}
          </motion.section>

          <div className="pd-divider" />

          {/* Stats By the numbers */}
          <motion.section
            className="pd-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="pd-section-label">05 // By The Numbers</div>
            <div className="pd-stats-grid">
              {project.stats.map(({ value, label, Icon }) => (
                <div className="pd-stat-card" key={label}>
                  <Icon size={22} className="pd-stat-icon" />
                  <div className="pd-stat-value">{value}</div>
                  <div className="pd-stat-label">{label}</div>
                </div>
              ))}
            </div>
          </motion.section>

          <div className="pd-divider" />

          {/* Reflection */}
          <motion.section
            className="pd-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="pd-section-label">06 // Engineering Reflection</div>
            <p className="pd-prose pd-prose-italic">{project.reflection}</p>
          </motion.section>
        </div>

        {/* Footer Navigation */}
        <div className="pd-footer-nav">
          <button className="pd-back-btn" onClick={() => navigate("/")}>
            <FiArrowLeft size={16} />
            <span>Back to portfolio</span>
          </button>
        </div>
      </div>

      {/* Image Modal Lightbox */}
      <AnimatePresence>
        {activeModalImg && (
          <motion.div
            className="pd-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModalImg(null)}
          >
            <button
              className="pd-modal-close"
              onClick={() => setActiveModalImg(null)}
              aria-label="Close image"
            >
              <FiX size={24} />
            </button>
            <motion.div
              className="pd-modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeModalImg.src}
                alt={activeModalImg.title}
                className="pd-modal-img"
              />
              {activeModalImg.title && (
                <div className="pd-modal-caption">{activeModalImg.title}</div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

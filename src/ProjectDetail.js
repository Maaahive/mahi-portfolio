import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  SiElectron, SiSpotify, SiNodedotjs, SiJavascript,
  SiReact, SiSocketdotio, SiMongodb, SiTailwindcss,
  SiGithub, SiExpress,
} from "react-icons/si";
import { FiArrowLeft, FiExternalLink, FiDownload, FiUsers, FiEye, FiGitBranch } from "react-icons/fi";
import offTrack from "./assets/off-track.png";
import cartel from "./assets/cartel.png";
import "./ProjectDetail.css";

const PROJECT_DETAILS = {
  "off-track": {
    id: "001",
    name: "Off-Track",
    tagline: "Ad-free desktop music, the way it should be.",
    status: "Desktop App",
    img: offTrack,
    github: "https://github.com/Maaahive/Off-Track",
    live: null,
    tech: [
      { name: "Electron", Icon: SiElectron, color: "#47848f" },
      { name: "Node.js", Icon: SiNodedotjs, color: "#68a063" },
      { name: "JavaScript", Icon: SiJavascript, color: "#f7df1e" },
      { name: "Spotify API", Icon: SiSpotify, color: "#1db954" },
    ],
    problem: `Every music streaming solution has a catch. Spotify free tier interrupts you with ads. YouTube Music works but lives in a browser tab, competing for memory with everything else you have open. I wanted something lighter — a floating desktop player that feels like it belongs on your OS, not in a browser.`,
    problemB: `Off-Track is that player. It syncs with your Spotify library so you do not have to rebuild your playlists, but streams audio through YouTube — no ads, no subscriptions, no browser overhead. You get your music, your way.`,
    howItWorks: `Electron gives Off-Track access to the OS level — it runs as a native desktop process, not a web tab. The app has two layers: a main process that handles system-level operations (OAuth, file access, IPC) and a renderer process that runs the UI.`,
    howItWorksB: `Spotify API is used purely for metadata — your saved tracks, album art, playlist structure. When you hit play, the app takes that track name and artist, queries YouTube, and streams the closest audio match using ytdl-core. The audio piping happens in the main process; the renderer just receives playback state via IPC events.`,
    howItWorksC: `The window is designed to float — always-on-top, compact, and draggable. You can move it to a corner and forget it is running while it just plays.`,
    hardPart: `The trickiest part was the Spotify-to-YouTube bridge. Spotify and YouTube do not share the same data — a track that exists on Spotify may not have an exact YouTube match, or the top result might be a cover, a live version, or a different edit entirely. The matching logic had to be good enough to find the right version most of the time without requiring manual confirmation for every song.`,
    hardPartB: `The solution was a scoring heuristic: match on exact title and artist name first, then fuzzy-match on duration within plus-or-minus 10 seconds, and deprioritize results with words like cover, live, remix unless the original also has them. It is not perfect — nothing is — but it is correct enough that you rarely notice.`,
    stats: [
      { value: "100+", label: "Release downloads", Icon: FiDownload },
      { value: "19", label: "Unique visitors (14d)", Icon: FiUsers },
      { value: "81", label: "Repo views (14d)", Icon: FiEye },
    ],
    reflection: `Off-Track started as a personal annoyance and turned into something people actually download and use. Shipping a desktop app is a different experience from shipping a website — the packaging, the installer, the OS-level permissions, the always-on-top window management — it is a different layer of the stack entirely, and one I enjoyed figuring out.`,
  },

  cartel: {
    id: "002",
    name: "Cartel",
    tagline: "Real-time group ordering. No more WhatsApp chaos.",
    status: "Live",
    img: cartel,
    github: "https://github.com/Maaahive/Cartel",
    live: "https://cartel-f4hf.onrender.com/",
    tech: [
      { name: "React", Icon: SiReact, color: "#61dafb" },
      { name: "Node.js", Icon: SiNodedotjs, color: "#68a063" },
      { name: "Express", Icon: SiExpress, color: "#ffffff" },
      { name: "Socket.IO", Icon: SiSocketdotio, color: "#888888" },
      { name: "MongoDB", Icon: SiMongodb, color: "#47a248" },
      { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#38bdf8" },
    ],
    problem: `Group grocery runs are a mess. One person goes to the store, collects orders over WhatsApp, tries to remember who wanted which brand of chips, buys it all, and then spends 20 minutes splitting the bill. Someone always forgets what they ordered. Someone always owes money for three weeks.`,
    problemB: `Cartel fixes this. Everyone joins a session with a code, adds their own items to a shared cart in real time, and the bill splits itself. No WhatsApp threads, no memory required, no awkward payment chasing.`,
    howItWorks: `The backend is a Node.js and Express API with Socket.IO layered on top. When a user creates a session, they get a unique room code. Every action — adding an item, removing one, changing quantities — emits a Socket.IO event that the server broadcasts to all other clients in the same room. Everyone sees changes as they happen, with no manual refresh.`,
    howItWorksB: `Authentication uses JWT tokens stored in HTTP-only cookies — standard, secure, stateless. User sessions are persisted in MongoDB so you can rejoin a cart if you close the tab. The React frontend uses Tailwind CSS and communicates with the backend over both REST for auth and session creation, and WebSocket for live cart events.`,
    howItWorksC: `Bill splitting is calculated on the client from the current cart state — each user's items are summed, and the total is shown per person alongside the group total. No server round-trip needed for the math.`,
    hardPart: `The hardest part was handling simultaneous edits without the cart state going out of sync. If two people edit the same item at the same millisecond, you can get a race condition — one update overwrites the other and someone's change disappears.`,
    hardPartB: `The fix was event ordering on the server. Instead of letting clients apply changes to their local state and then broadcasting, the server becomes the single source of truth. Every cart event goes through the server first, gets validated and applied to the stored session state, and then the updated state is broadcast to all clients. Slower by one round-trip, correct every time.`,
    stats: [
      { value: "44", label: "Git clones (14d)", Icon: FiGitBranch },
      { value: "23", label: "Unique cloners", Icon: FiUsers },
      { value: "Live", label: "Deployed on Render", Icon: FiExternalLink },
    ],
    reflection: `Cartel was where I learned what real-time actually means in practice. It is not just WebSockets — it is thinking about state ownership, event ordering, and what happens when two people do the same thing at the same time. The 44 clones in two weeks told me the problem I was solving resonated with people, which felt good.`,
  },
};

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = PROJECT_DETAILS[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div className="pd-not-found">
        <p>Project not found.</p>
        <button onClick={() => navigate("/")} className="pd-back-btn">
          Back to portfolio
        </button>
      </div>
    );
  }

  return (
    <div className="pd-root">
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />

      <div className="pd-container">
        <motion.button
          className="pd-back-btn"
          onClick={() => navigate("/")}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <FiArrowLeft size={16} />
          Back to portfolio
        </motion.button>

        <motion.div
          className="pd-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="pd-header-meta">
            <span className="pd-id">{`// ${project.id}`}</span>
            {project.status && (
              <span className="pd-status-badge">
                <span className="live-dot" />
                {project.status}
              </span>
            )}
          </div>
          <h1 className="pd-title">{project.name}</h1>
          <p className="pd-tagline">{project.tagline}</p>

          <div className="pd-tech-row">
            {project.tech.map(({ name, Icon, color }) => (
              <span className="pd-tech-tag" key={name}>
                <Icon size={13} style={{ color }} />
                {name}
              </span>
            ))}
          </div>

          <div className="pd-header-links">
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" className="pd-link-btn pd-link-secondary">
                <SiGithub size={15} /> Source Code
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer" className="pd-link-btn pd-link-primary">
                <FiExternalLink size={15} /> Live Demo
              </a>
            )}
          </div>
        </motion.div>

        <motion.div
          className="pd-hero-img-wrap"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img src={project.img} alt={project.name} className="pd-hero-img" />
        </motion.div>

        <div className="pd-content">
          <motion.section className="pd-section" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="pd-section-label">The Problem</div>
            <p className="pd-prose">{project.problem}</p>
            {project.problemB && <p className="pd-prose">{project.problemB}</p>}
          </motion.section>

          <div className="pd-divider" />

          <motion.section className="pd-section" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="pd-section-label">How It Works</div>
            <p className="pd-prose">{project.howItWorks}</p>
            {project.howItWorksB && <p className="pd-prose">{project.howItWorksB}</p>}
            {project.howItWorksC && <p className="pd-prose">{project.howItWorksC}</p>}
          </motion.section>

          <div className="pd-divider" />

          <motion.section className="pd-section" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="pd-section-label">The Hard Part</div>
            <p className="pd-prose">{project.hardPart}</p>
            {project.hardPartB && <p className="pd-prose">{project.hardPartB}</p>}
          </motion.section>

          <div className="pd-divider" />

          <motion.section className="pd-section" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="pd-section-label">By the Numbers</div>
            <div className="pd-stats-grid">
              {project.stats.map(({ value, label, Icon }) => (
                <div className="pd-stat-card" key={label}>
                  <Icon size={20} className="pd-stat-icon" />
                  <div className="pd-stat-value">{value}</div>
                  <div className="pd-stat-label">{label}</div>
                </div>
              ))}
            </div>
          </motion.section>

          <div className="pd-divider" />

          <motion.section className="pd-section" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="pd-section-label">Reflection</div>
            <p className="pd-prose pd-prose-italic">{project.reflection}</p>
          </motion.section>
        </div>

        <div className="pd-footer-nav">
          <button className="pd-back-btn" onClick={() => navigate("/")}>
            <FiArrowLeft size={16} />
            Back to portfolio
          </button>
        </div>
      </div>
    </div>
  );
}

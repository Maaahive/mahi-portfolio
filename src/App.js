import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-scroll";
import { motion, AnimatePresence } from "framer-motion";
import {
  SiPython,
  SiJavascript,
  SiReact,
  SiMysql,
  SiHtml5,
  SiCss,
  SiGit,
  SiOpencv,
  SiGithub,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FiExternalLink } from "react-icons/fi";
import photo from "./src/assets/mahi.jpg";
import "./App.css";

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────

const PROJECTS = [
  {
    id: "001",
    name: "Girvi Len Den",
    desc: "A loan tracking web app with a vintage UI. Per-entry interest rates, category selection, localStorage persistence, and Excel export.",
    tech: ["HTML", "CSS", "JavaScript", "localStorage"],
    img: null,
    imgLabel: "[ girvi-len-den.png ]",
    github: "#", // TODO: Replace with actual GitHub repo URL
    live: null,
  },
  {
    id: "002",
    name: "Interest Calculator",
    desc: "JS-based calculator with per-entry interest rates, multiple category selection, and Excel export. Handles edge cases gracefully.",
    tech: ["JavaScript", "Excel Export", "DOM"],
    img: null,
    imgLabel: "[ interest-calc.png ]",
    github: "#", // TODO: Replace with actual GitHub repo URL
    live: null,
  },
  {
    id: "003",
    name: "Professor Portfolio",
    desc: "React portfolio for Prof. Shweta Srivastava, Director at JIIT Noida. Built from her actual CV — iterated through multiple design versions.",
    tech: ["React", "CSS", "Responsive"],
    img: null,
    imgLabel: "[ professor-portfolio.png ]",
    github: "#", // TODO: Replace with actual GitHub repo URL
    live: null,
  },
];

const SKILLS = [
  { name: "Python", Icon: SiPython, color: "#3776ab" },
  { name: "JavaScript", Icon: SiJavascript, color: "#f7df1e" },
  { name: "React", Icon: SiReact, color: "#61dafb" },
  { name: "SQL", Icon: SiMysql, color: "#4479a1" },
  { name: "HTML5", Icon: SiHtml5, color: "#e34f26" },
  { name: "CSS3", Icon: SiCss, color: "#1572b6" },
  { name: "Git", Icon: SiGit, color: "#f05032" },
  { name: "OpenCV", Icon: SiOpencv, color: "#5c3ee8" },
];

// ─────────────────────────────────────────
// CURSOR
// ─────────────────────────────────────────

function Cursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const orbRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current)
        cursorRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      if (orbRef.current)
        orbRef.current.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`;
    };
    const onEnter = () => ringRef.current?.classList.add("hovered");
    const onLeave = () => ringRef.current?.classList.remove("hovered");

    document.addEventListener("mousemove", onMove);
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    let raf;
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x - 16) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y - 16) * 0.12;
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />
      <div className="orb" ref={orbRef} />
    </>
  );
}

// ─────────────────────────────────────────
// NAV
// ─────────────────────────────────────────

function Nav() {
  return (
    <nav className="nav">
      <div className="nav-logo">mahi.dev</div>
      <ul className="nav-links">
        {["about", "skills", "projects", "contact"].map((s) => (
          <li key={s}>
            <Link to={s} smooth duration={600} offset={-80}>
              {s}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ─────────────────────────────────────────
// HERO
// ─────────────────────────────────────────

function Hero() {
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-inner">
        <div>
          <motion.div
            className="hero-tag"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            Available for internships
          </motion.div>
          <motion.h1
            className="hero-name"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            Mahi
            <br />
            <span>Agarwal.</span>
          </motion.h1>
          <motion.p
            className="hero-role"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            ECE student @ <span className="highlight">JIIT Noida</span>
            <br />
            Building things with <span className="highlight">Python</span>,{" "}
            <span className="highlight">JavaScript</span> & curiosity.
          </motion.p>
          <motion.div
            className="hero-cta"
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Link
              to="projects"
              smooth
              duration={600}
              offset={-80}
              className="btn-primary"
            >
              View Projects
            </Link>
            <Link
              to="contact"
              smooth
              duration={600}
              offset={-80}
              className="btn-outline"
            >
              Get In Touch
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="hero-right"
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          {/* PHOTO — techy scan-line effect on hover */}
          <div className="photo-frame">
            {/* TODO: When you have your photo:
                1. Create src/assets/ folder
                2. Add photo (e.g. photo.jpg)
                3. Import: import myPhoto from './assets/photo.jpg'
                4. Replace div.photo-placeholder with:
                   <img src={myPhoto} alt="Mahi" className="photo-img" /> */}
            <div className="photo-placeholder">
              {/* <img src={photo} alt="Mahi" className="photo-img" /> */}
            </div>
            <div className="photo-scanline" />
            <div className="photo-corner tl" />
            <div className="photo-corner tr" />
            <div className="photo-corner bl" />
            <div className="photo-corner br" />
          </div>

          {/* TERMINAL */}
          <div className="terminal">
            <div className="terminal-bar">
              <div className="dot dot-r" />
              <div className="dot dot-y" />
              <div className="dot dot-g" />
              <span className="terminal-title">mahi@portfolio ~ </span>
            </div>
            <div className="terminal-body">
              <div className="t-line">
                <span className="t-prompt">❯</span>
                <span className="t-cmd">whoami</span>
              </div>
              <div className="t-out">
                <span>Mahi Agarwal</span> — ECE, 4th year
              </div>
              <div className="t-line" style={{ marginTop: "0.5rem" }}>
                <span className="t-prompt">❯</span>
                <span className="t-cmd">cat skills.txt</span>
              </div>
              <div className="t-out">Python · JS · SQL · React</div>
              <div className="t-out">OpenCV · HTML/CSS · Git</div>
              <div className="t-line" style={{ marginTop: "0.5rem" }}>
                <span className="t-prompt">❯</span>
                <span className="t-cmd">echo $status</span>
              </div>
              <div className="t-out">
                <span>open to opportunities ✓</span>
              </div>
              <div className="t-line" style={{ marginTop: "0.5rem" }}>
                <span className="t-prompt">❯</span>
                <span className="t-cursor" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────

function About() {
  return (
    <section id="about">
      <div className="section-wrapper">
        <motion.div
          className="section-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          01 // about
        </motion.div>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          A little about me
        </motion.h2>
        <div className="about-grid">
          <motion.div
            className="about-text"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <p>
              Hey! I'm <strong>Mahi</strong>, a Final year Electronics &
              Communication Engineering student at <strong>JIIT Noida</strong>.
              I live in the hostel, survive on chai, and spend way too much time
              making things on my laptop.
            </p>
            <p>
              I started with web dev — HTML, CSS, JS — and somewhere along the
              way got hooked on <strong>Python</strong>. Now I'm exploring ML
              concepts, building real-world tools, and occasionally solving
              cryptographic challenges for fun (yes, really).
            </p>
            <p>
              I care about building things that are{" "}
              <strong>actually useful</strong> — not just another todo app. I
              like projects that solve real problems.
            </p>
          </motion.div>
          <motion.div
            className="skills-grid"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
          >
            {[
              {
                cat: "Languages",
                tags: ["Python", "JavaScript", "SQL", "HTML/CSS"],
              },
              { cat: "Libraries & Tools", tags: ["React", "OpenCV", "Git"] },
              {
                cat: "Currently exploring",
                tags: ["Machine Learning", "REST APIs"],
              },
              {
                cat: "Interests",
                tags: ["Women in Tech", "Open Source", "Writing"],
              },
            ].map((s) => (
              <div key={s.cat}>
                <div className="skill-category">{s.cat}</div>
                <div className="skill-tags">
                  {s.tags.map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// SKILLS — icon grid, hover → name + scale
// ─────────────────────────────────────────

function SkillIcon({ skill, i }) {
  const [hovered, setHovered] = useState(false);
  const { name, Icon, color } = skill;

  return (
    <motion.div
      className="skill-icon-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.06 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="skill-icon-svg"
        animate={{ scale: hovered ? 1.25 : 1, y: hovered ? -6 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        style={{ color: hovered ? color : "var(--text-muted)" }}
      >
        <Icon size={42} />
      </motion.div>

      <AnimatePresence>
        {hovered && (
          <motion.span
            className="skill-icon-label"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            style={{ color }}
          >
            {name}
          </motion.span>
        )}
      </AnimatePresence>

      <motion.div
        className="skill-icon-glow"
        animate={{ opacity: hovered ? 1 : 0 }}
        style={{
          background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
        }}
      />
    </motion.div>
  );
}

function Skills() {
  return (
    <section id="skills">
      <div className="section-wrapper">
        <motion.div
          className="section-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          02 // skills
        </motion.div>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          What I work with
        </motion.h2>
        <div className="skill-icons-grid">
          {SKILLS.map((s, i) => (
            <SkillIcon key={s.name} skill={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// PROJECTS — hover overlay with GitHub link
// ─────────────────────────────────────────

function ProjectCard({ p, i }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="project-card"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="project-img-wrap">
        {p.img ? (
          <img src={p.img} alt={p.name} className="project-img" />
        ) : (
          <div className="project-img-placeholder">{p.imgLabel}</div>
        )}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="project-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {p.github && (
                <a
                  href={p.github}
                  target="_blank"
                  rel="noreferrer"
                  className="project-overlay-btn"
                >
                  <SiGithub size={16} /> GitHub
                </a>
              )}
              {p.live && (
                <a
                  href={p.live}
                  target="_blank"
                  rel="noreferrer"
                  className="project-overlay-btn"
                >
                  <FiExternalLink size={16} /> Live
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="project-body">
        <div className="project-number">{`// ${p.id}`}</div>
        <div className="project-name">{p.name}</div>
        <p className="project-desc">{p.desc}</p>
        <div className="project-footer">
          <div className="project-tech">
            {p.tech.map((t) => (
              <span className="tech-tag" key={t}>
                {t}
              </span>
            ))}
          </div>
          {p.github && p.github !== "#" && (
            <a
              href={p.github}
              target="_blank"
              rel="noreferrer"
              className="project-github-link"
            >
              <SiGithub size={16} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Projects() {
  return (
    <section id="projects">
      <div className="section-wrapper">
        <motion.div
          className="section-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          03 // projects
        </motion.div>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Things I've built
        </motion.h2>
        <div className="projects-grid">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// CONTACT — with form
// ─────────────────────────────────────────

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`,
    );
    window.location.href = `mailto:mahiagarwal985@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact">
      <div className="section-wrapper">
        <div className="contact-grid">
          {/* LEFT */}
          <div>
            <motion.div
              className="section-label"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              04 // contact
            </motion.div>
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Let's talk
            </motion.h2>
            <motion.p
              className="contact-desc"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              I'm open to internship opportunities, collaborations, and
              interesting conversations. Drop a message!
            </motion.p>
            <motion.div
              className="contact-links"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <a
                href="mailto:mahiagarwal985@gmail.com"
                className="contact-link"
              >
                <MdEmail size={16} /> Email
              </a>
              <a
                href="https://github.com/Maaahive"
                target="_blank"
                rel="noreferrer"
                className="contact-link"
              >
                <SiGithub size={16} /> GitHub
              </a>
              {/* TODO: Replace YOUR_USERNAME with your actual LinkedIn handle */}
              <a
                href="https://linkedin.com/in/YOUR_USERNAME"
                target="_blank"
                rel="noreferrer"
                className="contact-link"
              >
                <FaLinkedin size={16} /> LinkedIn
              </a>
            </motion.div>
          </div>

          {/* RIGHT — form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="contact-form-wrap">
              <div className="form-field">
                <label className="form-label">FULL NAME</label>
                <input
                  className="form-input"
                  name="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label className="form-label">EMAIL ADDRESS</label>
                <input
                  className="form-input"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label className="form-label">MESSAGE</label>
                <textarea
                  className="form-input form-textarea"
                  name="message"
                  placeholder="Tell me about your project..."
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                />
              </div>
              <motion.button
                className="form-submit"
                onClick={handleSubmit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {sent ? "✓ Opening mail client..." : "SEND MESSAGE →"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────

function Footer() {
  return (
    <footer className="footer">
      <p>
        Designed & built by <span>Mahi Agarwal</span>
      </p>
      <p>© 2026</p>
    </footer>
  );
}

// ─────────────────────────────────────────
// APP
// ─────────────────────────────────────────

export default function App() {
  return (
    <>
      <Cursor />
      <Nav />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </>
  );
}

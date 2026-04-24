import React, { useEffect, useRef } from "react";
import { Link } from "react-scroll";
import { motion } from "framer-motion";
import "./App.css";
import myPhoto from "./assets/photo.jpeg";

// ─────────────────────────────────────────
// DATA — edit your info here!
// ─────────────────────────────────────────

const PROJECTS = [
  {
    id: "001",
    name: "Girvi Len Den",
    desc: "A loan tracking web app with a vintage UI. Supports per-entry interest rates, category selection, localStorage persistence, and Excel export. Built for real-world use.",
    tech: ["HTML", "CSS", "JavaScript", "localStorage"],
    // TODO: Replace with your actual screenshot
    // import girviImg from './assets/girvi.png'  ← add this at top of file
    // then use: img: girviImg
    img: null,
    imgLabel: "[ girvi-len-den.png ]",
  },
  {
    id: "002",
    name: "Interest Calculator",
    desc: "JS-based calculator with per-entry interest rates, multiple category selection, and Excel export. Handles edge cases like mismatched entries gracefully.",
    tech: ["JavaScript", "Excel Export", "DOM"],
    // TODO: Replace with your actual screenshot
    // import interestImg from './assets/interest.png'
    // then use: img: interestImg
    img: null,
    imgLabel: "[ interest-calc.png ]",
  },
  {
    id: "003",
    name: "Hand Gesture Recognition",
    desc: "Real-time hand gesture detection using MediaPipe and OpenCV in Python. Recognizes gestures via webcam feed with landmark tracking and classification logic.",
    tech: ["Python", "MediaPipe", "OpenCV"],
    // TODO: Replace with your actual screenshot
    // import gestureImg from './assets/gesture.png'
    // then use: img: gestureImg
    img: null,
    imgLabel: "[ gesture-recognition.png ]",
  },
  {
    id: "004",
    name: "Professor Portfolio",
    desc: "A content-rich React portfolio for Prof. Shweta Srivastava, Director at JIIT Noida. Built from her actual CV — iterated through multiple design versions.",
    tech: ["React", "CSS", "Responsive"],
    // TODO: Replace with your actual screenshot
    // import profImg from './assets/professor.png'
    // then use: img: profImg
    img: null,
    imgLabel: "[ professor-portfolio.png ]",
  },
  {
    id: "005",
    name: "HENNGE Admission Challenge",
    desc: "Solved a 3-mission coding challenge — recursive Python (no loops/comprehensions), GitHub secret gist, and HTTP POST with HMAC-SHA512 TOTP auth. Got the 200. ✓",
    tech: ["Python", "TOTP", "HMAC-SHA512", "HTTP Auth"],
    // TODO: Replace with your terminal screenshot
    // import henngeImg from './assets/hennge.png'
    // then use: img: henngeImg
    img: null,
    imgLabel: "[ hennge-200.png ]",
  },
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
        {["about", "projects", "contact"].map((s) => (
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
        {/* LEFT — text */}
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

        {/* RIGHT — photo + terminal */}
        <motion.div
          className="hero-right"
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          {/* PHOTO */}
          <div className="photo-frame">
            {/* TODO: When you have your photo ready:
                1. Create src/assets/ folder
                2. Put your photo inside it (e.g. photo.jpg)
                3. Import at top: import myPhoto from './assets/photo.jpg'
                4. Replace the div below with:
                   <img src={myPhoto} alt="Mahi Agarwal" /> */}
            <div className="photo-placeholder"><img src={myPhoto} alt="Mahi Agarwal" /></div>
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
                <span>Mahi Agarwal</span> — ECE, 3rd year
              </div>
              <div className="t-line" style={{ marginTop: "0.5rem" }}>
                <span className="t-prompt">❯</span>
                <span className="t-cmd">cat skills.txt</span>
              </div>
              <div className="t-out">Python · JS · SQL · React</div>
              <div className="t-out">MediaPipe · OpenCV · HTML/CSS</div>
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
  const skills = [
    { cat: "Languages", tags: ["Python", "JavaScript", "SQL", "HTML/CSS"] },
    { cat: "Libraries & Tools", tags: ["React", "OpenCV", "MediaPipe", "Git"] },
    {
      cat: "Currently exploring",
      tags: ["Machine Learning", "Decision Trees", "REST APIs"],
    },
    { cat: "Interests", tags: ["Women in Tech", "Open Source", "Writing"] },
  ];

  return (
    <section id="about">
      <div className="section-wrapper">
        <motion.div
          className="section-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          01 // about
        </motion.div>

        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          A little about me
        </motion.h2>

        <div className="about-grid">
          <motion.div
            className="about-text"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <p>
              Hey! I'm <strong>Mahi</strong>, a 3rd year Electronics &
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
              <strong>actually useful</strong> — not just another todo app. From
              loan trackers to hand gesture recognition, I like projects that
              solve real problems.
            </p>
          </motion.div>

          <motion.div
            className="skills-grid"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            {skills.map((s) => (
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
// PROJECTS
// ─────────────────────────────────────────

function Projects() {
  return (
    <section id="projects">
      <div className="section-wrapper">
        <motion.div
          className="section-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          02 // projects
        </motion.div>

        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Things I've built
        </motion.h2>

        <div className="projects-grid">
          {PROJECTS.map((p, i) => (
            <motion.div
              key={p.id}
              className="project-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              {/* Screenshot or placeholder */}
              {p.img ? (
                <img src={p.img} alt={p.name} className="project-img" />
              ) : (
                /* TODO: Once you have screenshots:
                     1. Add image imports at top of PROJECTS array
                     2. Set img: yourImportedImage
                     3. The <img> tag above will render automatically */
                <div className="project-img-placeholder">{p.imgLabel}</div>
              )}

              <div className="project-body">
                <div className="project-number">{p.id}</div>
                <div className="project-name">{p.name}</div>
                <p className="project-desc">{p.desc}</p>
                <div className="project-tech">
                  {p.tech.map((t) => (
                    <span className="tech-tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────

function Contact() {
  return (
    <section id="contact">
      <div className="section-wrapper">
        <div className="contact-inner">
          <motion.div
            className="section-label"
            style={{ justifyContent: "center" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            03 // contact
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
            I'm currently open to internship opportunities, collaborations, and
            interesting conversations. My inbox is always open — even if you
            just want to say hi.
          </motion.p>

          <motion.div
            className="contact-links"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {/* TODO: Update LinkedIn URL with your actual profile link */}
            <a href="mailto:mahiagarwal985@gmail.com" className="contact-link">
              ✉ Email
            </a>
            <a
              href="https://github.com/Maaahive"
              target="_blank"
              rel="noreferrer"
              className="contact-link"
            >
              ⌥ GitHub
            </a>
            <a
              href="https://linkedin.com/in/YOUR_USERNAME"
              target="_blank"
              rel="noreferrer"
              className="contact-link"
            >
              ↗ LinkedIn
            </a>
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
      <Projects />
      <Contact />
      <Footer />
    </>
  );
}

(() => {
  "use strict";

  /** Academic inbox used by the contact form (mailto). */
  const CONTACT_EMAIL = "mirzajubairrafi@gmail.com";

  const TAGLINE =
    "Machine Learning • Data Analytics • Forecasting Research • AI Systems";

  document.documentElement.classList.add("js-ready");

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  initNav();
  initTypedTagline();
  initReveal();
  initActiveSection();
  //initContactForm();
  initLabGrid();

  function initNav() {
    const toggle = document.querySelector(".nav-toggle");
    const menu = document.getElementById("nav-menu");
    if (!toggle || !menu) return;

    const close = () => {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    };

    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", close);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
  }

  function initTypedTagline() {
    const el = document.getElementById("typed-tagline");
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.textContent = TAGLINE;
      return;
    }

    let i = 0;
    const tick = () => {
      el.textContent = TAGLINE.slice(0, i);
      i += 1;
      if (i <= TAGLINE.length) {
        window.setTimeout(tick, 28);
      }
    };
    tick();
  }

  function initReveal() {
    const nodes = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach((node) => observer.observe(node));
  }

  function initActiveSection() {
    const links = [...document.querySelectorAll(".nav-menu a[href^='#']")];
    const ids = links
      .map((link) => link.getAttribute("href"))
      .filter(Boolean)
      .map((href) => href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const id = visible.target.id;
        links.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      },
      { threshold: [0.25, 0.5], rootMargin: "-20% 0px -50% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function initContactForm() {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");
    if (!form || !status) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      status.classList.remove("error");

      const name = String(form.name.value || "").trim();
      const email = String(form.email.value || "").trim();
      const message = String(form.message.value || "").trim();

      if (!name || !email || !message) {
        status.textContent = "Please complete all fields.";
        status.classList.add("error");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.textContent = "Please enter a valid email address.";
        status.classList.add("error");
        return;
      }

      const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}`
      );
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      status.textContent = "Opening your email client…";
    });
  }

  function initLabGrid() {
    const canvas = document.getElementById("lab-grid");
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let points = [];
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.floor((width * height) / 28000);
      points = Array.from({ length: Math.max(28, count) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    };

    const drawGrid = () => {
      ctx.clearRect(0, 0, width, height);
      const g = ctx.createRadialGradient(
        width * 0.5,
        height * 0.15,
        40,
        width * 0.5,
        height * 0.4,
        Math.max(width, height) * 0.8
      );
      g.addColorStop(0, "rgba(14, 165, 233, 0.16)");
      g.addColorStop(1, "rgba(3, 7, 18, 1)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(56, 189, 248, 0.07)";
      ctx.lineWidth = 1;
      const step = 48;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    const draw = () => {
      drawGrid();
      if (reduce) return;

      points.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });

      ctx.fillStyle = "rgba(34, 211, 238, 0.7)";
      points.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
        for (let j = i + 1; j < points.length; j += 1) {
          const q = points[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d = dx * dx + dy * dy;
          if (d < 14000) {
            ctx.strokeStyle = `rgba(34, 211, 238, ${0.12 * (1 - d / 14000)})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      });

      raf = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", () => {
      window.cancelAnimationFrame(raf);
      resize();
      draw();
    });
  }
})();

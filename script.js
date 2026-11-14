(() => {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  /* ---------- Footer year ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Nav: shadow on scroll + mobile menu ---------- */
  const nav = $("#nav"), burger = $("#burger");
  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 10);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  $$("#navLinks a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open"); burger.setAttribute("aria-expanded", false);
  }));

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: .12 });
  $$(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 80}ms`;
    io.observe(el);
  });

  /* ---------- Count-up stats ---------- */
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count, suffix = el.dataset.suffix || "";
      const start = performance.now(), dur = 1400;
      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(end * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: .6 });
  $$("[data-count]").forEach(el => countIO.observe(el));

  /* ---------- Interactive board ---------- */
  const tasks = [
    { t: "Design onboarding flow", tag: "Design", c: "", col: 0, h: 260, a: "AL" },
    { t: "Write launch announcement", tag: "Marketing", c: "tag--pink", col: 0, h: 330, a: "MR" },
    { t: "Set up billing webhooks", tag: "Backend", c: "tag--lime", col: 0, h: 150, a: "JK" },
    { t: "Build pricing page", tag: "Frontend", c: "", col: 1, h: 20, a: "SO" },
    { t: "QA mobile navigation", tag: "QA", c: "tag--lime", col: 1, h: 200, a: "TN" },
    { t: "Customer interviews", tag: "Research", c: "tag--pink", col: 2, h: 290, a: "PR" },
    { t: "Finalize brand colors", tag: "Design", c: "", col: 2, h: 100, a: "DK" },
  ];
  const cols = $$(".col");
  function renderBoard() {
    cols.forEach(c => $$(".task", c).forEach(n => n.remove()));
    tasks.forEach((k, i) => {
      const card = document.createElement("div");
      card.className = "task"; card.tabIndex = 0; card.dataset.i = i;
      card.innerHTML = `${k.t}<small><span class="tag ${k.c}">${k.tag}</span><span class="av" style="--h:${k.h}">${k.a}</span></small>`;
      cols[k.col].appendChild(card);
    });
    cols.forEach((c, i) => $("b", c).textContent = tasks.filter(k => k.col === i).length);
  }
  const advance = e => {
    const card = e.target.closest(".task"); if (!card) return;
    if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    const k = tasks[+card.dataset.i];
    k.col = (k.col + 1) % 3;
    renderBoard();
  };
  $("#board").addEventListener("click", advance);
  $("#board").addEventListener("keydown", advance);
  renderBoard();

  /* ---------- Pricing toggle ---------- */
  const toggleBtns = $$("#billingToggle button");
  toggleBtns.forEach(btn => btn.addEventListener("click", () => {
    toggleBtns.forEach(b => b.classList.toggle("is-active", b === btn));
    const period = btn.dataset.period;
    $$(".amount").forEach(el => {
      const from = +el.textContent.replace("$", ""), to = +el.dataset[period];
      const start = performance.now();
      const tick = now => {
        const p = Math.min((now - start) / 350, 1);
        el.textContent = "$" + Math.round(from + (to - from) * p);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }));

  /* ---------- FAQ accordion ---------- */
  $$(".faq__item").forEach(item => {
    const btn = $(".faq__q", item);
    btn.addEventListener("click", () => {
      const open = !item.classList.contains("open");
      $$(".faq__item").forEach(i => {
        i.classList.remove("open"); $(".faq__q", i).setAttribute("aria-expanded", false);
      });
      item.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open);
    });
  });

  /* ---------- Modal + forms ---------- */
  const modal = $("#modal"), form = $("#signupForm"), err = $("#suError");
  const openModal = (email = "") => {
    $("#modalForm").hidden = false; $("#modalSuccess").hidden = true;
    form.reset(); err.textContent = "";
    if (email) $("#suEmail").value = email;
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
    setTimeout(() => $(email ? "#suName" : "#suName").focus(), 100);
  };
  const closeModal = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); };

  $$("[data-open-modal]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); openModal(); }));
  $("#modalClose").addEventListener("click", closeModal);
  $("#modalDone").addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  $("#heroForm").addEventListener("submit", e => {
    e.preventDefault();
    const v = $("#heroEmail").value.trim(), f = e.currentTarget;
    if (!emailOk(v)) {
      f.classList.remove("invalid"); void f.offsetWidth; f.classList.add("invalid");
      $("#heroEmail").focus(); return;
    }
    f.classList.remove("invalid");
    openModal(v);
  });

  /* ---------- Demo request form (inline validation + success message) ---------- */
  const demoForm = $("#demoForm"), demoOk = $("#demoSuccess");
  const rules = {
    name:    v => v.trim().length >= 2 || "Please enter your full name.",
    email:   v => emailOk(v.trim()) || "Please enter a valid email address.",
    company: v => v.trim().length >= 2 || "Please enter your company name.",
    size:    v => v !== "" || "Please select your team size.",
  };
  const check = field => {
    const msg = rules[field.name](field.value);
    const ok = msg === true;
    field.classList.toggle("invalid", !ok);
    $(".field-error", field.closest("label")).textContent = ok ? "" : msg;
    return ok;
  };
  Object.keys(rules).forEach(n => {
    const f = demoForm.elements[n];
    f.addEventListener("blur", () => check(f));
    f.addEventListener("input", () => f.classList.contains("invalid") && check(f));
  });
  demoForm.addEventListener("submit", e => {
    e.preventDefault();
    const allOk = Object.keys(rules).map(n => check(demoForm.elements[n])).every(Boolean);
    if (!allOk) { $(".invalid", demoForm).focus(); demoOk.hidden = true; return; }
    const first = demoForm.elements.name.value.trim().split(" ")[0];
    demoOk.textContent = `✓ Thanks, ${first}! Your demo request is in. We'll email you within one business day.`;
    demoOk.hidden = false;
    demoForm.reset();
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#suName").value.trim(), email = $("#suEmail").value.trim(), pass = $("#suPass").value;
    if (name.length < 2) return err.textContent = "Please enter your full name.";
    if (!emailOk(email)) return err.textContent = "Please enter a valid email address.";
    if (pass.length < 8) return err.textContent = "Password must be at least 8 characters.";
    err.textContent = "";
    // TODO: replace with a real API call, e.g. fetch("/api/signup", { method: "POST", body: ... })
    $("#suWho").textContent = name.split(" ")[0];
    $("#suMail").textContent = email;
    $("#modalForm").hidden = true; $("#modalSuccess").hidden = false;
  });
})();

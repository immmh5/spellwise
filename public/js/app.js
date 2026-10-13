/* ============================================================
   SPELLWISE · app.js
   Router, views, dictation drills, sound map, writing,
   progress, settings, bot wiring — the whole app.
   ============================================================ */
(function () {
  "use strict";
  window.SW = window.SW || {};
  const S = window.SW;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* Muted flag is honoured inside speech.js itself. */
  S.muted = false;

  /* ---------------- Data helpers (built on top of data.js) ---------------- */
  S.totalLessons = () => S.MODULES.reduce((n, m) => n + m.lessons.length, 0);
  S.moduleOfLesson = (id) =>
    S.MODULES.find((m) => m.lessons.some((l) => l.id === id)) || null;
  S.findLesson = (id) => {
    for (const m of S.MODULES) {
      const l = m.lessons.find((x) => x.id === id);
      if (l) return l;
    }
    return null;
  };
  S.allWords = () => {
    const out = [];
    for (const m of S.MODULES)
      for (const l of m.lessons)
        for (const e of l.examples) out.push(Object.assign({ lesson: l.id, module: m.id }, e));
    for (const e of S.EXTRA_WORDS) out.push(Object.assign({ lesson: null, module: null }, e));
    return out;
  };
  let _wordIndex = null;
  S.allWordIds = () => {
    if (_wordIndex) return _wordIndex;
    _wordIndex = S.allWords().map((e) => e.w);
    return _wordIndex;
  };
  S.wordById = (id) => S.allWords().find((e) => e.w === id) || null;
  S.wordsForLesson = (id) => {
    const l = S.findLesson(id);
    return l ? l.examples.slice() : [];
  };
  S.nextLesson = () => {
    for (const m of S.MODULES)
      for (const l of m.lessons)
        if (!S.store.state.lessonsDone.includes(l.id)) return l;
    return null;
  };
  // crude phoneme extraction from IPA string
  S.phonemesOf = (ipa) =>
    (ipa || "").replace(/[\/ˈˌ]/g, "").match(/[a-zː:]+/gi) || [];

  /* ---------------- Navigation ---------------- */
  const NAV = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "lessons", label: "Lessons", icon: "📚" },
    { id: "practice", label: "Practice", icon: "🎯" },
    { id: "soundmap", label: "Sound Map", icon: "🗺️" },
    { id: "writing", label: "Writing", icon: "✍️" },
    { id: "progress", label: "Progress", icon: "📊" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];
  const BOTTOM_NAV = ["dashboard", "lessons", "practice", "soundmap", "progress"];

  let current = { view: "dashboard", param: null };

  function renderNav() {
    const st = S.store.state;
    $("#mainNav").innerHTML = NAV.map(
      (n) =>
        `<button class="nav-item ${current.view === n.id ? "active" : ""}" data-nav="${n.id}">
           <span class="nav-ico">${n.icon}</span><span>${n.label}</span>
           ${n.id === "practice" && st.reviewQueue.length ? `<span class="nav-badge">${st.reviewQueue.length}</span>` : ""}
         </button>`
    ).join("");
    $("#bottomNav").innerHTML = BOTTOM_NAV.map((n) => {
      const nav = NAV.find((x) => x.id === n);
      return `<button class="bn-item ${current.view === n ? "active" : ""}" data-nav="${n}">
           <span class="bn-ico">${nav.icon}</span>
           <span>${nav.label}</span>
         </button>`;
    }).join("");
    $("#sideStreakDays").textContent = st.streak;
    renderStreakStrip();
  }

  function renderStreakStrip() {
    const st = S.store.state;
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      days.push(
        `<span class="ss-dot ${st.activeDays.includes(key) ? "on" : ""}" title="${key}"></span>`
      );
    }
    $("#sideStreakStrip").innerHTML = days.join("");
  }

  function renderTop() {
    const st = S.store.state;
    $("#topXp").querySelector("b").textContent = st.xp;
    $("#topStreak").querySelector("b").textContent = st.streak;
    $("#topSound").textContent = S.muted ? "🔇" : "🔊";
    $("#topSound").setAttribute("aria-pressed", String(!S.muted));
  }

  const TITLES = {
    dashboard: "Dashboard",
    lessons: "Lessons",
    lesson: "Lesson",
    practice: "Practice",
    drill: "Dictation Drill",
    soundmap: "Sound Map",
    sound: "Phoneme",
    writing: "Writing",
    progress: "Progress",
    settings: "Settings",
  };

  function go(view, param, opts) {
    current = { view, param };
    const title = TITLES[view] || view;
    $("#topbarTitle").textContent = title;
    renderNav();
    renderTop();
    const v = $("#view");
    v.scrollTop = 0;
    document.body.classList.remove("nav-open");
    switch (view) {
      case "dashboard": v.innerHTML = viewDashboard(); afterDashboard(); break;
      case "lessons": v.innerHTML = viewLessons(); break;
      case "lesson": v.innerHTML = viewLesson(param); afterLesson(param); break;
      case "practice": v.innerHTML = viewPractice(); afterPractice(); break;
      case "drill": startDrill(param); break;
      case "soundmap": v.innerHTML = viewSoundMap(); break;
      case "sound": {
        const sym = param ? decodeURIComponent(param) : null;
        v.innerHTML = viewSound(sym);
        afterSound(sym);
        break;
      }
      case "writing": v.innerHTML = viewWriting(); afterWriting(); break;
      case "progress": v.innerHTML = viewProgress(); afterProgress(); break;
      case "settings": v.innerHTML = viewSettings(); afterSettings(); break;
    }
    if (!(opts && opts.noHistory))
      try {
        history.pushState({ view, param }, "", "#" + view + (param ? "/" + param : ""));
      } catch (e) {}
  }

  window.addEventListener("popstate", (e) => {
    const s = (e.state && e.state.view) || "dashboard";
    go(s, e.state ? e.state.param : null, { noHistory: true });
  });

  /* ---------------- Toast / modal / confetti ---------------- */
  function toast(msg, icon) {
    const w = $("#toastWrap");
    const d = document.createElement("div");
    d.className = "toast";
    d.innerHTML = `<span>${icon || "✅"}</span><span>${msg}</span>`;
    w.appendChild(d);
    requestAnimationFrame(() => d.classList.add("show"));
    setTimeout(() => {
      d.classList.remove("show");
      setTimeout(() => d.remove(), 400);
    }, 3200);
  }

  function modal(html) {
    const root = $("#modalRoot");
    root.innerHTML = `<div class="modal-back"><div class="modal" role="dialog" aria-modal="true">${html}</div></div>`;
    const back = root.firstElementChild;
    back.addEventListener("click", (e) => {
      if (e.target === back || e.target.closest("[data-close]")) closeModal();
    });
    return root;
  }
  function closeModal() {
    $("#modalRoot").innerHTML = "";
  }

  const CONFETTI_COLORS = ["#7c5cff", "#22d3ee", "#fbbf24", "#34d399", "#f472b6", "#818cf8"];
  function confetti(n) {
    const root = $("#confettiRoot");
    if (!root) return;
    for (let i = 0; i < (n || 40); i++) {
      const p = document.createElement("span");
      p.className = "confetti";
      p.style.left = Math.random() * 100 + "vw";
      p.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      p.style.animationDuration = 1.2 + Math.random() * 1.6 + "s";
      p.style.animationDelay = Math.random() * 0.5 + "s";
      p.style.transform = `rotate(${Math.random() * 360}deg)`;
      root.appendChild(p);
      setTimeout(() => p.remove(), 3200);
    }
  }

  function celebrate(kind, title, body) {
    confetti(60);
    modal(
      `<div class="celebrate-ico">${kind}</div>
       <h2 class="celebrate-title">${title}</h2>
       <p class="celebrate-body">${body}</p>
       <button class="btn primary block" data-close>Awesome!</button>`
    );
    S.store.save();
  }

  function gain(xp, why, opts) {
    const leveled = S.store.addXP(xp, why);
    renderTop();
    if (leveled) {
      const lv = S.store.levelInfo(S.store.state.xp);
      celebrate(lv.icon, `Level ${lv.index + 1}: ${lv.name}`, `You earned enough XP to level up. Keep training that ear!`);
    } else if (!(opts && opts.silent)) {
      toast(`+${Math.round(xp)} XP · ${why}`, "⭐");
    }
  }

  function checkAwards() {
    const newly = S.store.checkAchievements();
    for (const a of newly) {
      renderTop();
      celebrate(a.icon, `Achievement: ${a.title}`, `${a.desc}${a.xp ? ` <b>+${a.xp} XP</b>` : ""}`);
    }
    renderNav();
  }

  /* =============================================================
     VIEW · DASHBOARD
     ============================================================= */
  function viewDashboard() {
    const st = S.store.state;
    const info = S.store.levelInfo(st.xp);
    const stats = S.store.stats();
    const next = S.nextLesson();
    const due = st.reviewQueue.length;
    const C = 2 * Math.PI * 52;
    const off = C * (1 - info.pct / 100);
    const recentAch = S.ACHIEVEMENTS.filter((a) => st.achievements.includes(a.id)).slice(-4);

    return `
    <section class="hero">
      <div class="hero-main">
        <div class="level-ring">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="52" class="ring-bg"></circle>
            <circle cx="60" cy="60" r="52" class="ring-fg" style="stroke-dasharray:${C};stroke-dashoffset:${off}"></circle>
          </svg>
          <div class="level-ring-inner">
            <span class="lv-ico">${info.icon}</span>
            <span class="lv-name">${info.name}</span>
            <span class="lv-xp">${st.xp} XP</span>
          </div>
        </div>
        <div class="hero-copy">
          <h1 class="hello">Hear it. <span class="grad">Spell it.</span> Right first time.</h1>
          <p class="hero-sub">Train your ear to catch the patterns of English spelling — short lessons, real-voice dictation, and a tutor that never sleeps.</p>
          <div class="hero-actions">
            ${next ? `<button class="btn primary" data-nav="lesson" data-param="${next.id}">▶ Continue · ${esc(next.title)}</button>`
                  : `<button class="btn primary" data-nav="practice">▶ Start a drill</button>`}
            ${due ? `<button class="btn ghost" data-nav="practice">🔁 Review ${due} mistake${due > 1 ? "s" : ""}</button>` : ""}
          </div>
          <div class="xp-bar-wrap">
            <div class="xp-bar"><i style="width:${info.pct}%"></i></div>
            <div class="xp-bar-note">${info.next ? `${info.into}/${info.span} XP to <b>${info.next}</b>` : `Max level reached 👑`}</div>
          </div>
        </div>
      </div>
      <div class="hero-side">
        ${statCard("🔥", stats.streak, "day streak", "best " + stats.bestStreak)}
        ${statCard("📚", stats.learned, "words learned", stats.mastered + " mastered")}
        ${statCard("🎯", stats.accuracy + "%", "accuracy", (st.correctTotal + st.wrongTotal) + " attempts")}
        ${statCard("🏅", stats.lessonsDone + "/" + stats.totalLessons, "lessons done", stats.drills + " drills")}
      </div>
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Your learning path</h2><button class="btn sm ghost" data-nav="lessons">All lessons →</button></div>
      <div class="path-list">
        ${S.MODULES.map((m) => {
          const done = m.lessons.filter((l) => st.lessonsDone.includes(l.id)).length;
          const pct = Math.round((done / m.lessons.length) * 100);
          return `<button class="path-item" data-nav="lessons" data-scroll="${m.id}">
            <span class="path-ico">${m.icon}</span>
            <span class="path-body">
              <span class="path-title">${esc(m.title)}</span>
              <span class="path-meta">${done}/${m.lessons.length} lessons · ${esc(m.blurb)}</span>
              <span class="path-bar"><i style="width:${pct}%"></i></span>
            </span>
          </button>`;
        }).join("")}
      </div>
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Achievements</h2><button class="btn sm ghost" data-nav="progress">All →</button></div>
      <div class="ach-row">
        ${(recentAch.length ? recentAch : S.ACHIEVEMENTS.slice(0, 4)).map((a) =>
          `<div class="ach-chip unlocked" title="${esc(a.desc)}"><span>${a.icon}</span><b>${esc(a.title)}</b></div>`
        ).join("")}
        <div class="ach-chip locked"><span>${st.achievements.length}/${S.ACHIEVEMENTS.length}</span><b>Unlocked</b></div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Recent activity</h2></div>
      ${st.history.length
        ? `<ul class="activity">${st.history.slice(0, 8).map((h) =>
            `<li><span class="act-kind kind-${h.kind}">${({ xp: "⭐", level: "🎉", award: "🏅", module: "🏅", word: "🎯", drill: "🏋️" })[h.kind] || "•"}</span><span>${h.text}</span></li>`
          ).join("")}</ul>`
        : `<p class="muted">Nothing yet — complete a lesson or a drill and it will show up here.</p>`}
    </section>`;
  }

  function statCard(icon, big, label, sub) {
    return `<div class="stat-card"><span class="stat-ico">${icon}</span><b class="stat-big">${big}</b><span class="stat-label">${label}</span><span class="stat-sub">${esc(sub)}</span></div>`;
  }

  function afterDashboard() {
    const st = S.store.state;
    if (!st.seenWelcome) {
      st.seenWelcome = true;
      S.store.save();
      botSay("<b>Welcome to Spellwise!</b> 🧠 I'm <b>Lex</b>. Read a lesson, then try a dictation drill — I'll say a word and you spell it. Ask me anything, any time.", true);
    }
  }

  /* =============================================================
     VIEW · LESSONS
     ============================================================= */
  function viewLessons() {
    const st = S.store.state;
    return `<div class="page-head">
        <h1>Lessons</h1>
        <p class="muted">Small, focused lessons. Each one teaches one pattern, then you drill it until your ear knows it.</p>
      </div>` +
      S.MODULES.map((m) => {
        const done = m.lessons.filter((l) => st.lessonsDone.includes(l.id)).length;
        const complete = done === m.lessons.length;
        return `<section class="module-card" id="mod-${m.id}">
          <div class="module-head">
            <span class="module-ico">${m.icon}</span>
            <div class="module-title"><h2>${esc(m.title)}</h2><p class="muted">${esc(m.blurb)}</p></div>
            <span class="module-badge ${complete ? "done" : ""}">${complete ? "✅" : done + "/" + m.lessons.length}</span>
          </div>
          <div class="lesson-list">
            ${m.lessons.map((l, i) => {
              const isDone = st.lessonsDone.includes(l.id);
              return `<button class="lesson-item ${isDone ? "done" : ""}" data-nav="lesson" data-param="${l.id}">
                <span class="lesson-num">${isDone ? "✓" : i + 1}</span>
                <span class="lesson-body">
                  <span class="lesson-title">${l.icon} ${esc(l.title)}</span>
                  <span class="lesson-rule">${esc(l.rule)}</span>
                </span>
                <span class="lesson-words">${l.examples.length} words</span>
              </button>`;
            }).join("")}
          </div>
        </section>`;
      }).join("");
  }

  /* =============================================================
     VIEW · LESSON DETAIL
     ============================================================= */
  let quizState = null;

  function viewLesson(id) {
    const l = S.findLesson(id);
    if (!l) return `<p class="muted">Lesson not found.</p>`;
    const st = S.store.state;
    const done = st.lessonsDone.includes(l.id);
    const mastered = l.examples.filter((e) => (st.mastered[e.w] || {}).box >= 4).length;
    quizState = { idx: 0, right: 0, answered: false };

    return `
    <button class="btn sm ghost back-btn" data-nav="lessons">← All lessons</button>
    <div class="lesson-hero">
      <span class="lesson-hero-ico">${l.icon}</span>
      <h1>${esc(l.title)}</h1>
      <p class="lesson-hero-rule">${esc(l.rule)}</p>
      <div class="lesson-hero-meta">
        <span>🎓 ${l.examples.length} words</span><span>🎤 IPA + audio</span><span>📝 ${l.quiz.length}-question quiz</span>
        ${done ? `<span class="pill done">✓ Completed</span>` : `<span class="pill">In progress</span>`}
      </div>
    </div>

    <section class="panel">
      <h2 class="panel-title">Why does it work this way?</h2>
      <div class="prose">${l.why}</div>
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Word bank</h2><span class="muted">${mastered}/${l.examples.length} mastered</span></div>
      <div class="word-grid">
        ${l.examples.map((e) => {
          const m = st.mastered[e.w] || {};
          return `<button class="word-card lvl${e.lvl} ${m.box >= 4 ? "mastered" : ""}" data-word="${esc(e.w)}">
            <span class="word-w">${esc(e.w)}</span>
            <span class="word-ipa">${esc(e.ipa)}</span>
            <span class="word-mastery">${"●".repeat(Math.max(0, m.box || 0))}${"○".repeat(Math.max(0, 4 - (m.box || 0)))}</span>
          </button>`;
        }).join("")}
      </div>
      <div class="word-note muted">Tap any word to hear it pronounced and see its sentence. Try to spell it from sound alone first!</div>
      <div class="btn-row">
        <button class="btn primary" data-nav="drill" data-param="lesson:${l.id}">🎯 Dictation drill on these words</button>
      </div>
    </section>

    <section class="panel">
      <h2 class="panel-title">👀 Watch out for</h2>
      <ul class="watch-list">${l.watch.map((w) => `<li>${w}</li>`).join("")}</ul>
    </section>

    <section class="panel" id="quizPanel">
      <div class="panel-head"><h2>Quick check</h2><span class="muted" id="quizScore"></span></div>
      <div id="quizBox">${quizCardHTML(l)}</div>
    </section>

    <div class="btn-row" id="lessonFoot">
      <button class="btn primary" id="completeLessonBtn" ${done ? "disabled" : ""}>${done ? "✓ Lesson completed" : "Mark lesson complete"}</button>
      <button class="btn ghost" data-nav="practice">Practice more</button>
    </div>`;
  }

  function quizCardHTML(l) {
    const q = l.quiz[quizState.idx];
    return `
      <div class="quiz-q" id="quizQ">
        <b>Q${quizState.idx + 1}/${l.quiz.length}:</b> ${q.q}
      </div>
      <div class="quiz-opts" id="quizOpts">
        ${q.options.map((o, i) => `<button class="quiz-opt" data-q="${i}">${esc(o)}</button>`).join("")}
      </div>
      <div class="quiz-explain" id="quizExplain" hidden></div>
      <div class="btn-row" id="quizNextRow" hidden>
        <button class="btn primary" id="quizNext">${quizState.idx + 1 < l.quiz.length ? "Next question →" : "Finish quiz"}</button>
      </div>`;
  }

  function afterLesson(id) {
    const l = S.findLesson(id);
    if (!l) return;
    bindQuiz(id);
    const doneBtn = $("#completeLessonBtn");
    if (doneBtn && !doneBtn.dataset.bound) {
      doneBtn.dataset.bound = "1";
      doneBtn.addEventListener("click", () => {
        S.store.completeLesson(l.id, false);
        gain(15, `Lesson complete: ${l.title}`);
        S.store.log(`Completed lesson <b>${esc(l.title)}</b>`, "module");
        checkAwards();
        renderNav();
        doneBtn.disabled = true;
        doneBtn.textContent = "✓ Lesson completed";
      });
    }
  }

  function bindQuiz(id) {
    const l = S.findLesson(id);
    if (!l) return;
    $$("#quizOpts .quiz-opt").forEach((b) =>
      b.addEventListener("click", () => {
        if (quizState.answered) return;
        quizState.answered = true;
        const i = +b.dataset.q;
        const q = l.quiz[quizState.idx];
        const ok = i === q.answer;
        $$("#quizOpts .quiz-opt").forEach((btn, j) => {
          btn.disabled = true;
          if (j === q.answer) btn.classList.add("correct");
          else if (j === i) btn.classList.add("wrong");
        });
        const ex = $("#quizExplain");
        ex.hidden = false;
        ex.innerHTML = `<span class="${ok ? "ok" : "no"}">${ok ? "✓ Correct." : "✗ Not quite."}</span> ${q.explain}`;
        if (ok) {
          quizState.right++;
          gain(5, "Quiz answer correct", { silent: true });
        } else {
          S.store.state.combo = 0;
        }
        $("#quizScore").textContent = `${quizState.right}/${l.quiz.length} correct so far`;
        $("#quizNextRow").hidden = false;
      })
    );

    const nxt = $("#quizNext");
    if (nxt) nxt.addEventListener("click", () => {
      if (quizState.idx + 1 < l.quiz.length) {
        quizState.idx++;
        quizState.answered = false;
        $("#quizBox").innerHTML = quizCardHTML(l);
        bindQuiz(id);
      } else {
        const perfect = quizState.right === l.quiz.length;
        $("#quizBox").innerHTML = `<div class="quiz-result ${perfect ? "perfect" : ""}">
            <div class="quiz-result-ico">${perfect ? "💯" : "✅"}</div>
            <h3>${quizState.right} / ${l.quiz.length} correct</h3>
            <p class="muted">${perfect ? "Flawless! +20 bonus XP." : "Nice work — review the ones you missed, then drill the words."}</p>
          </div>`;
        const moduleDone = S.store.completeLesson(l.id, perfect);
        gain(perfect ? 20 : 10, `Quiz finished: ${l.title}`);
        S.store.log(`Finished quiz: <b>${esc(l.title)}</b> (${quizState.right}/${l.quiz.length})`, "drill");
        checkAwards();
        const btn = $("#completeLessonBtn");
        if (btn) {
          btn.disabled = true;
          btn.textContent = "✓ Lesson completed";
        }
        S.store.save();
        if (moduleDone) celebrate("🏅", "Module complete!", `You finished every lesson in this module. The pattern is now yours.`);
      }
    });
  }

  /* =============================================================
     VIEW · PRACTICE
     ============================================================= */
  function viewPractice() {
    const st = S.store.state;
    const due = st.reviewQueue;
    const next = S.nextLesson();
    return `
    <div class="page-head">
      <h1>Practice</h1>
      <p class="muted">The core ritual: <b>hear a word → spell it</b>. Your brain learns the sound→spelling links automatically.</p>
    </div>

    ${due.length ? `<section class="panel alert-panel">
      <div class="panel-head"><h2>🔁 Your review queue · ${due.length} word${due.length > 1 ? "s" : ""}</h2></div>
      <p class="muted">These are words you got wrong. They come back until you nail them twice — that's how mistakes become mastery.</p>
      <div class="chips">${due.slice(0, 14).map((w) => `<button class="chip wrong-chip" data-word="${esc(w)}">${esc(w)}</button>`).join("")}</div>
      <div class="btn-row"><button class="btn primary" data-nav="drill" data-param="review">🎯 Drill my mistakes</button></div>
    </section>` : ""}

    <div class="drill-grid">
      <button class="drill-card big" data-nav="drill" data-param="${next ? "lesson:" + next.id : "mixed"}">
        <span class="drill-ico">▶</span>
        <b>${next ? "Continue: " + esc(next.title) : "Mixed drill"}</b>
        <span class="muted">${next ? next.examples.length + " words · matches your current lesson" : "Words from every lesson"}</span>
      </button>
      <button class="drill-card" data-nav="drill" data-param="mixed">
        <span class="drill-ico">🎲</span><b>Mixed drill</b><span class="muted">A blend across all modules</span>
      </button>
      <button class="drill-card" data-nav="drill" data-param="tricky">
        <span class="drill-ico">⚠️</span><b>Tricky top-25</b><span class="muted">The most misspelled words in English</span>
      </button>
      <button class="drill-card" data-nav="drill" data-param="review">
        <span class="drill-ico">🔁</span><b>Review mistakes</b><span class="muted">${due.length ? due.length + " waiting" : "Queue is empty"}</span>
      </button>
    </div>

    <section class="panel">
      <div class="panel-head"><h2>Pick a lesson to drill</h2></div>
      <div class="chips">
        ${S.MODULES.flatMap((m) =>
          m.lessons.map((l) =>
            `<button class="chip" data-nav="drill" data-param="lesson:${l.id}">${l.icon} ${esc(l.title)}</button>`
          )
        ).join("")}
      </div>
    </section>

    <section class="panel">
      <div class="panel-head"><h2>How the drill works</h2></div>
      <ul class="watch-list">
        <li>🔊 You hear a word (real human recording where possible). <b>Spell it in the box.</b></li>
        <li>Need a hint? Hear the sentence, or replay the word slowly.</li>
        <li>Wrong answers go into your <b>review queue</b> — they return until you've fixed them.</li>
        <li>Keep your combo alive for bonus XP and achievements. 🎯</li>
      </ul>
    </section>`;
  }

  function afterPractice() {}

  /* =============================================================
     DRILL ENGINE
     ============================================================= */
  let drill = null;

  function buildWordList(param) {
    if (param && param.startsWith("word:")) {
      const w = decodeURIComponent(param.slice("word:".length));
      const d = S.wordById(w);
      return d ? [d] : [];
    }
    if (param && param.startsWith("sound:")) {
      const sym = decodeURIComponent(param.slice("sound:".length));
      const x = S.SOUND_MAP.find((s) => s.sym === sym);
      return x
        ? x.spellings
            .flatMap((sp) => sp.words)
            .map((w) => S.wordById(w))
            .filter(Boolean)
            .slice(0, 14)
        : [];
    }
    if (param && param.startsWith("lesson:")) {
      const l = S.findLesson(param.slice("lesson:".length));
      return l ? l.examples.slice() : [];
    }
    if (param === "review") {
      const q = S.store.state.reviewQueue;
      if (!q.length) return [];
      return q.map((w) => S.wordById(w)).filter(Boolean);
    }
    if (param === "tricky") {
      const l = S.findLesson("top-50");
      return l ? l.examples.slice() : [];
    }
    if (param === "mixed" || !param) {
      const all = S.allWords();
      const st = S.store.state;
      // bias toward words not yet mastered
      const pool = all.filter((w) => (st.mastered[w.w] || {}).box < 4);
      const src = pool.length > 10 ? pool : all;
      return shuffle(src).slice(0, 12);
    }
    return [];
  }

  function shuffle(a) {
    const arr = a.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function startDrill(param) {
    const words = buildWordList(param);
    if (!words.length) {
      const v = $("#view");
      v.innerHTML = `<div class="page-head"><h1>Dictation drill</h1>
        <div class="empty-state">
          <div class="empty-ico">📭</div>
          <h3>Nothing to drill here yet</h3>
          <p class="muted">${param === "review" ? "Your review queue is empty — nice work! Make some mistakes first (that's how you learn)." : "No words found for this drill."}</p>
          <button class="btn primary" data-nav="practice">← Back to practice</button>
        </div></div>`;
      return;
    }
    drill = {
      words: words,
      i: 0,
      right: 0,
      wrongList: [],
      answered: false,
      source: param,
    };
    renderDrill();
    setTimeout(() => playDrillWord(), 350);
  }

  function renderDrill() {
    const d = drill;
    const w = d.words[d.i];
    const st = S.store.state;
    const pct = Math.round((d.i / d.words.length) * 100);
    $("#view").innerHTML = `
      <div class="drill-top">
        <button class="btn sm ghost" id="drillQuit">✕ Quit</button>
        <div class="drill-progress"><i style="width:${pct}%"></i></div>
        <span class="drill-count">${d.i + 1} / ${d.words.length}</span>
      </div>

      <section class="drill-card-main">
        <div class="drill-sound-ico" id="drillSpeaker">🔊</div>
        <h2 class="drill-hint">Spell what you hear</h2>
        <div class="drill-word-actions">
          <button class="btn sm" id="drillPlay">🔊 Play word</button>
          <button class="btn sm" id="drillSlow">🐢 Slow</button>
          <button class="btn sm" id="drillSentence">📢 Sentence</button>
        </div>

        <form class="drill-form" id="drillForm">
          <input type="text" id="drillInput" class="drill-input"
            placeholder="Type the word…" autocomplete="off" autocapitalize="off"
            autocorrect="off" spellcheck="false" aria-label="Spelling answer" />
          <button class="btn primary" type="submit">Check</button>
        </form>
        <div class="drill-mic-row">
          <button class="btn sm ghost" id="drillMic">🎙️ Or spell it out loud</button>
          <span class="muted" id="drillMicState"></span>
        </div>

        <div class="drill-feedback" id="drillFeedback"></div>
      </section>

      <section class="drill-side">
        <div class="combo-card">
          <span class="combo-ico">⚡</span>
          <b id="comboNow">${st.combo}</b>
          <span class="muted">combo · best ${st.bestCombo}</span>
        </div>
        <div class="combo-card">
          <span class="combo-ico">✅</span>
          <b id="drillScoreNow">${d.right}</b>
          <span class="muted">correct so far</span>
        </div>
      </section>`;

    $("#drillForm").addEventListener("submit", (e) => {
      e.preventDefault();
      checkDrillAnswer();
    });
    $("#drillPlay").addEventListener("click", () => playDrillWord());
    $("#drillSlow").addEventListener("click", () => playDrillWord(true));
    $("#drillSentence").addEventListener("click", () => S.speech.say(w.sent));
    $("#drillQuit").addEventListener("click", () => go("practice"));
    $("#drillMic").addEventListener("click", dictateDrillWord);
    $("#drillInput").focus();
  }

  async function playDrillWord(slow) {
    const w = drill.words[drill.i];
    const ico = $("#drillSpeaker");
    if (ico) ico.classList.add("pulse");
    if (slow) await S.speech.saySlow(w.w);
    else await S.speech.sayHuman(w.w);
    if (ico) ico.classList.remove("pulse");
    $("#drillInput").focus();
  }

  async function dictateDrillWord() {
    const st = $("#drillMicState");
    st.textContent = "Listening…";
    try {
      const r = await S.speech.listen();
      st.textContent = "";
      if (r.transcript) {
        $("#drillInput").value = r.transcript;
        checkDrillAnswer();
      }
    } catch (e) {
      st.textContent = e.message;
    }
  }

  function normalize(s) {
    return String(s).trim().toLowerCase().replace(/[.!?,"'`]+$/g, "");
  }

  function checkDrillAnswer() {
    if (drill.answered) return;
    const d = drill;
    const w = d.words[d.i];
    const val = normalize($("#drillInput").value);
    const ok = val === w.w.toLowerCase();
    drill.answered = true;
    const m = S.store.recordWord(w.w, ok);
    const fb = $("#drillFeedback");

    if (ok) {
      d.right++;
      gain(3, `Spelled “${esc(w.w)}”`, { silent: true });
      fb.innerHTML = `<div class="fb fb-ok">
          <b>✓ Correct!</b> <span class="fb-word">${esc(w.w)}</span> <span class="fb-ipa">${esc(w.ipa)}</span>
          <p class="fb-note">“${esc(w.sent)}”</p>
        </div>`;
      if (m.box >= 4) {
        S.store.log(`Mastered <b>${esc(w.w)}</b> 🔥`, "word");
        toast(`Mastered: ${w.w} 🔥`, "🎓");
      } else if (S.store.state.reviewQueue.includes(w.w) && m.box >= 2) {
        S.store.fixWord(w.w);
        toast(`Fixed: ${w.w} ✓ out of your review queue`, "🔁");
        S.store.log(`Fixed <b>${esc(w.w)}</b> — out of the review queue`, "word");
      }
    } else {
      d.wrongList.push(w);
      S.store.state.combo = 0;
      const tip = spellingTip(w);
      fb.innerHTML = `<div class="fb fb-no">
          <b>✗ Not this time.</b> The word is <span class="fb-word">${esc(w.w)}</span> <span class="fb-ipa">${esc(w.ipa)}</span>
          <p class="fb-note">You wrote <b class="fb-yours">${esc($("#drillInput").value || "—")}</b>. ${tip}</p>
          <p class="fb-note">“${esc(w.sent)}”</p>
          <button class="btn sm" id="drillHearWord">🔊 Hear “${esc(w.w)}”</button>
        </div>`;
      const hb = $("#drillHearWord");
      if (hb) hb.addEventListener("click", () => S.speech.sayHuman(w.w));
      S.store.log(`Misspelled <b>${esc(w.w)}</b> → review queue`, "word");
    }
    S.store.save();
    renderTop();
    $("#comboNow").textContent = S.store.state.combo;
    $("#drillScoreNow").textContent = d.right;

    const last = d.i + 1 >= d.words.length;
    const box = fb;
    const btnRow = document.createElement("div");
    btnRow.className = "btn-row";
    btnRow.innerHTML = `<button class="btn ${ok ? "primary" : "ghost"}" id="drillNext">${last ? "See results 🎉" : "Next word →"}</button>`;
    box.appendChild(btnRow);
    $("#drillNext").addEventListener("click", () => {
      if (last) finishDrill();
      else {
        d.i++;
        d.answered = false;
        renderDrill();
        setTimeout(() => playDrillWord(), 250);
      }
    });
    $("#drillInput").blur();
    checkAwards();
  }

  // A tiny offline hint generator for a missed word
  function spellingTip(w) {
    const data = S.wordById(w.w) || w;
    const sm = S.SOUND_MAP.find((x) => x.spellings.some((sp) => sp.words.includes(data.w)));
    if (sm) {
      const spelling = sm.spellings.find((sp) => sp.words.includes(data.w));
      return `The <b>/${sm.sym}/</b> sound is spelled <b>${esc(spelling.s)}</b> here — ${esc(spelling.note)}.`;
    }
    const lesson = S.MODULES.flatMap((m) => m.lessons).find((l) => l.examples.some((e) => e.w === data.w));
    if (lesson) return `Tip: see the lesson <b>${esc(lesson.title)}</b> — “${esc(lesson.rule)}”`;
    return `Say it slowly: <b>${esc(data.ipa)}</b>.`;
  }

  function finishDrill() {
    const d = drill;
    const total = d.words.length;
    const acc = Math.round((d.right / total) * 100);
    const perfect = d.right === total;
    S.store.state.drillsDone += 1;
    S.store.touchStreak();
    const bonus = perfect ? 25 : acc >= 80 ? 10 : 0;
    if (bonus) gain(bonus, perfect ? "Perfect drill!" : "High accuracy bonus");
    gain(5, "Drill completed", { silent: !bonus });
    S.store.log(`Drill finished: <b>${d.right}/${total}</b> correct`, "drill");
    checkAwards();
    renderNav();
    renderStreakStrip();
    $("#view").innerHTML = `
      <section class="drill-result">
        <div class="drill-result-ico">${perfect ? "🏆" : acc >= 80 ? "🎉" : "💪"}</div>
        <h1>${perfect ? "Perfect drill!" : acc >= 80 ? "Great work!" : "Good session!"}</h1>
        <div class="drill-result-score">
          <b>${d.right}<span>/${total}</span></b>
          <span class="muted">${acc}% accuracy · ${S.store.state.streak}-day streak</span>
        </div>
        ${bonus ? `<p class="bonus">+${bonus} bonus XP</p>` : ""}
        ${d.wrongList.length ? `<div class="panel" style="margin-top:18px">
          <div class="panel-head"><h2>Words to review</h2></div>
          <div class="chips">${d.wrongList.map((w) => `<button class="chip wrong-chip" data-word="${esc(w.w)}">${esc(w.w)} <span class="chip-ipa">${esc(w.ipa)}</span></button>`).join("")}</div>
          <p class="muted" style="margin-top:10px">These are now in your review queue — they'll come back in future drills until you own them.</p>
        </div>` : `<p class="muted">No mistakes — every word is in your mastery box. Outstanding ear. 👂</p>`}
        <div class="btn-row">
          <button class="btn primary" id="drillAgain">🔁 Drill again</button>
          ${d.wrongList.length ? `<button class="btn ghost" id="drillFix">🎯 Review these ${d.wrongList.length} words</button>` : ""}
          <button class="btn ghost" data-nav="dashboard">← Home</button>
        </div>
      </section>`;
    $("#drillAgain").addEventListener("click", () => startDrill(d.source));
    const fix = $("#drillFix");
    if (fix) fix.addEventListener("click", () => startDrill("review"));
    if (perfect || acc >= 80) confetti(perfect ? 70 : 35);
  }

  /* =============================================================
     VIEW · SOUND MAP
     ============================================================= */
  function viewSoundMap() {
    const groups = [
      { title: "Vowels & diphthongs", type: "vowel" },
      { title: "Consonants", type: "consonant" },
    ];
    const st = S.store.state;
    return `
    <div class="page-head">
      <h1>Interactive Sound Map</h1>
      <p class="muted">Every English sound, and every way to spell it. Click a sound to see its spellings and hear example words. This is the map for “hear it → spell it right”.</p>
    </div>
    <input type="search" id="soundSearch" class="search-input" placeholder="Search a sound (/iː/), a spelling (ee) or a word…" />
    <div id="soundGroups">
    ${groups
      .map((g) => {
        const items = S.SOUND_MAP.filter((x) => x.type === g.type);
        return `<section class="panel">
          <div class="panel-head"><h2>${g.title}</h2><span class="muted">${items.length} sounds</span></div>
          <div class="sound-grid">
            ${items
              .map((x) => {
                const n = x.spellings.length;
                return `<button class="sound-cell" data-nav="sound" data-param="${encodeURIComponent(x.sym)}">
                  <span class="sound-sym">${x.sym}</span>
                  <span class="sound-key">${x.key}</span>
                  <span class="sound-n">${n} spelling${n > 1 ? "s" : ""}</span>
                </button>`;
              })
              .join("")}
          </div>
        </section>`;
      })
      .join("")}
    </div>`;
  }

  function afterSoundMap() {
    const input = $("#soundSearch");
    if (input) {
      input.addEventListener("input", () => {
        const q = input.value.trim().toLowerCase();
        $$(".sound-cell").forEach((c) => {
          const sym = decodeURIComponent(c.dataset.param || "").toLowerCase();
          const entry = S.SOUND_MAP.find((x) => x.sym.toLowerCase() === sym);
          const key = entry ? entry.key.toLowerCase() : "";
          const cellText = c.textContent.toLowerCase();
          const matchSpell = entry
            ? entry.spellings.some(
                (sp) => sp.s.toLowerCase().includes(q) || sp.words.some((w) => w.toLowerCase().includes(q))
              )
            : false;
          c.style.display = !q || sym.includes(q) || key.includes(q) || cellText.includes(q) || matchSpell
            ? ""
            : "none";
        });
      });
    }
  }

  function viewSound(sym) {
    const x = S.SOUND_MAP.find((s) => s.sym === sym);
    if (!x) return `<p class="muted">Sound not found.</p>`;
    const st = S.store.state;
    const allWords = x.spellings.flatMap((sp) => sp.words);
    const drillWords = allWords
      .map((w) => S.wordById(w))
      .filter(Boolean)
      .slice(0, 14);
    return `
    <button class="btn sm ghost back-btn" data-nav="soundmap">← Full sound map</button>
    <section class="sound-hero">
      <div class="sound-hero-sym">${x.sym}</div>
      <div>
        <h1>The <b>${x.sym}</b> sound</h1>
        <p class="muted">As in <b>${x.key}</b> · ${x.spellings.length} way${x.spellings.length > 1 ? "s" : ""} to spell it · ${allWords.length} example words</p>
        <button class="btn sm" id="soundHeroPlay">🔊 Hear “${x.key}”</button>
      </div>
    </section>
    <p class="sound-tip">When you hear this sound in a new word, scan the spellings below and pick the one that fits the pattern — most of the time there's a clear winner.</p>
    <div class="sound-spellings">
      ${x.spellings.map((sp) => `
        <section class="spelling-card">
          <div class="spelling-head">
            <span class="spelling-s">${esc(sp.s)}</span>
            <span class="spelling-note">${esc(sp.note)}</span>
          </div>
          <div class="chips">
            ${sp.words.map((w) => {
              const m = st.mastered[w] || {};
              return `<button class="chip word-chip ${m.box >= 4 ? "mastered" : ""}" data-word="${esc(w)}">${esc(w)}</button>`;
            }).join("")}
          </div>
        </section>`).join("")}
    </div>
    ${drillWords.length ? `<div class="btn-row">
        <button class="btn primary" data-nav="drill" data-param="sound:${encodeURIComponent(x.sym)}">🎯 Drill these ${drillWords.length} words</button>
      </div>` : ""}`;
  }

  function afterSound(sym) {
    const x = S.SOUND_MAP.find((s) => s.sym === sym);
    const btn = $("#soundHeroPlay");
    if (btn) btn.addEventListener("click", () => x && S.speech.sayHuman(x.key));
  }

  /* =============================================================
     VIEW · WRITING
     ============================================================= */
  let writingState = null;

  function viewWriting() {
    const p = S.WRITING_PROMPTS[0];
    writingState = { id: p.id, text: "" };
    return `
    <div class="page-head">
      <h1>Writing Lab</h1>
      <p class="muted">Spelling lives inside sentences. Pick a prompt, write freely, then let Lex read it back and coach you — just like a real tutor.</p>
    </div>
    <div class="write-layout">
      <section class="panel write-main">
        <div class="prompt-card" id="promptCard">
          <span class="prompt-level">${p.level}</span>
          <h2 id="promptTitle">${esc(p.title)}</h2>
          <p id="promptText">${esc(p.prompt)}</p>
        </div>
        <div class="write-toolbar">
          <span class="muted" id="writeCount">0 words</span>
          <span class="muted" id="writeGoal">goal: ${p.min}+ words</span>
          <button class="btn sm ghost" id="writeSpeak">🔊 Read my text</button>
          <button class="btn sm ghost" id="writeClear">🗑 Clear</button>
        </div>
        <textarea class="write-area" id="writeArea" placeholder="Start writing here… Don't worry about mistakes — that's what the coach is for."></textarea>
        <div class="btn-row">
          <button class="btn primary" id="writeCheck">🧠 Coach my writing</button>
          <button class="btn ghost" id="writeNextPrompt">⏭ Next prompt</button>
        </div>
        <div class="write-feedback" id="writeFeedback"></div>
      </section>
      <aside class="write-side">
        <section class="panel">
          <h2 class="panel-title">✍️ Writing rules worth keeping</h2>
          <ul class="watch-list">
            <li><b>Sound it out</b> — say each syllable as you write the tricky word.</li>
            <li><b>Slow down on vowel teams</b> — ee/ea, ai/ay, oa/ow are where most mistakes hide.</li>
            <li><b>Check the homophones</b> — there/their/they're, its/it's. Meaning decides.</li>
            <li><b>Doubt the double</b> — one syllable + one short vowel + one consonant → double.</li>
            <li><b>Read it aloud</b> — your ear catches what your eye misses.</li>
          </ul>
        </section>
        <section class="panel">
          <h2 class="panel-title">🧠 Challenge words</h2>
          <p class="muted">Try to use at least three of these in your text:</p>
          <div class="chips">${["necessary", "environment", "friend", "receive", "knowledge", "beautiful"].map(
            (w) => `<button class="chip word-chip" data-word="${w}">${w}</button>`
          ).join("")}</div>
        </section>
        <section class="panel wi-panel">
          <h2 class="panel-title">🎓 Write &amp; Improve</h2>
          <p class="muted">Cambridge's free tool grades your text against CEFR levels (A1–C2) in seconds. Spellwise coaches your <b>spelling</b>; Write &amp; Improve grades the <b>whole piece</b>.</p>
          <div class="btn-row">
            <button class="btn primary" id="wiOpen">🚀 Grade on Write &amp; Improve</button>
            <button class="btn ghost" id="wiCopy">📋 Copy my text</button>
          </div>
          <p class="muted wi-note" id="wiNote">Tip: pick a task, paste your text, and hit <b>Check</b>. Work on the red-marked words back here in the Sound Map.</p>
        </section>
      </aside>
    </div>`;
  }

  function afterWriting() {
    const area = $("#writeArea");
    const count = $("#writeCount");
    if (area) {
      area.addEventListener("input", () => {
        const n = (area.value.trim().match(/\S+/g) || []).length;
        count.textContent = n + " word" + (n === 1 ? "" : "s");
      });
    }
    const speak = $("#writeSpeak");
    if (speak) speak.addEventListener("click", () => {
      const t = ($("#writeArea").value || "").trim();
      if (!t) return toast("Nothing to read yet — write something first.", "✍️");
      S.speech.say(t.replace(/\s+/g, " "));
    });
    const clear = $("#writeClear");
    if (clear) clear.addEventListener("click", () => {
      area.value = "";
      count.textContent = "0 words";
      $("#writeFeedback").innerHTML = "";
    });
    const next = $("#writeNextPrompt");
    if (next) next.addEventListener("click", () => {
      const i = S.WRITING_PROMPTS.findIndex((p) => p.id === writingState.id);
      const p = S.WRITING_PROMPTS[(i + 1) % S.WRITING_PROMPTS.length];
      writingState = { id: p.id, text: "" };
      $("#promptLevel");
      $("#promptCard").querySelector(".prompt-level").textContent = p.level;
      $("#promptTitle").textContent = p.title;
      $("#promptText").textContent = p.prompt;
      $("#writeGoal").textContent = "goal: " + p.min + "+ words";
      area.value = "";
      count.textContent = "0 words";
      $("#writeFeedback").innerHTML = "";
      toast("New prompt: " + p.title, "✍️");
    });
    const check = $("#writeCheck");
    if (check) check.addEventListener("click", coachWriting);

    // Write & Improve integration: hand the text to Cambridge's grader.
    const wiCopy = $("#wiCopy");
    if (wiCopy) wiCopy.addEventListener("click", async () => {
      const t = (area.value || "").trim();
      const note = $("#wiNote");
      if (!t) { toast("Write something first, then copy it.", "✍️"); return; }
      let done = false;
      try {
        await navigator.clipboard.writeText(t);
        done = true;
      } catch (e) {
        area.select();
        try { done = document.execCommand("copy"); } catch (e2) { done = false; }
      }
      if (note) note.innerHTML = done
        ? "✅ <b>Text copied.</b> Now open Write &amp; Improve and paste it into any task."
        : "Copy failed — select your text manually and press Ctrl/⌘+C.";
      toast(done ? "Copied — ready to paste" : "Copy failed", done ? "📋" : "⚠️");
    });
    const wiOpen = $("#wiOpen");
    if (wiOpen) wiOpen.addEventListener("click", () => {
      gain(4, "Sent writing to Write & Improve", { silent: true });
      S.store.log("Opened <b>Write &amp; Improve</b> 🎓", "info");
      S.store.save();
      window.open("https://writeandimprove.com/", "_blank", "noopener,noreferrer");
    });
  }

  function coachWriting() {
    const area = $("#writeArea");
    const fb = $("#writeFeedback");
    const text = (area.value || "").trim();
    const words = text.split(/\s+/).filter(Boolean);
    const prompt = S.WRITING_PROMPTS.find((p) => p.id === writingState.id);
    if (words.length < 10) {
      fb.innerHTML = `<div class="fb fb-info"><b>Keep going.</b> Write at least a few sentences so I have something to coach. (You're at ${words.length} words; the goal is ${prompt.min}+.)</div>`;
      return;
    }
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length;
    const longSent = text.split(/[.!?]+/).filter((s) => (s.trim().split(/\s+/) || []).length > 28).length;
    const lower = words.map((w) => w.toLowerCase().replace(/[^a-z']/g, ""));
    const repeats = {};
    lower.forEach((w) => (repeats[w] = (repeats[w] || 0) + 1));
    const overused = Object.keys(repeats).filter((w) => repeats[w] > 3 && w.length > 3);
    const challenge = ["necessary", "environment", "friend", "receive", "knowledge", "beautiful"].filter(
      (w) => lower.includes(w)
    );
    const known = S.allWordIds();
    const offline = `<div class="fb fb-ok">
        <b>💪 First read-through</b>
        <ul class="coach-list">
          <li><b>${words.length} words</b> across ${sentences} sentence${sentences === 1 ? "" : "s"} ${words.length >= prompt.min ? "— you hit the goal. ✅" : `— goal is ${prompt.min}+. A little more?`}</li>
          ${longSent ? `<li>⚠️ ${longSent} sentence${longSent > 1 ? "s" : ""} run long (28+ words). Short ones hit harder.</li>` : `<li>Sentence length looks healthy. 👍</li>`}
          ${overused.length ? `<li>🔁 You reused <b>${overused.slice(0, 4).map(esc).join(", ")}</b> a lot — try synonyms.</li>` : ""}
          <li>🧠 Challenge words used: ${challenge.length ? `<b>${challenge.join(", ")}</b>` : "none yet — try to slip some in!"}</li>
          <li>👂 Tap <b>🔊 Read my text</b> and follow along — your ear will flag any word that looks wrong.</li>
        </ul>
      </div>`;

    fb.innerHTML = offline + `<div id="writeLLMBox"></div>`;

    const st = S.store.state.settings;
    if (st.useLLM && st.llmKey) {
      const box = $("#writeLLMBox");
      box.innerHTML = `<div class="fb fb-info"><b>Lex is reading your text…</b></div>`;
      S.bot
        .answer(
          "Coach this student's short English text. Praise two specific things, then give 3 concrete fixes (spelling, word choice, grammar). Keep it under 130 words. Text:\n\n" + text
        )
        .then((r) => {
          box.innerHTML = `<div class="fb fb-info"><b>🧠 Lex's feedback</b><div class="prose">${r.html}</div></div>`;
          if (!S.muted) S.speech.say("Here's my feedback on your writing.");
          gain(8, "Writing coached by Lex", { silent: true });
          checkAwards();
        })
        .catch(() => {
          box.innerHTML = `<div class="fb fb-no"><b>Couldn't reach the LLM.</b> The offline feedback above still stands.</div>`;
        });
    } else {
      fb.insertAdjacentHTML(
        "beforeend",
        `<div class="fb fb-info"><b>Want deeper feedback?</b> Add an LLM API key in <button class="link-btn" data-nav="settings">Settings</button> and I'll critique your writing paragraph by paragraph.</div>`
      );
    }
    gain(6, "Writing session", { silent: true });
    checkAwards();
    S.store.save();
  }

  /* =============================================================
     VIEW · PROGRESS
     ============================================================= */
  function viewProgress() {
    const st = S.store.state;
    const info = S.store.levelInfo(st.xp);
    const stats = S.store.stats();
    const wrong = Object.keys(st.wrongWords).sort((a, b) => st.wrongWords[b] - st.wrongWords[a]);
    return `
    <div class="page-head">
      <h1>Progress</h1>
      <p class="muted">Everything you've earned. Every mistake is tracked here until you fix it — that's the whole system.</p>
    </div>

    <section class="panel level-panel">
      <div class="level-ring small">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="60" r="52" class="ring-bg"></circle>
          <circle cx="60" cy="60" r="52" class="ring-fg" style="stroke-dasharray:${2 * Math.PI * 52};stroke-dashoffset:${2 * Math.PI * 52 * (1 - info.pct / 100)}"></circle>
        </svg>
        <div class="level-ring-inner"><span class="lv-ico">${info.icon}</span><span class="lv-name">${info.name}</span></div>
      </div>
      <div class="level-body">
        <h2>${info.icon} ${info.name} · level ${info.index + 1}</h2>
        <div class="xp-bar"><i style="width:${info.pct}%"></i></div>
        <p class="muted">${info.next ? `${info.xp} XP · ${info.into}/${info.span} XP to reach <b>${info.next}</b>` : `${info.xp} XP · highest level reached 👑`}</p>
      </div>
    </section>

    <div class="stats-grid">
      ${statCard("🎯", stats.accuracy + "%", "accuracy", stats.mastered + " words mastered")}
      ${statCard("📚", stats.learned, "words learned", S.allWordIds().length + " in the app")}
      ${statCard("🔥", stats.streak, "day streak", "best " + stats.bestStreak)}
      ${statCard("⚡", stats.bestCombo, "best combo", "in a single drill")}
      ${statCard("🏋️", stats.drills, "drills done", stats.queue + " in review queue")}
      ${statCard("🏅", stats.lessonsDone, "lessons done", "of " + stats.totalLessons)}
    </div>

    ${wrong.length ? `<section class="panel">
      <div class="panel-head"><h2>⚠️ Words you've missed</h2><span class="muted">Sorted by how often</span></div>
      <div class="chips">${wrong.slice(0, 30).map((w) =>
        `<button class="chip wrong-chip" data-word="${esc(w)}">${esc(w)} <span class="chip-ipa">${esc((S.wordById(w) || {}).ipa || "")}</span> <b>×${st.wrongWords[w]}</b></button>`
      ).join("")}</div>
      <div class="btn-row"><button class="btn primary" data-nav="drill" data-param="review">🎯 Drill my mistakes</button></div>
    </section>` : ""}

    <section class="panel">
      <div class="panel-head"><h2>Achievements</h2><span class="muted">${st.achievements.length}/${S.ACHIEVEMENTS.length} unlocked</span></div>
      <div class="ach-grid">
        ${S.ACHIEVEMENTS.map((a) => {
          const got = st.achievements.includes(a.id);
          return `<div class="ach-card ${got ? "unlocked" : "locked"}" title="${esc(a.desc)}">
            <span class="ach-ico">${a.icon}</span>
            <b class="ach-title">${esc(a.title)}</b>
            <span class="ach-desc">${esc(a.desc)}</span>
            ${a.xp ? `<span class="ach-xp">+${a.xp} XP</span>` : ""}
          </div>`;
        }).join("")}
      </div>
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Activity log</h2></div>
      ${st.history.length
        ? `<ul class="activity">${st.history.slice(0, 25).map((h) =>
            `<li><span class="act-kind kind-${h.kind}">${({ xp: "⭐", level: "🎉", award: "🏅", module: "🏅", word: "🎯", drill: "🏋️" })[h.kind] || "•"}</span><span>${h.text}</span></li>`
          ).join("")}</ul>`
        : `<p class="muted">Your activity will appear here.</p>`}
    </section>

    <section class="panel danger-panel">
      <h2 class="panel-title">Danger zone</h2>
      <p class="muted">Reset all progress, XP, streaks and achievements. This cannot be undone.</p>
      <button class="btn danger" id="resetBtn">🗑 Reset all progress</button>
    </section>`;
  }

  function afterProgress() {
    const rb = $("#resetBtn");
    if (rb)
      rb.addEventListener("click", () => {
        modal(
          `<h3>Reset everything?</h3>
           <p class="muted">This erases your XP, levels, streaks, achievements and word mastery permanently.</p>
           <div class="btn-row">
             <button class="btn danger" id="confirmReset">Yes, reset it all</button>
             <button class="btn ghost" data-close>Cancel</button>
           </div>`
        );
        $("#confirmReset").addEventListener("click", () => {
          S.store.resetAll();
          closeModal();
          go("dashboard");
          toast("Progress reset. Fresh start! 🌱", "🌱");
        });
      });
  }

  /* =============================================================
     VIEW · SETTINGS
     ============================================================= */
  function viewSettings() {
    const st = S.store.state.settings;
    const voices = S.speech.listVoices();
    return `
    <div class="page-head">
      <h1>Settings</h1>
      <p class="muted">Tune the voice, connect an AI brain, or start over. Everything is stored locally in your browser — nothing leaves your device except the optional LLM key.</p>
    </div>

    <section class="panel">
      <h2 class="panel-title">🗣️ Voice</h2>
      <div class="setting-row">
        <label for="setVoice">Voice</label>
        <select id="setVoice" class="select">
          <option value="">Auto (recommended)</option>
          ${voices.map((v) => `<option value="${esc(v.voiceURI)}" ${st.voiceURI === v.voiceURI ? "selected" : ""}>${esc(v.name)} — ${esc(v.lang)}</option>`).join("")}
        </select>
      </div>
      <div class="setting-row">
        <label for="setRate">Speed <b id="setRateVal">${st.voiceRate.toFixed(2)}×</b></label>
        <input type="range" id="setRate" min="0.5" max="1.4" step="0.05" value="${st.voiceRate}" />
      </div>
      <div class="setting-row">
        <label for="setPitch">Pitch <b id="setPitchVal">${st.voicePitch.toFixed(2)}</b></label>
        <input type="range" id="setPitch" min="0.6" max="1.6" step="0.05" value="${st.voicePitch}" />
      </div>
      <div class="btn-row"><button class="btn sm" id="testVoice">🔊 Test voice</button></div>
      ${!voices.length ? `<p class="muted">Your browser didn't report any voices. Drills will use dictionary recordings when available.</p>` : ""}
    </section>

    <section class="panel">
      <h2 class="panel-title">🧠 AI tutor (optional)</h2>
      <p class="muted">By default Lex runs on a built-in rule brain — free, private and instant. Add a Google Gemini or OpenAI key to unlock deeper explanations and paragraph-level writing feedback. The key is stored only in this browser.</p>
      <div class="setting-row">
        <label for="setUseLLM">Use LLM brain</label>
        <input type="checkbox" id="setUseLLM" ${st.useLLM ? "checked" : ""} class="switch" />
      </div>
      <div class="setting-row">
        <label for="setProvider">Provider</label>
        <select id="setProvider" class="select">
          <option value="gemini" ${st.llmProvider === "gemini" ? "selected" : ""}>Google Gemini</option>
          <option value="openai" ${st.llmProvider === "openai" ? "selected" : ""}>OpenAI (or compatible)</option>
        </select>
      </div>
      <div class="setting-row">
        <label for="setKey">API key</label>
        <input type="password" id="setKey" class="input" placeholder="paste your key…" value="${esc(st.llmKey)}" />
      </div>
      <div class="setting-row">
        <label for="setModel">Model <span class="muted">(optional)</span></label>
        <input type="text" id="setModel" class="input" placeholder="${st.llmProvider === "openai" ? "gpt-4o-mini" : "gemini-1.5-flash"}" value="${esc(st.llmModel)}" />
      </div>
      <div class="btn-row"><button class="btn sm" id="testLLM">Test connection</button></div>
      <p class="muted" id="llmTestResult"></p>
    </section>

    <section class="panel">
      <h2 class="panel-title">🔊 Audio</h2>
      <div class="setting-row">
        <label for="setMuted">App sound effects & speech</label>
        <input type="checkbox" id="setMuted" ${S.muted ? "checked" : ""} class="switch" />
      </div>
    </section>

    <section class="panel">
      <h2 class="panel-title">💾 Your data</h2>
      <p class="muted">All progress lives in this browser's local storage. Clearing browser data erases it.</p>
      <div class="btn-row">
        <button class="btn sm" id="exportBtn">⬇ Export progress (JSON)</button>
        <button class="btn sm danger" data-nav="progress">📊 See progress & reset</button>
      </div>
    </section>`;
  }

  function afterSettings() {
    const st = S.store.state.settings;
    const bind = (id, fn) => {
      const el = $(id);
      if (el) el.addEventListener("input", fn);
    };
    bind("#setRate", (e) => {
      st.voiceRate = +e.target.value;
      $("#setRateVal").textContent = st.voiceRate.toFixed(2) + "×";
      S.store.save();
    });
    bind("#setPitch", (e) => {
      st.voicePitch = +e.target.value;
      $("#setPitchVal").textContent = st.voicePitch.toFixed(2);
      S.store.save();
    });
    const voice = $("#setVoice");
    if (voice) voice.addEventListener("change", (e) => {
      S.speech.setVoice(e.target.value);
      toast("Voice updated", "🗣️");
    });
    const test = $("#testVoice");
    if (test) test.addEventListener("click", () => S.speech.say("Spellwise. Hear it, spell it, right first time."));
    bind("#setUseLLM", (e) => { st.useLLM = e.target.checked; S.store.save(); });
    bind("#setProvider", (e) => { st.llmProvider = e.target.value; S.store.save(); });
    bind("#setKey", (e) => { st.llmKey = e.target.value.trim(); S.store.save(); });
    bind("#setModel", (e) => { st.llmModel = e.target.value.trim(); S.store.save(); });
    bind("#setMuted", (e) => {
      S.muted = e.target.checked;
      st.muted = S.muted;
      renderTop();
      S.store.save();
    });
    const testLLM = $("#testLLM");
    if (testLLM)
      testLLM.addEventListener("click", async () => {
        const out = $("#llmTestResult");
        out.textContent = "Testing…";
        try {
          const r = await S.bot.answer("Say hello in one short sentence and tell me you're ready to teach spelling.");
          out.innerHTML = `<span class="ok">✓ Connected.</span> ${r.html}`;
        } catch (e) {
          out.innerHTML = `<span class="no">✗ ${esc(e.message)}</span>`;
        }
      });
    const exp = $("#exportBtn");
    if (exp)
      exp.addEventListener("click", () => {
        const data = JSON.stringify(S.store.state, null, 2);
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([data], { type: "application/json" }));
        a.download = "spellwise-progress.json";
        a.click();
      });
  }

  /* =============================================================
     BOT
     ============================================================= */
  let botOpen = false;
  let botTTS = true;

  function botOpen_set(v) {
    botOpen = v;
    $("#botPanel").classList.toggle("open", v);
    $("#botPanel").setAttribute("aria-hidden", String(!v));
    if (v) {
      $("#botBadge").hidden = true;
      $("#botText").focus();
    }
  }

  function botAdd(html, who) {
    const body = $("#botBody");
    const d = document.createElement("div");
    d.className = "msg " + (who === "me" ? "me" : "lex");
    d.innerHTML = html;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
    return d;
  }

  async function botSay(html, skipIntro) {
    if (!skipIntro && !botOpen) {
      const b = $("#botBadge");
      b.hidden = false;
      b.textContent = "1";
    }
    const body = $("#botBody");
    const typing = document.createElement("div");
    typing.className = "msg lex typing";
    typing.innerHTML = "<span></span><span></span><span></span>";
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;
    await new Promise((r) => setTimeout(r, 420 + Math.random() * 320));
    typing.remove();
    const msg = botAdd(html, "lex");
    if (botTTS && !S.muted) {
      const plain = msg.textContent;
      if (plain) S.speech.say(plain.slice(0, 600));
    }
  }

  function botChips() {
    const chips = [
      "How do I spell necessary?",
      "How do I spell the /iː/ sound?",
      "Explain the magic e",
      "Why is English spelling crazy?",
      "Quiz me",
    ];
    $("#botChips").innerHTML = chips
      .map((c) => `<button class="bot-chip" data-chip="${esc(c)}">${esc(c)}</button>`)
      .join("");
  }

  async function botSend(text) {
    if (!text || !text.trim()) return;
    botAdd(esc(text), "me");
    const placeholder = botAdd("<i>thinking…</i>", "lex");
    try {
      const r = await S.bot.answer(text);
      placeholder.innerHTML = r.html;
      $("#botStatus").textContent = r.llm
        ? "Spelling tutor · LLM powered"
        : "Spelling tutor · built-in brain";
      if (botTTS && !S.muted && placeholder.textContent) {
        S.speech.say(placeholder.textContent.slice(0, 600));
      }
    } catch (e) {
      placeholder.innerHTML = `<span class="no">⚠️ ${esc(e.message)}</span>`;
    }
  }

  function wireBot() {
    $("#botFab").addEventListener("click", () => botOpen_set(!botOpen));
    $("#botMin").addEventListener("click", () => botOpen_set(false));
    $("#botTtsToggle").addEventListener("click", (e) => {
      botTTS = !botTTS;
      e.currentTarget.style.opacity = botTTS ? "1" : "0.45";
    });
    $("#botForm").addEventListener("submit", (ev) => {
      ev.preventDefault();
      const t = $("#botText").value;
      $("#botText").value = "";
      botSend(t);
    });
    $("#botMic").addEventListener("click", async () => {
      try {
        const r = await S.speech.listen();
        if (r.transcript) botSend(r.transcript);
      } catch (e) {
        const err = $("#botErr");
        err.hidden = false;
        err.textContent = e.message;
        setTimeout(() => (err.hidden = true), 4000);
      }
    });
    $("#botChips").addEventListener("click", (e) => {
      const c = e.target.closest("[data-chip]");
      if (c) botSend(c.dataset.chip);
    });
    botChips();
    if (S.store.state.seenWelcome) {
      botSay(
        "<b>Hi, I'm Lex</b> 🧠 — your spelling tutor. Ask me <i>how do I spell necessary?</i>, or try one of the suggestions below. I know every sound and pattern in this app.",
        true
      );
    }
  }

  /* =============================================================
     GLOBAL EVENTS
     ============================================================= */
  document.addEventListener("click", (e) => {
    // navigation buttons
    const nav = e.target.closest("[data-nav]");
    if (nav) {
      go(nav.dataset.nav, nav.dataset.param || null);
      return;
    }
    // word cards/chips → pronounce + lookup panel
    const wordBtn = e.target.closest("[data-word]");
    if (wordBtn) {
      const w = wordBtn.dataset.word;
      wordFlyout(wordBtn, w);
      return;
    }
  });

  function wordFlyout(anchor, word) {
    const data = S.wordById(word);
    S.speech.sayHuman(word);
    // close any existing flyout
    const old = $(".word-flyout");
    if (old) old.remove();
    const d = document.createElement("div");
    d.className = "word-flyout";
    d.innerHTML = `
      <button class="wf-x" aria-label="Close">✕</button>
      <b class="wf-w">${esc(word)}</b>
      <span class="wf-ipa">${esc((data && data.ipa) || "…")}</span>
      <p class="wf-sent">${esc((data && data.sent) || "")}</p>
      <div class="wf-actions">
        <button class="btn sm" data-wf="say">🔊 Again</button>
        <button class="btn sm" data-wf="slow">🐢 Slow</button>
        <button class="btn sm ghost" data-wf="dict">🎯 Drill this word</button>
      </div>`;
    document.body.appendChild(d);
    const close = () => d.remove();
    d.querySelector(".wf-x").addEventListener("click", close);
    d.addEventListener("click", (ev) => {
      const act = ev.target.closest("[data-wf]");
      if (!act) return;
      const a = act.dataset.wf;
      if (a === "say") S.speech.sayHuman(word);
      else if (a === "slow") S.speech.saySlow(word);
      else if (a === "dict") {
        close();
        go("drill", "word:" + encodeURIComponent(word));
      }
    });
    // position near the anchor, keep on screen
    const r = anchor.getBoundingClientRect();
    const dw = 280;
    let left = Math.max(8, Math.min(r.left, window.innerWidth - dw - 8));
    let top = r.bottom + 8;
    d.style.left = left + "px";
    d.style.top = top + "px";
    d.style.width = dw + "px";
    requestAnimationFrame(() => {
      const dr = d.getBoundingClientRect();
      if (dr.bottom > window.innerHeight - 8) {
        d.style.top = Math.max(8, r.top - dr.height - 8) + "px";
      }
    });
    setTimeout(() => document.addEventListener("click", function h(ev2) {
      if (!d.contains(ev2.target) && ev2.target !== anchor) {
        close();
        document.removeEventListener("click", h);
      }
    }), 0);
  }

  $("#menuBtn").addEventListener("click", () => document.body.classList.toggle("nav-open"));
  $("#topSound").addEventListener("click", () => {
    S.muted = !S.muted;
    renderTop();
    toast(S.muted ? "Sound muted" : "Sound on", S.muted ? "🔇" : "🔊");
  });

  // keyboard: Escape closes bot / flyouts
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const f = $(".word-flyout");
      if (f) f.remove();
      else if (botOpen) botOpen_set(false);
      else closeModal();
    }
  });

  /* =============================================================
     BOOT
     ============================================================= */
  function boot() {
    S.store.load();
    S.store.touchStreak();
    S.muted = !!S.store.state.settings.muted;
    renderNav();
    renderTop();
    wireBot();
    let startView = "dashboard";
    let startParam = null;
    try {
      const hash = location.hash.replace(/^#/, "");
      if (hash) {
        const [v, p] = hash.split("/");
        if (TITLES[v]) {
          startView = v;
          try {
            startParam = decodeURIComponent(p || "");
          } catch (e) {
            startParam = p || null;
          }
          if (!startParam) startParam = null;
        }
      }
    } catch (e) {}
    if (startView === "lesson" && !S.findLesson(startParam)) startView = "dashboard";
    if (startView === "sound" && !S.SOUND_MAP.some((s) => s.sym === startParam)) startView = "soundmap";
    go(startView, startParam, { noHistory: true });
    // replace initial history entry
    try {
      history.replaceState({ view: startView, param: startParam }, "", location.hash || "#dashboard");
    } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

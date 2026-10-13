/* ============================================================
   SPELLWISE · store.js
   Progress persistence (localStorage), XP/levels, streaks,
   achievements, spaced-repetition review queue, word mastery.
   ============================================================ */
(function () {
  "use strict";
  window.SW = window.SW || {};
  const S = window.SW;
  const KEY = "spellwise.progress.v1";

  const DAY = 24 * 60 * 60 * 1000;
  const ymd = (d) => d.toISOString().slice(0, 10);
  const today = () => ymd(new Date());
  const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / DAY);

  const DEFAULT_STATE = () => ({
    xp: 0,
    lessonsDone: [],       // lesson ids
    modulesDone: [],       // module ids
    perfectQuizzes: 0,
    drillsDone: 0,
    correctTotal: 0,
    wrongTotal: 0,
    bestCombo: 0,
    combo: 0,              // current run combo (resets on wrong answer)
    fixedCount: 0,         // words recovered from the review queue
    mastered: {},          // word -> {lvl, box, next, right, wrong, last}
    reviewQueue: [],       // word ids scheduled for review
    wrongWords: {},        // word -> count of recent mistakes
    lastActive: null,      // YYYY-MM-DD
    activeDays: [],        // list of YYYY-MM-DD (for the streak strip)
    streak: 0,
    bestStreak: 0,
    achievements: [],      // unlocked ids
    history: [],           // recent activity entries (newest first)
    settings: {
      voiceRate: 0.9,
      voicePitch: 1,
      voiceURI: "",
      useLLM: false,
      llmProvider: "gemini", // gemini | openai
      llmKey: "",
      llmModel: "",
      autoPlay: true,
      muted: false,
    },
    createdAt: Date.now(),
  });

  let state = null;

  function load() {
    if (state) return state;
    try {
      const raw = localStorage.getItem(KEY);
      state = raw ? JSON.parse(raw) : DEFAULT_STATE();
      // merge any missing keys from defaults (forward-compatible)
      const def = DEFAULT_STATE();
      for (const k of Object.keys(def)) {
        if (state[k] === undefined) state[k] = def[k];
      }
      state.settings = Object.assign(def.settings, state.settings || {});
    } catch (e) {
      console.warn("Spellwise: could not read saved progress, starting fresh.", e);
      state = DEFAULT_STATE();
    }
    return state;
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Spellwise: could not save progress.", e);
    }
  }

  function log(text, kind) {
    state.history.unshift({ t: Date.now(), text, kind: kind || "info" });
    if (state.history.length > 60) state.history.length = 60;
  }

  /* ---------- Levels ---------- */
  function levelInfo(xp) {
    const L = S.LEVELS;
    let idx = 0;
    for (let i = 0; i < L.length; i++) {
      if (xp >= L[i].min) idx = i;
    }
    const cur = L[idx];
    const next = L[idx + 1] || null;
    const floor = cur.min;
    const ceil = next ? next.min : cur.min;
    const pct = next
      ? Math.min(100, Math.round(((xp - floor) / (ceil - floor)) * 100))
      : 100;
    return {
      index: idx,
      name: cur.name,
      icon: cur.icon,
      xp,
      into: xp - floor,
      span: next ? ceil - floor : 1,
      next: next ? next.name : null,
      pct,
    };
  }

  /* ---------- XP ---------- */
  function addXP(n, why) {
    const before = levelInfo(state.xp).index;
    state.xp += Math.max(0, Math.round(n));
    const after = levelInfo(state.xp).index;
    if (after > before) {
      const lv = S.LEVELS[after];
      log(`Level up! You reached <b>${lv.icon} ${lv.name}</b>`, "level");
    }
    if (why) log(`+${Math.round(n)} XP · ${why}`, "xp");
    return after > before;
  }

  /* ---------- Streak ---------- */
  function touchStreak() {
    const t = today();
    if (state.lastActive === t) return state.streak;
    if (state.lastActive) {
      const gap = daysBetween(state.lastActive, t);
      if (gap === 1) state.streak += 1;
      else if (gap > 1) state.streak = 1;
    } else {
      state.streak = 1;
    }
    state.lastActive = t;
    if (!state.activeDays.includes(t)) {
      state.activeDays.push(t);
      if (state.activeDays.length > 60) state.activeDays.shift();
    }
    if (state.streak > state.bestStreak) state.bestStreak = state.streak;
    return state.streak;
  }

  /* ---------- Word mastery (Leitner-style boxes) ---------- */
  // box 0 = new, 1..4 = learned→mastered. Wrong answer → box 0.
  const DAY_MS = DAY;
  function boxInterval(box) {
    return [0, 1, 3, 7, 21][box] || 21;
  }

  function recordWord(word, ok) {
    const m = state.mastered[word] || { box: 0, right: 0, wrong: 0, next: 0, lvl: 1 };
    m.last = Date.now();
    if (ok) {
      m.right += 1;
      m.box = Math.min(4, m.box + 1);
      state.correctTotal += 1;
      state.combo += 1;
      if (state.combo > state.bestCombo) state.bestCombo = state.combo;
      // promote into / out of the review queue
      if (m.box < 4 && m.next > Date.now()) {
        /* still scheduled — will reschedule below */
      }
    } else {
      m.wrong += 1;
      m.box = 0;
      state.wrongTotal += 1;
      state.combo = 0;
      state.wrongWords[word] = (state.wrongWords[word] || 0) + 1;
      if (!state.reviewQueue.includes(word)) state.reviewQueue.push(word);
    }
    m.next = Date.now() + boxInterval(m.box) * DAY_MS;
    state.mastered[word] = m;
    return m;
  }

  // Words due for review (from the queue and from expired boxes)
  function dueWords(limit) {
    const now = Date.now();
    const out = [];
    const seen = new Set();
    const take = (w) => {
      if (!seen.has(w) && S.wordById(w)) {
        seen.add(w);
        out.push(w);
      }
    };
    state.reviewQueue.slice(0, limit).forEach(take);
    if (out.length < limit) {
      for (const w of Object.keys(state.mastered)) {
        if (out.length >= limit) break;
        const m = state.mastered[w];
        if (m.box > 0 && m.box < 4 && m.next <= now) take(w);
      }
    }
    if (out.length < limit) {
      // unlearned new words fill the rest
      for (const w of S.allWordIds()) {
        if (out.length >= limit) break;
        if (!state.mastered[w]) take(w);
      }
    }
    return out.slice(0, limit || 12);
  }

  function fixWord(word) {
    const i = state.reviewQueue.indexOf(word);
    if (i >= 0) {
      state.reviewQueue.splice(i, 1);
      state.fixedCount += 1;
    }
    delete state.wrongWords[word];
  }

  /* ---------- Lessons & modules ---------- */
  function completeLesson(id, perfect) {
    if (!state.lessonsDone.includes(id)) state.lessonsDone.push(id);
    const mod = S.moduleOfLesson(id);
    if (mod && mod.lessons.every((l) => state.lessonsDone.includes(l.id))) {
      if (!state.modulesDone.includes(mod.id)) {
        state.modulesDone.push(mod.id);
        log(`Module complete: <b>${mod.icon} ${mod.title}</b>`, "module");
        return true; // module-level event
      }
    }
    if (perfect) state.perfectQuizzes += 1;
    return false;
  }

  /* ---------- Achievements ---------- */
  function checkAchievements() {
    const newly = [];
    for (const a of S.ACHIEVEMENTS) {
      if (!state.achievements.includes(a.id) && a.test(state)) {
        state.achievements.push(a.id);
        addXP(a.xp);
        newly.push(a);
        log(`Achievement unlocked: <b>${a.icon} ${a.title}</b>`, "award");
      }
    }
    return newly;
  }

  /* ---------- Stats ---------- */
  function stats() {
    const learned = Object.keys(state.mastered).filter((w) => state.mastered[w].box > 0).length;
    const mastered = Object.keys(state.mastered).filter((w) => state.mastered[w].box >= 4).length;
    const total = state.correctTotal + state.wrongTotal;
    return {
      learned,
      mastered,
      totalLessons: S.totalLessons(),
      lessonsDone: state.lessonsDone.length,
      accuracy: total ? Math.round((state.correctTotal / total) * 100) : 0,
      drills: state.drillsDone,
      queue: state.reviewQueue.length,
      xp: state.xp,
      streak: state.streak,
      bestStreak: state.bestStreak,
      bestCombo: state.bestCombo,
    };
  }

  function resetAll() {
    state = DEFAULT_STATE();
    save();
  }

  /* ---------- Public API ---------- */
  S.store = {
    get state() {
      return load();
    },
    save,
    load,
    log,
    addXP,
    touchStreak,
    levelInfo,
    recordWord,
    dueWords,
    fixWord,
    completeLesson,
    checkAchievements,
    stats,
    resetAll,
  };
})();

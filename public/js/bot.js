/* ============================================================
   SPELLWISE · bot.js
   "Lex" — the spelling tutor bot.
   Offline rule-based brain by default, with an optional LLM
   (Google Gemini or OpenAI-compatible) for richer answers.
   ============================================================ */
(function () {
  "use strict";
  window.SW = window.SW || {};
  const S = window.SW;

  const RULES = [
    { re: /\b(hi|hello|hey|salam|hallo|yo)\b/i, reply: () => "Hello! I'm <b>Lex</b>, your spelling tutor. Ask me about any word — <i>how do I spell 'necessary'?</i> — or say <i>quiz me</i>." },
    { re: /\b(quiz|test|challenge|drill)\s+me\b/i, reply: () => "Let's go! A dictation drill starts in the <b>Practice</b> tab — I'll say a word, you spell it. Or ask me about a sound, like <i>how do I spell the /iː/ sound?</i>" },
    { re: /how (do|should|can) i (spell|write)\s+(?:the\s+)?(sound|phoneme)?\s*\/?([a-zː:]+)\/?/i, reply: (m) => soundMapAnswer(m[3] || m[4]) },
    { re: /\/([a-zː:]+)\//i, reply: (m) => soundMapAnswer(m[1]) },
    { re: /\b(i|we)\s+(?:am|are|was|were)\s+(?:bad|poor|terrible|weak)\s+at\s+spell/i, reply: () => "Good news: spelling is a <b>pattern</b> skill, not a talent. English has ~44 sounds and a limited set of ways to spell each one. Learn the patterns in <b>Lessons</b>, then drill them in <b>Practice</b>. You'll be amazed how fast it clicks." },
    { re: /\b(why is|why's)\b.{0,30}(crazy|weird|hard|difficult|confus)/i, reply: () => "Because English <b>spells sounds, not letters</b> — and history left layers: Anglo-Saxon + French + Latin + Greek all stacked together. The trick is to stop reading letter-by-letter and start reading <b>sound-by-sound</b>. Check the lesson <i>Why English spelling looks crazy</i>." },
    { re: /\b(ipa|phonetic|phonetics)\b/i, reply: () => "IPA is a one-symbol-per-sound alphabet — once you know ~20 symbols you can pronounce any new word. Dictionaries write it after words: <b>see /siː/</b>. Start with the lesson <i>IPA survival kit</i>." },
    { re: /\b(silent)\s+(letter|letters|e|u|k|w|b|h)\b/i, reply: () => "Silent letters are fossils — people used to pronounce them. The biggest one for you is the <b>silent u</b> in <i>build, guess, guard, guitar</i>. See the lesson <i>The silent u</i> — it's a classic exam trap." },
    { re: /\b(mnemonic|memory trick|remember)\b/i, reply: () => "Mnemonics turn spelling into a silly picture your brain can't forget: <b>because</b> → <b>B</b>ig <b>E</b>lephants <b>C</b>an <b>A</b>lways <b>U</b>nderstand <b>S</b>mall <b>E</b>lephants. Find more in <i>Tricky Words & Mnemonics</i>." },
    { re: /\b(doubl|double)\b/i, reply: () => "Doubling protects a <b>short</b> vowel. Rule of thumb: <b>1 syllable + 1 short vowel + 1 final consonant → double</b>: hop→hopped, run→running. Words with a magic e don't double: hope→hoped. See <i>The 1-1-1 doubling rule</i>." },
    { re: /\b(i before e|ie|ei)\b/i, reply: () => "<b>i before e, except after c</b> — when the pair says /iː/: <b>believe</b>, but <b>receive</b>. And when it says /eɪ/ it's <b>ei</b>: <b>weight</b>, <b>eight</b>, <b>neighbour</b>. Full story in the lesson <i>i before e</i>." },
    { re: /\b(tion|sion|cian)\b/i, reply: () => "All three sound like /ʃən/. Default is <b>-tion</b> (nation). Use <b>-sion</b> after a stem ending in a vowel or s (decide→decision), and <b>-cian</b> for a person with a skill (music→musician). Lesson: <i>-tion / -sion / -cian</i>." },
    { re: /\b(magic e|silent e at the end)\b/i, reply: () => "The <b>magic e</b> is silent itself, but it lengthens the vowel before it: <b>cap→cape</b>, <b>kit→kite</b>, <b>hop→hope</b>. It's the single biggest power move in English spelling — see the lesson <i>The Magic E</i>." },
    { re: /\b(homophone|their|they're|there|its|it's|to|too|two)\b/i, reply: () => "Homophones sound identical — you can't spell them by ear, only by <b>meaning</b>. Quick test: can you replace it with <b>they are</b>? → <b>they're</b>. Does it mean 'belonging to them'? → <b>their</b>. Otherwise → <b>there</b>." },
    { re: /\blevel|streak|xp|progress\b/i, reply: () => () => { const st = S.store.stats(); return `You're <b>${S.store.levelInfo(S.store.state.xp).icon} ${S.store.levelInfo(S.store.state.xp).name}</b> with <b>${S.store.state.xp} XP</b>, a <b>${st.streak}-day streak</b>, <b>${st.mastered} mastered words</b> and <b>${st.accuracy}%</b> accuracy. Keep it up!`; } },
    { re: /\b(thank|thanks|thx|ty)\b/i, reply: () => "Anytime. Remember: little and often beats long and rare — a few minutes a day builds the streak that builds the skill." },
    { re: /\b(help|stuck|lost|don't know|dont know)\b/i, reply: () => "I've got you. The fastest path: (1) read one short <b>Lesson</b>, (2) run a <b>Dictation</b> drill on it, (3) check the <b>Sound Map</b> whenever a spelling confuses you. What word is bugging you right now?" },
  ];

  function soundMapAnswer(sym) {
    const s = (sym || "").toLowerCase();
    const hit = S.SOUND_MAP.find((x) => x.sym.toLowerCase() === s || x.key.toLowerCase() === s);
    if (!hit) return `I don't know the symbol <b>/${s}/</b>. Try one from the <b>Sound Map</b> — e.g. <i>/iː/, /eɪ/, /aɪ/, /uː/, /əʊ/, /aʊ/, /ɔɪ/, /ɜː/, /ʃ/</i>.`;
    const lines = hit.spellings.map((sp) => `<li><b>${sp.s}</b> — ${sp.note}: ${sp.words.slice(0, 4).join(", ")}</li>`);
    return `The <b>/${hit.sym}/</b> sound (as in <b>${hit.key}</b>) can be spelled these ways:<ul>${lines.join("")}</ul>`;
  }

  function lessonFor(word) {
    for (const mod of S.MODULES) {
      for (const l of mod.lessons) {
        if (l.examples.some((e) => e.w.toLowerCase() === word.toLowerCase())) return l;
      }
    }
    return null;
  }

  // Word-level offline analysis: why is it spelled that way?
  function explainWord(word) {
    const w = (word || "").trim().toLowerCase();
    if (!w) return "Give me a word and I'll break it down.";
    const lesson = lessonFor(w);
    const sm = S.SOUND_MAP.find((x) => x.spellings.some((sp) => sp.words.includes(w)));
    const parts = [];
    if (lesson) {
      parts.push(`This word appears in the lesson <b>${lesson.icon} ${lesson.title}</b>. Rule: ${lesson.rule.replace(/<[^>]+>/g, "")}`);
    }
    if (sm) {
      const spelling = sm.spellings.find((sp) => sp.words.includes(w));
      parts.push(`It contains the <b>/${sm.sym}/</b> sound (as in <i>${sm.key}</i>), spelled here with <b>${spelling.s}</b> — ${spelling.note}.`);
    }
    const data = S.allWords().find((e) => e.w.toLowerCase() === w);
    if (data) {
      parts.push(`Pronunciation: <b>${data.ipa}</b> · “${data.sent}”`);
    }
    if (!parts.length) {
      parts.push(`I don't have a pattern entry for <b>${w}</b> yet — but you can hear it and read its IPA in the Sound Map. ${S.speech ? "Tap any word there to play it." : ""}`);
    }
    return parts.join("<br><br>");
  }

  /* ---------------- Rule-based answer ---------------- */
  function offlineAnswer(text) {
    const t = text.trim();
    const spellMatch = t.match(/(?:how (?:do|should) i|how is|spell|spelling of|write)\s+(?:the\s+word\s+)?['"]?([a-z]+)['"]?/i);
    if (spellMatch && !/\b(sound|phoneme)\b/i.test(t)) {
      return explainWord(spellMatch[1]);
    }
    for (const r of RULES) {
      const m = t.match(r.re);
      if (m) {
        const out = r.reply(m);
        return typeof out === "function" ? out() : out;
      }
    }
    if (/^[a-z]+$/i.test(t) && t.length > 2) return explainWord(t);
    return "I'm Lex — ask me things like <i>“how do I spell necessary?”</i>, <i>“how do I spell /iː/?”</i>, <i>“explain the magic e”</i>, or <i>“quiz me”</i>. If you want deeper answers, add an LLM key in <b>Settings</b> and I'll power up.";
  }

  /* ---------------- Optional LLM ---------------- */
  async function llmAnswer(text) {
    const st = S.store.state.settings;
    if (!st.useLLM || !st.llmKey) throw new Error("LLM disabled");
    const sys =
      "You are Lex, an expert English orthography tutor inside the Spellwise app. " +
      "Explain spelling with patterns, phonetics (IPA), and memory tricks. Be warm, concise (under 120 words), " +
      "and always teach the *why* (etymology, rules). Use simple HTML tags only: <b>, <i>, <ul><li>. " +
      "If the user asks a spelling, give the correct spelling first, then the reason.";
    if (st.llmProvider === "openai") {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + st.llmKey },
        body: JSON.stringify({
          model: st.llmModel || "gpt-4o-mini",
          messages: [{ role: "system", content: sys }, { role: "user", content: text }],
          max_tokens: 350,
          temperature: 0.6,
        }),
      });
      if (!res.ok) throw new Error("OpenAI error " + res.status);
      const j = await res.json();
      return j.choices[0].message.content;
    }
    // Google Gemini
    const model = st.llmModel || "gemini-1.5-flash";
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(st.llmKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: sys }] },
          contents: [{ parts: [{ text }] }],
          generationConfig: { maxOutputTokens: 400, temperature: 0.6 },
        }),
      }
    );
    if (!res.ok) throw new Error("Gemini error " + res.status);
    const j = await res.json();
    const out = j.candidates && j.candidates[0] && j.candidates[0].content;
    return out && out.parts && out.parts[0] ? out.parts[0].text : "<i>No reply.</i>";
  }

  async function answer(text) {
    const st = S.store.state.settings;
    if (st.useLLM && st.llmKey) {
      try {
        return { html: await llmAnswer(text), llm: true };
      } catch (e) {
        return { html: offlineAnswer(text) + "<br><span class=\"bot-fallback\">⚠️ LLM unavailable (" + e.message + ") — using the built-in brain.</span>", llm: false };
      }
    }
    return { html: offlineAnswer(text), llm: false };
  }

  S.bot = { answer, explainWord, offlineAnswer };
})();

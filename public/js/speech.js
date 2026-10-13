/* ============================================================
   SPELLWISE · speech.js
   Speech engine: SpeechSynthesis (TTS) + SpeechRecognition (ASR)
   + Free Dictionary API client (real human audio + IPA fallback).
   ============================================================ */
(function () {
  "use strict";
  window.SW = window.SW || {};
  const S = window.SW;

  const synth = window.speechSynthesis;
  const recSupported =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  let voices = [];
  let chosenVoice = null;

  function refreshVoices() {
    if (!synth) return;
    voices = synth.getVoices();
    const pref = S.store.state.settings.voiceURI;
    if (pref) {
      const hit = voices.find((v) => v.voiceURI === pref);
      if (hit) chosenVoice = hit;
    }
    if (!chosenVoice) {
      // Prefer a high-quality en-GB / en-US female voice
      chosenVoice =
        voices.find((v) => /en-GB/i.test(v.lang) && /female|samantha|zira|libby/i.test(v.name)) ||
        voices.find((v) => /en-GB/i.test(v.lang)) ||
        voices.find((v) => /en-US/i.test(v.lang)) ||
        voices.find((v) => /^en/i.test(v.lang)) ||
        voices[0] ||
        null;
    }
  }
  if (synth) {
    refreshVoices();
    synth.onvoiceschanged = refreshVoices;
  }

  /* ---------------- TTS ---------------- */
  // Chrome's speechSynthesis is buggy: it silently stops after ~15s and
  // voices load asynchronously. Both are handled here.
  function say(text, opts) {
    opts = opts || {};
    text = String(text || "");
    return new Promise((resolve) => {
      if (S.muted === true) { resolve(false); return; }
      if (!synth) { resolve(false); return; }
      // Voices load late on Chrome/Android — refresh on every call so the
      // first taps after page load are not silent.
      if (!chosenVoice) refreshVoices();
      try {
        synth.cancel();
        const u = new SpeechSynthesisUtterance(text);
        if (chosenVoice) {
          u.voice = chosenVoice;
          u.lang = chosenVoice.lang || "en-GB";
        } else {
          u.lang = "en-GB";
        }
        u.rate = opts.rate != null ? opts.rate : S.store.state.settings.voiceRate;
        u.pitch = opts.pitch != null ? opts.pitch : S.store.state.settings.voicePitch;
        let settled = false;
        const done = (v) => { if (!settled) { settled = true; clearInterval(kick); resolve(v); } };
        // Chrome bug: long utterances freeze. Prodding resume() keeps them alive.
        const kick = setInterval(() => { try { synth.pause(); synth.resume(); } catch (e) {} }, 12000);
        u.onend = () => done(true);
        u.onerror = () => done(false);
        synth.speak(u);
        // Safety net: if onend/onerror never fire, resolve anyway.
        setTimeout(() => done(true), Math.max(2500, text.length * 110));
      } catch (e) {
        resolve(false);
      }
    });
  }

  function listVoices() {
    refreshVoices();
    return voices.filter((v) => /^en/i.test(v.lang));
  }

  function setVoice(uri) {
    S.store.state.settings.voiceURI = uri;
    S.store.save();
    chosenVoice = voices.find((v) => v.voiceURI === uri) || chosenVoice;
  }

  /* ---------------- Slow / fast replay ---------------- */
  function saySlow(text) {
    const r = S.store.state.settings.voiceRate;
    return say(text, { rate: Math.max(0.5, r - 0.25) });
  }

  /* ---------------- ASR (microphone) ---------------- */
  let listening = false;
  function listen(opts) {
    opts = opts || {};
    return new Promise((resolve, reject) => {
      if (!recSupported) {
        reject(new Error("Speech recognition is not supported in this browser. Use the text input instead."));
        return;
      }
      const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
      const r = new Rec();
      r.lang = opts.lang || "en-GB";
      r.interimResults = false;
      r.maxAlternatives = 3;
      let settled = false;
      const done = (fn) => {
        if (!settled) {
          settled = true;
          listening = false;
          fn();
        }
      };
      r.onresult = (e) => {
        const best = e.results[0];
        const alt = [];
        for (let i = 0; i < best.length; i++) alt.push(best[i].transcript.trim());
        done(() => resolve({ transcript: alt[0], alternatives: alt }));
      };
      r.onerror = (e) =>
        done(() => reject(new Error(e.error === "not-allowed"
          ? "Microphone access was blocked. Please allow it in your browser settings."
          : "Could not hear you clearly. Try again or type the word.")));
      r.onend = () => done(() => resolve({ transcript: "", alternatives: [] }));
      // Safety net: some browsers start the recognizer but never fire
      // onend/onerror (permission prompt dismissed, no mic). Resolve so the
      // drill never freezes waiting for a sound that never comes.
      const watchdog = setTimeout(
        () => done(() => resolve({ transcript: "", alternatives: [] })),
        opts.timeout || 9000
      );
      const origDone = done;
      done = (fn) => { clearTimeout(watchdog); origDone(fn); };
      try {
        listening = true;
        r.start();
      } catch (e) {
        done(() => reject(e));
      }
    });
  }
  function isListening() {
    return listening;
  }

  /* ---------------- Free Dictionary API ----------------
     GET https://api.dictionaryapi.dev/api/v2/entries/en/<word>
     → real recordings + IPA + definition. Cached in memory. */
  const dictCache = {};
  async function lookup(word) {
    const w = (word || "").trim().toLowerCase();
    if (!w) return null;
    if (dictCache[w] !== undefined) return dictCache[w];
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 4000);
      const res = await fetch(
        "https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(w),
        { signal: ctrl.signal }
      );
      clearTimeout(timer);
      if (!res.ok) throw new Error("not found");
      const json = await res.json();
      const entry = Array.isArray(json) ? json[0] : null;
      if (!entry) throw new Error("empty");
      const phonetic =
        (entry.phonetics || []).find((p) => p.text) || null;
      const audioObj = (entry.phonetics || []).find((p) => p.audio) || null;
      const meaning = entry.meanings && entry.meanings[0];
      const out = {
        word: entry.word || w,
        ipa: phonetic ? phonetic.text : null,
        audio: audioObj && audioObj.audio ? audioObj.audio : null,
        definition:
          meaning && meaning.definitions && meaning.definitions[0]
            ? meaning.definitions[0].definition
            : null,
        partOfSpeech: meaning ? meaning.partOfSpeech : null,
      };
      dictCache[w] = out;
      return out;
    } catch (e) {
      dictCache[w] = null;
      return null;
    }
  }

  // Play a real human recording if we have one, else TTS.
  // The dictionary API can be slow or unreachable in some regions; when it
  // is, we must not make the user stare at a silent screen for 4s.
  let dictBroken = false;
  async function sayHuman(word, opts) {
    if (S.muted === true) return { human: false, info: null };
    let info = null;
    if (!dictBroken) {
      try {
        info = await Promise.race([
          lookup(word),
          new Promise((r) => setTimeout(() => r("TIMEOUT"), 1200)),
        ]);
      } catch (e) { info = null; }
      if (info === "TIMEOUT") {
        // Network is too slow — go straight to TTS now, and skip the
        // dictionary entirely for the next little while.
        dictBroken = true;
        setTimeout(() => { dictBroken = false; }, 60000);
        info = null;
      }
    }
    if (info && info.audio) {
      // Stop any pending TTS so the two never talk over each other.
      try { if (synth) synth.cancel(); } catch (e) {}
      let played = false;
      for (let attempt = 0; attempt < 2 && !played; attempt++) {
        try {
          const audio = new Audio(info.audio);
          audio.preload = "auto";
          audio.crossOrigin = "anonymous";
          // Mobile browsers reject play() unless it follows a user gesture;
          // the error is recoverable, so retry once after a short wait.
          await audio.play();
          // Network can stall mid-stream and fire neither onended nor
          // onerror — bail to TTS instead of hanging the drill forever.
          played = await new Promise((res) => {
            const stall = setTimeout(
              () => { try { audio.pause(); } catch (e) {} res(false); },
              6000
            );
            audio.onended = () => { clearTimeout(stall); res(true); };
            audio.onerror = () => { clearTimeout(stall); res(false); };
          });
        } catch (e) {
          if (attempt === 1) break;
          await new Promise((r) => setTimeout(r, 250));
        }
      }
      if (played) return { human: true, info };
      /* fell through → TTS below */
    }
    await say(word, opts);
    return { human: false, info };
  }

  /* ---------------- Public API ---------------- */
  S.speech = {
    say,
    saySlow,
    sayHuman,
    listen,
    isListening,
    lookup,
    listVoices,
    setVoice,
    get voice() {
      return chosenVoice;
    },
  };
})();

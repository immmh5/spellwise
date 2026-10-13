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
  function say(text, opts) {
    opts = opts || {};
    return new Promise((resolve) => {
      if (S.muted === true) { resolve(false); return; }
      if (!synth || !chosenVoice) {
        // No speech synthesis available → fall back to dictionary audio if we can
        resolve(false);
        return;
      }
      try {
        synth.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.voice = chosenVoice;
        u.lang = chosenVoice.lang || "en-GB";
        u.rate = opts.rate != null ? opts.rate : S.store.state.settings.voiceRate;
        u.pitch = opts.pitch != null ? opts.pitch : S.store.state.settings.voicePitch;
        u.onend = () => resolve(true);
        u.onerror = () => resolve(false);
        synth.speak(u);
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
  async function sayHuman(word, opts) {
    if (S.muted === true) return { human: false, info: null };
    const info = await lookup(word);
    if (info && info.audio) {
      try {
        const audio = new Audio(info.audio);
        await audio.play();
        return { human: true, info };
      } catch (e) {
        /* fall through to TTS */
      }
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

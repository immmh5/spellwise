/* ============================================================
   SPELLWISE · data.js
   The knowledge base: course modules, word bank (with IPA),
   the sound→spelling map, achievements, levels, writing prompts.
   ============================================================ */
(function () {
  "use strict";
  window.SW = window.SW || {};
  const S = window.SW;

  /* ==========================================================
     COURSE — modules → lessons
     Each lesson:
       id, title, icon, rule (one-line), why (HTML explanation),
       examples [{w, ipa, sent, lvl}], watch [tips], quiz [{q, options, answer, explain}]
     lvl = difficulty for drills (1 easy … 3 hard)
     ========================================================== */
  S.MODULES = [
    {
      id: "fundamentals",
      title: "Sound–Spelling Basics",
      icon: "🎛️",
      blurb: "How English spelling really works — and the 20 sounds you must recognise by ear.",
      lessons: [
        {
          id: "why-english",
          title: "Why English spelling looks crazy",
          icon: "🤯",
          rule: "English spells sounds, not letters — one sound can wear many costumes.",
          why:
            "<p>English has about <b>44 sounds</b> but only <b>26 letters</b>. So letters must double up. The letter <b>a</b> alone can be <b>/æ/</b> in <i>cat</i>, <b>/eɪ/</b> in <i>cake</i>, <b>/ɑː/</b> in <i>car</i>, <b>/ɔː/</b> in <i>ball</i>, or silent in <i>bread</i>.</p>" +
            "<p>The secret: <b>stop memorising letter-by-letter and start memorising <u>sounds</u> and the patterns that make them.</b> When you hear a word, your brain should ask <i>“which pattern makes that sound here?”</i> — not “how is this spelled?”.</p>",
          examples: [
            { w: "cat", ipa: "/kæt/", sent: "The cat is on the mat.", lvl: 1 },
            { w: "cake", ipa: "/keɪk/", sent: "I baked a cake.", lvl: 1 },
            { w: "car", ipa: "/kɑː/", sent: "He drives a red car.", lvl: 1 },
            { w: "ball", ipa: "/bɔːl/", sent: "Throw the ball to me.", lvl: 1 },
            { w: "bread", ipa: "/bred/", sent: "We buy fresh bread.", lvl: 2 },
          ],
          watch: [
            "Same letter, different job: the vowel letters <b>a e i o u</b> each make 3–5 different sounds.",
            "Two jobs for one sound: /f/ can be <b>f</b> (fish), <b>ph</b> (phone) or <b>gh</b> (laugh).",
            "Silent letters are leftover fossils from old pronunciation (knight, listen, build).",
          ],
          quiz: [
            {
              q: "About how many sounds does English have?",
              options: ["26", "44", "100", "10"],
              answer: 1,
              explain: "Roughly 44 sounds — which is why 26 letters need to team up.",
            },
            {
              q: "Which word has a different <b>a</b> sound from the others?",
              options: ["cat", "hat", "cake", "map"],
              answer: 2,
              explain: "cake has /eɪ/ (a long a); the others have /æ/ (a short a).",
            },
          ],
        },
        {
          id: "ipa-survival",
          title: "IPA survival kit (read any pronunciation)",
          icon: "🔤",
          rule: "These 20 symbols tell you exactly how a word sounds — learn them once, use them forever.",
          why:
            "<p>The <b>International Phonetic Alphabet (IPA)</b> is a one-symbol-per-sound system. Dictionaries write it after words, and every dictionary agrees on it. Learn the key symbols below and you can pronounce <i>any</i> new word you meet.</p>" +
            "<p>The colon <b>ː</b> means <b>long</b>: /iː/ is a long <i>ee</i> (see), /i/ without it is short (sit). Two symbols = a <b>diphthong</b> (two sounds gliding): /eɪ/ = <i>e</i>+<i>i</i> (day).</p>",
          examples: [
            { w: "see", ipa: "/siː/", sent: "I can see the moon.", lvl: 1 },
            { w: "sit", ipa: "/sɪt/", sent: "Please sit down here.", lvl: 1 },
            { w: "bed", ipa: "/bed/", sent: "Time to go to bed.", lvl: 1 },
            { w: "hot", ipa: "/hɒt/", sent: "It is very hot today.", lvl: 1 },
            { w: "blue", ipa: "/bluː/", sent: "The sky is blue.", lvl: 2 },
            { w: "day", ipa: "/deɪ/", sent: "Have a nice day.", lvl: 1 },
            { w: "my", ipa: "/maɪ/", sent: "This is my book.", lvl: 1 },
            { w: "now", ipa: "/naʊ/", sent: "Come here right now.", lvl: 2 },
            { w: "go", ipa: "/ɡəʊ/", sent: "Let us go home.", lvl: 1 },
            { w: "bird", ipa: "/bɜːd/", sent: "A bird is singing.", lvl: 2 },
          ],
          watch: [
            "<b>/ə/</b> (schwa) is the lazy vowel in unstressed syllables — <i>about</i> = /əˈbaʊt/. It is the most common vowel sound in English!",
            "<b>/θ/</b> think and <b>/ð/</b> this need the tongue between the teeth.",
            "Stress mark <b>ˈ</b> shows which syllable is loud: /əˈbaʊt/ — the second part is stressed.",
          ],
          quiz: [
            {
              q: "In /siː/ (see), what does the colon ː mean?",
              options: ["Stress", "Long sound", "Silent", "Repeat"],
              answer: 1,
              explain: "ː lengthens the vowel: /iː/ is a long ee.",
            },
            {
              q: "Which is the schwa — the lazy, unstressed vowel?",
              options: ["/iː/", "/ə/", "/eɪ/", "/θ/"],
              answer: 1,
              explain: "/ə/ is the schwa, the most common vowel in English.",
            },
          ],
        },
      ],
    },

    {
      id: "vowel-teams",
      title: "Vowel Teams",
      icon: "👥",
      blurb: "Two vowels go walking — learn who talks, who is silent, and which ones break the rule.",
      lessons: [
        {
          id: "ee",
          title: "ee — the long E",
          icon: "🍬",
          rule: "“When two vowels go walking, the first one does the talking” — ee says /iː/.",
          why:
            "<p><b>ee</b> <i>always</i> spells the long <b>/iː/</b> sound. It appears in the <b>middle</b> (green) and at the <b>end</b> (tree). There are virtually no exceptions — if you hear a clear long <i>ee</i>, <b>ee</b> is a very safe guess in the middle of a word.</p>" +
            "<p>It is a <b>reliable</b> pattern: only <b>ea</b> and a few others compete with it for the same sound.</p>",
          examples: [
            { w: "see", ipa: "/siː/", sent: "I can see the stars.", lvl: 1 },
            { w: "tree", ipa: "/triː/", sent: "The bird is in the tree.", lvl: 1 },
            { w: "green", ipa: "/ɡriːn/", sent: "Leaves are green.", lvl: 1 },
            { w: "meet", ipa: "/miːt/", sent: "Let us meet at six.", lvl: 1 },
            { w: "week", ipa: "/wiːk/", sent: "Have a good week.", lvl: 1 },
            { w: "happy", ipa: "/ˈhæpi/", sent: "I am very happy today.", lvl: 2 },
            { w: "coffee", ipa: "/ˈkɒfi/", sent: "She drinks coffee every morning.", lvl: 2 },
            { w: "between", ipa: "/bɪˈtwiːn/", sent: "Sit between us two.", lvl: 3 },
          ],
          watch: [
            "<b>y</b> at the end of a short word also says /iː/: happy, silly, baby.",
            "Do not write <b>ee</b> at the very start of a word — English never begins a word with ee.",
          ],
          quiz: [
            {
              q: "Which sound does ee make?",
              options: ["/e/", "/iː/", "/aɪ/", "/uː/"],
              answer: 1,
              explain: "ee always spells the long ee /iː/.",
            },
            {
              q: "Choose the correct spelling: tr__ (a big plant).",
              options: ["tra", "tree", "tre", "trie"],
              answer: 1,
              explain: "Long ee inside a word → ee: tree.",
            },
          ],
        },
        {
          id: "ea",
          title: "ea — usually long E, sometimes short",
          icon: "🍃",
          rule: "ea most often says /iː/ (meat), but watch the odd short-/e/ family (head, bread).",
          why:
            "<p><b>ea</b> is the <b>rebel</b> of vowel teams: it usually says long <b>/iː/</b> like <b>ee</b> (meat, read, sea), but in a small, learnable family it says short <b>/e/</b> as in <b>bed</b>:</p>" +
            "<p class=\"chiprow\"><b>head</b> · <b>bread</b> · <b>break</b> · <b>sweater</b> · <b>weather</b> · <b>health</b> · <b>heaven</b> · <b>thread</b> · <b>instead</b></p>" +
            "<p>Mnemonic: <b>“Break your thread, instead of your bread, in bad weather.”</b> — all short /e/.</p>",
          examples: [
            { w: "meat", ipa: "/miːt/", sent: "This meat is delicious.", lvl: 1 },
            { w: "read", ipa: "/riːd/", sent: "I read every evening.", lvl: 1 },
            { w: "sea", ipa: "/siː/", sent: "The sea is calm today.", lvl: 1 },
            { w: "team", ipa: "/tiːm/", sent: "Our team won the game.", lvl: 1 },
            { w: "easy", ipa: "/ˈiːzi/", sent: "This test is easy.", lvl: 1 },
            { w: "head", ipa: "/hed/", sent: "My head hurts a little.", lvl: 2 },
            { w: "bread", ipa: "/bred/", sent: "She bought fresh bread.", lvl: 2 },
            { w: "break", ipa: "/breɪk/", sent: "Take a short break.", lvl: 2 },
            { w: "weather", ipa: "/ˈweðə/", sent: "The weather is nice.", lvl: 3 },
          ],
          watch: [
            "<b>read</b> has the same spelling for present /riːd/ and past /red/ — context tells you which.",
            "When you hear /iː/ in the <b>middle</b>, both <b>ee</b> and <b>ea</b> are possible — that is why dictation practice matters!",
          ],
          quiz: [
            {
              q: "Which word has the SHORT /e/ sound for ea?",
              options: ["beach", "seat", "bread", "dream"],
              answer: 2,
              explain: "bread rhymes with bed — the rebel short-e family.",
            },
            {
              q: "Choose correctly: I like to r__d books.",
              options: ["reed", "read", "raed", "red"],
              answer: 1,
              explain: "read is spelled with ea; reed is a water plant!",
            },
          ],
        },
        {
          id: "ai-ay",
          title: "ai / ay — long A",
          icon: "🌧️",
          rule: "ai in the middle (rain), ay at the end (play). Both say /eɪ/.",
          why:
            "<p>The long <b>/eɪ/</b> sound has a neat split:</p>" +
            "<ul><li><b>ai</b> — only in the <b>middle</b> of words: rain, wait, pain, train. English <b>never</b> ends a word with ai.</li>" +
            "<li><b>ay</b> — only at the <b>end</b> (or in day-like words): play, day, say, away.</li></ul>" +
            "<p>So if the /eɪ/ sound is the <b>last</b> sound of the word, write <b>ay</b>. If something follows it, write <b>ai</b>.</p>",
          examples: [
            { w: "rain", ipa: "/reɪn/", sent: "It is raining hard.", lvl: 1 },
            { w: "wait", ipa: "/weɪt/", sent: "Please wait for me.", lvl: 1 },
            { w: "pain", ipa: "/peɪn/", sent: "I have a pain in my arm.", lvl: 1 },
            { w: "train", ipa: "/treɪn/", sent: "The train is late.", lvl: 1 },
            { w: "play", ipa: "/pleɪ/", sent: "The children play outside.", lvl: 1 },
            { w: "day", ipa: "/deɪ/", sent: "Today is a good day.", lvl: 1 },
            { w: "say", ipa: "/seɪ/", sent: "What did you say?", lvl: 1 },
            { w: "away", ipa: "/əˈweɪ/", sent: "Please go away now.", lvl: 2 },
            { w: "explain", ipa: "/ɪkˈspleɪn/", sent: "Can you explain this?", lvl: 3 },
          ],
          watch: [
            "Exception to memorise: <b>said</b> /sed/ — it is spelled ai but sounds short! (And <b>again</b> /əˈɡen/.)",
            "<b>eight /eɪt/</b> and <b>weight</b> use <b>ei</b> for the same sound (see the i-before-e lesson).",
          ],
          quiz: [
            {
              q: "The /eɪ/ sound comes at the END of the word. Which spelling?",
              options: ["ai", "ay", "ae", "a"],
              answer: 1,
              explain: "End of word → ay (day, play, say).",
            },
            {
              q: "Choose correctly: r__n (water from clouds).",
              options: ["rayn", "ran", "rain", "rayn"],
              answer: 2,
              explain: "Middle of word → ai: rain.",
            },
          ],
        },
        {
          id: "oa-oo",
          title: "oa / oo — the O teams",
          icon: "🛶",
          rule: "oa = long O /əʊ/ in the middle (boat); oo = long /uː/ (moon) or short /ʊ/ (book).",
          why:
            "<p><b>oa</b> spells the long <b>/əʊ/</b> (boat, road, coast) and — like ai — never appears at the very end of a word. If /əʊ/ ends a word, it is spelled <b>ow</b> (low, snow).</p>" +
            "<p><b>oo</b> has two jobs, and you must train your ear:</p>" +
            "<ul><li>Long <b>/uː/</b> — moon, food, soon, cool.</li>" +
            "<li>Short <b>/ʊ/</b> — book, good, look, foot, wood.</li></ul>" +
            "<p>Trick: most <b>oo</b> after the letter <b>l</b> or in food-words is long (pool, cool, food); words about <b>looking/feet/books</b> are usually short.</p>",
          examples: [
            { w: "boat", ipa: "/bəʊt/", sent: "The boat is on the river.", lvl: 1 },
            { w: "road", ipa: "/rəʊd/", sent: "Cross the road carefully.", lvl: 1 },
            { w: "coat", ipa: "/kəʊt/", sent: "Put on your warm coat.", lvl: 1 },
            { w: "moon", ipa: "/muːn/", sent: "The moon is full tonight.", lvl: 1 },
            { w: "food", ipa: "/fuːd/", sent: "The food was great.", lvl: 1 },
            { w: "school", ipa: "/skuːl/", sent: "We walk to school.", lvl: 1 },
            { w: "book", ipa: "/bʊk/", sent: "This book is interesting.", lvl: 2 },
            { w: "good", ipa: "/ɡʊd/", sent: "You did a good job.", lvl: 2 },
            { w: "foot", ipa: "/fʊt/", sent: "My foot is a bit sore.", lvl: 2 },
          ],
          watch: [
            "<b>door /dɔː/</b> and <b>floor /flɔː/</b> are a third sound — neither /uː/ nor /ʊ/.",
            "Mnemonic for short oo: <b>“Look at the good book on the wood floor.”</b>",
          ],
          quiz: [
            {
              q: "Which word has the SHORT oo /ʊ/?",
              options: ["moon", "food", "book", "cool"],
              answer: 2,
              explain: "book rhymes with look — short /ʊ/.",
            },
            {
              q: "Choose correctly: b__t (it floats on water).",
              options: ["boat", "bowt", "bote", "boot"],
              answer: 0,
              explain: "Long o in the middle → oa: boat. (boot has oo = /uː/!)",
            },
          ],
        },
        {
          id: "ie-ue",
          title: "ie / ue — and the silent-ue trick",
          icon: "🥧",
          rule: "ie = /iː/ mid-word (piece), /aɪ/ at the end (pie); ue = /uː/ or silent after g/q.",
          why:
            "<p><b>ie</b> wears two hats depending on position:</p>" +
            "<ul><li><b>Middle</b> of a word → long <b>/iː/</b>: piece, thief, believe, friend.</li>" +
            "<li><b>End</b> of a short word → <b>/aɪ/</b>: pie, die, lie, tie.</li></ul>" +
            "<p><b>ue</b> also has two jobs:</p>" +
            "<ul><li><b>/uː/</b> at the end of words: blue, true, glue, clue, rescue.</li>" +
            "<li><b>Totally silent</b> after <b>g</b> or <b>q</b> at the end: tongue /tʌŋ/, mosque /mɒsk/, league /liːɡ/, cheque /tʃek/. It is there to tell you the g/q is hard.</li></ul>",
          examples: [
            { w: "piece", ipa: "/piːs/", sent: "Have a piece of cake.", lvl: 2 },
            { w: "thief", ipa: "/θiːf/", sent: "The thief ran away.", lvl: 2 },
            { w: "friend", ipa: "/frend/", sent: "She is my best friend.", lvl: 1 },
            { w: "believe", ipa: "/bɪˈliːv/", sent: "I believe you.", lvl: 2 },
            { w: "pie", ipa: "/paɪ/", sent: "Would you like some pie?", lvl: 1 },
            { w: "tie", ipa: "/taɪ/", sent: "He wears a tie to work.", lvl: 1 },
            { w: "blue", ipa: "/bluː/", sent: "Her eyes are blue.", lvl: 1 },
            { w: "true", ipa: "/truː/", sent: "Is this story true?", lvl: 1 },
            { w: "tongue", ipa: "/tʌŋ/", sent: "Stick out your tongue.", lvl: 3 },
            { w: "mosque", ipa: "/mɒsk/", sent: "They built a new mosque.", lvl: 3 },
          ],
          watch: [
            "Because <b>u</b> is silent after g/q, <i>guess /ɡes/</i>, <i>guitar /ɡɪˈtɑː/</i>, <i>guard /ɡɑːd/</i> and <i>build /bɪld/</i> all hide a silent u — exactly the mistake most learners make.",
            "<b>friend</b> = an <b>end</b> you can <b>fr</b>ee — that is why it is fri-END, not frend.",
          ],
          quiz: [
            {
              q: "The word ends in the /aɪ/ sound. Which spelling?",
              options: ["ei", "ie", "ai", "ea"],
              answer: 1,
              explain: "End of a short word → ie: pie, die, lie, tie.",
            },
            {
              q: "Which word has a completely SILENT ue?",
              options: ["blue", "true", "tongue", "clue"],
              answer: 2,
              explain: "tongue /tʌŋ/ — ue is silent after g.",
            },
          ],
        },
        {
          id: "ou-ow",
          title: "ou / ow — the owls",
          icon: "🦉",
          rule: "ou & ow both say /aʊ/ (out / now); ow also says /əʊ/ (low). ou never ends a word.",
          why:
            "<p>The /aʊ/ sound (like a baby crying “ow!”) has two main spellings:</p>" +
            "<ul><li><b>ou</b> — in the <b>middle</b>: out, house, mouse, cloud, round, about.</li>" +
            "<li><b>ow</b> — at the <b>end</b>: now, how, cow, town, brown, flower.</li></ul>" +
            "<p>But <b>ow</b> is double-faced: it can also say <b>/əʊ/</b> at the end — low, snow, grow, show, yellow. Context (and a dictionary) tells you which.</p>",
          examples: [
            { w: "out", ipa: "/aʊt/", sent: "Please come out now.", lvl: 1 },
            { w: "house", ipa: "/haʊs/", sent: "Their house is big.", lvl: 1 },
            { w: "mouse", ipa: "/maʊs/", sent: "A mouse ran past.", lvl: 1 },
            { w: "cloud", ipa: "/klaʊd/", sent: "The sky has one cloud.", lvl: 2 },
            { w: "round", ipa: "/raʊnd/", sent: "The ball is round.", lvl: 2 },
            { w: "now", ipa: "/naʊ/", sent: "Do it right now.", lvl: 1 },
            { w: "town", ipa: "/taʊn/", sent: "I live in a small town.", lvl: 1 },
            { w: "snow", ipa: "/snəʊ/", sent: "It may snow tonight.", lvl: 2 },
            { w: "flower", ipa: "/ˈflaʊə/", sent: "She picked a flower.", lvl: 2 },
          ],
          watch: [
            "<b>four /fɔː/</b>, <b>could /kʊd/</b>, <b>should /ʃʊd/</b> and <b>would /wʊd/</b> are ou-words that do NOT say /aʊ/ — memorise them.",
            "If /aʊ/ is followed by a consonant + end of word, both work in a few cases (clown vs. cloud) — use the Sound Map to check.",
          ],
          quiz: [
            {
              q: "Which spelling for /aʊ/ at the END of a word?",
              options: ["ou", "ow", "oa", "au"],
              answer: 1,
              explain: "End of word → ow: now, cow, how.",
            },
            {
              q: "Which word has ow saying /əʊ/ (long O), not /aʊ/?",
              options: ["town", "brown", "snow", "flower"],
              answer: 2,
              explain: "snow rhymes with low — ow as /əʊ/.",
            },
          ],
        },
        {
          id: "r-controlled",
          title: "ar / er / ir / or / ur — the bossy R",
          icon: "👑",
          rule: "A vowel + r is controlled by the r: ar=/ɑː/, er-ir-ur=/ɜː/, or=/ɔː/.",
          why:
            "<p>When a vowel is followed by <b>r</b>, the r <i>kidnaps</i> the vowel and they make one new sound together:</p>" +
            "<ul><li><b>ar</b> → open <b>/ɑː/</b>: car, star, park, garden, dark. (Say “ah” at the dentist.)</li>" +
            "<li><b>er, ir, ur</b> → the thinking sound <b>/ɜː/</b>: her, sister, bird, girl, turn, nurse. All three spell the <i>same</i> sound — that is the tricky part.</li>" +
            "<li><b>or</b> → round <b>/ɔː/</b>: for, short, sport, morning, corn.</li></ul>" +
            "<p>Because er/ir/ur sound identical, use the Sound Map + dictation to learn which words use which.</p>",
          examples: [
            { w: "car", ipa: "/kɑː/", sent: "He bought a new car.", lvl: 1 },
            { w: "star", ipa: "/stɑː/", sent: "A bright star shone.", lvl: 1 },
            { w: "park", ipa: "/pɑːk/", sent: "We played in the park.", lvl: 1 },
            { w: "her", ipa: "/hɜː/", sent: "Give her the book.", lvl: 1 },
            { w: "sister", ipa: "/ˈsɪstə/", sent: "My sister is older.", lvl: 1 },
            { w: "bird", ipa: "/bɜːd/", sent: "Look at that bird.", lvl: 1 },
            { w: "girl", ipa: "/ɡɜːl/", sent: "That girl is my friend.", lvl: 1 },
            { w: "turn", ipa: "/tɜːn/", sent: "Turn to the left.", lvl: 1 },
            { w: "short", ipa: "/ʃɔːt/", sent: "He has short hair.", lvl: 2 },
            { w: "morning", ipa: "/ˈmɔːnɪŋ/", sent: "Good morning, everyone.", lvl: 2 },
          ],
          watch: [
            "<b>er</b> is the most common way to spell /ɜː/ <i>and</i> the commonest ending for jobs/roles: teacher, driver, farmer.",
            "<b>word /wɜːd/</b> and <b>work /wɜːk/</b> use <b>or</b> but say /ɜː/ — rebels to memorise.",
          ],
          quiz: [
            {
              q: "Which three spellings all make the SAME sound /ɜː/?",
              options: ["ar er or", "er ir ur", "or ur ar", "ir or er"],
              answer: 1,
              explain: "er, ir and ur are all kidnapped by r into /ɜː/.",
            },
            {
              q: "Choose correctly: b__d (an animal that flies).",
              options: ["bard", "bird", "burd", "berd"],
              answer: 1,
              explain: "bird uses ir — the others are not English words.",
            },
          ],
        },
      ],
    },

    {
      id: "magic-e",
      title: "The Magic E",
      icon: "✨",
      blurb: "One silent e at the end changes a short vowel into a long one — the biggest power move in English.",
      lessons: [
        {
          id: "magic-e-rule",
          title: "The Magic E (a-e, i-e, o-e, u-e)",
          icon: "🪄",
          rule: "A silent e at the end makes the vowel before it say its NAME: cap→cape, kit→kite.",
          why:
            "<p>The <b>magic e</b> (also called <b>split digraph</b>) is silent itself, but it reaches back over one consonant and lengthens the vowel:</p>" +
            "<p class=\"chiprow\">c<b>a</b>p → c<b>a</b>p<b>e</b> · k<b>i</b>t → k<b>i</b>t<b>e</b> · h<b>o</b>p → h<b>o</b>p<b>e</b> · c<b>u</b>t → c<b>u</b>t<b>e</b> · m<b>a</b>d → m<b>a</b>d<b>e</b></p>" +
            "<p>Why? Long ago English final vowels were spoken; when they weakened to a sigh, the spelling stayed. Result: <b>the vowel says its alphabet name</b> (a=/eɪ/, i=/aɪ/, o=/əʊ/, u=/juː/).</p>",
          examples: [
            { w: "cap", ipa: "/kæp/", sent: "He wears a cap.", lvl: 1 },
            { w: "cape", ipa: "/keɪp/", sent: "The hero wears a cape.", lvl: 1 },
            { w: "kit", ipa: "/kɪt/", sent: "This is my first-aid kit.", lvl: 1 },
            { w: "kite", ipa: "/kaɪt/", sent: "The boy flies a kite.", lvl: 1 },
            { w: "hop", ipa: "/hɒp/", sent: "Rabbits hop in the grass.", lvl: 1 },
            { w: "hope", ipa: "/həʊp/", sent: "I hope it is sunny.", lvl: 1 },
            { w: "cut", ipa: "/kʌt/", sent: "Be careful, it is sharp.", lvl: 1 },
            { w: "cute", ipa: "/kjuːt/", sent: "What a cute puppy.", lvl: 2 },
            { w: "made", ipa: "/meɪd/", sent: "She made a cake.", lvl: 2 },
            { w: "complete", ipa: "/kəmˈpliːt/", sent: "Please complete the form.", lvl: 3 },
          ],
          watch: [
            "The magic e is <b>silent</b> — you never pronounce it. Its only job is to signal a long vowel.",
            "This is why <b>-e</b> disappears before vowel suffixes: hope → hoping (see the Suffixes module).",
          ],
          quiz: [
            {
              q: "What does a silent e at the end do?",
              options: ["Adds a syllable", "Lengthens the vowel before it", "Nothing", "Doubles the consonant"],
              answer: 1,
              explain: "It makes the previous vowel say its name.",
            },
            {
              q: "Which word has a LONG vowel?",
              options: ["hat", "hate", "hatty", "hatter"],
              answer: 1,
              explain: "hate = hat + magic e → /heɪt/.",
            },
          ],
        },
      ],
    },

    {
      id: "silent-letters",
      title: "Silent Letters",
      icon: "🤫",
      blurb: "The fossils of old English. They are not pronounced — but you must write them.",
      lessons: [
        {
          id: "silent-u",
          title: "The silent u (build, guess, guard)",
          icon: "🧱",
          rule: "A u after g or q is often silent — build /bɪld/, guess /ɡes/, guitar /ɡɪˈtɑː/.",
          why:
            "<p>Long ago people pronounced the u in words like <b>build</b> and <b>guess</b> (they said “byuild”, “gess-oo”). Speech got lazy; the spelling did not change. So today the <b>u is completely silent</b>:</p>" +
            "<p class=\"chiprow\"><b>build</b> /bɪld/ · <b>guess</b> /ɡes/ · <b>guard</b> /ɡɑːd/ · <b>guitar</b> /ɡɪˈtɑː/ · <b>guest</b> /ɡest/ · <b>guide</b> /ɡaɪd/ · <b>league</b> /liːɡ/ · <b>biscuit</b> /ˈbɪskɪt/</p>" +
            "<p>Why keep it? The u tells you the <b>g is hard</b> (/ɡ/, not /dʒ/). Without it, <i>gist</i> and <i>gist</i> would look identical. Silent u is a <b>hard-g marker</b>.</p>",
          examples: [
            { w: "build", ipa: "/bɪld/", sent: "They build houses.", lvl: 1 },
            { w: "guess", ipa: "/ɡes/", sent: "Guess what I found!", lvl: 1 },
            { w: "guard", ipa: "/ɡɑːd/", sent: "The guard stood at the door.", lvl: 2 },
            { w: "guitar", ipa: "/ɡɪˈtɑː/", sent: "She plays the guitar.", lvl: 2 },
            { w: "guest", ipa: "/ɡest/", sent: "We have a guest tonight.", lvl: 2 },
            { w: "guide", ipa: "/ɡaɪd/", sent: "The guide showed us the city.", lvl: 2 },
            { w: "league", ipa: "/liːɡ/", sent: "Our team won the league.", lvl: 3 },
          ],
          watch: [
            "If you hear /ɡ/ + e/i, suspect a silent u: guess, guest, guide, guitar, guilty.",
            "<b>language</b> /ˈlæŋɡwɪdʒ/ keeps both a silent u AND a silent second g.",
          ],
          quiz: [
            {
              q: "Which letter is silent in build?",
              options: ["b", "i", "u", "l"],
              answer: 2,
              explain: "The u is silent — build is pronounced /bɪld/, like “bild”.",
            },
            {
              q: "Choose correctly: gu__ss (estimate without knowing).",
              options: ["gues", "guess", "gess", "guegess"],
              answer: 1,
              explain: "guess = silent u + double s after a short vowel.",
            },
          ],
        },
        {
          id: "silent-others",
          title: "Silent k, w, b, h, g, l, t, d",
          icon: "🗝️",
          rule: "knife /n/, write /r/, lamb /m/, hour /aʊ/, night /naɪt/, listen /lɪsən/, handsome.",
          why:
            "<p>Whole families of words hide letters that English used to pronounce:</p>" +
            "<ul>" +
            "<li><b>Silent k:</b> knife, knee, know, knot, knock, knowledge. (k+n at the start.)</li>" +
            "<li><b>Silent w:</b> write, wrong, wrist, wrap, wreck, answer, two.</li>" +
            "<li><b>Silent b:</b> lamb, climb, thumb, comb, bomb, debt, doubt.</li>" +
            "<li><b>Silent h:</b> hour, honest, honour, rhyme, rhythm, ghost, exhausted.</li>" +
            "<li><b>Silent gh:</b> night, light, thought, through, daughter, weigh.</li>" +
            "<li><b>Silent t:</b> listen, often, castle, whistle, fasten, mortgage.</li>" +
            "<li><b>Silent l:</b> talk, walk, half, calm, palm, salmon, should, could.</li>" +
            "<li><b>Silent d:</b> Wednesday, handsome, sandwich, grandma.</li>" +
            "</ul>",
          examples: [
            { w: "knife", ipa: "/naɪf/", sent: "Pass me the sharp knife.", lvl: 1 },
            { w: "know", ipa: "/nəʊ/", sent: "I know the answer.", lvl: 1 },
            { w: "write", ipa: "/raɪt/", sent: "Please write your name.", lvl: 1 },
            { w: "wrong", ipa: "/rɒŋ/", sent: "That answer is wrong.", lvl: 1 },
            { w: "lamb", ipa: "/læm/", sent: "The lamb is so soft.", lvl: 2 },
            { w: "climb", ipa: "/klaɪm/", sent: "They climb the hill.", lvl: 2 },
            { w: "hour", ipa: "/ˈaʊə/", sent: "Wait one hour, please.", lvl: 1 },
            { w: "night", ipa: "/naɪt/", sent: "Good night, sleep well.", lvl: 1 },
            { w: "listen", ipa: "/ˈlɪsən/", sent: "Listen to the music.", lvl: 2 },
            { w: "Wednesday", ipa: "/ˈwenzdeɪ/", sent: "We meet on Wednesday.", lvl: 3 },
          ],
          watch: [
            "Rule of thumb: <b>k</b> or <b>w</b> directly before <b>n</b> at the start of a word is always silent.",
            "<b>Wednesday</b> is really “Woden's day” — say it “WENZ-day”, and remember the hidden d and e.",
          ],
          quiz: [
            {
              q: "Which word has a silent first letter?",
              options: ["kite", "knee", "keep", "key"],
              answer: 1,
              explain: "knee /niː/ — k is silent before n.",
            },
            {
              q: "How many silent letters are in Wednesday?",
              options: ["0", "1", "2", "3"],
              answer: 2,
              explain: "The first d and the e are silent: /ˈwenzdeɪ/.",
            },
          ],
        },
      ],
    },

    {
      id: "ie-ei",
      title: "i before e",
      icon: "🔀",
      blurb: "The most famous rule in English — and its famous exceptions.",
      lessons: [
        {
          id: "ie-ei-rule",
          title: "i before e, except after c",
          icon: "🧩",
          rule: "For /iː/: i before e (believe) — except after c (receive).",
          why:
            "<p>When the pair says <b>/iː/</b> (long ee), the order is <b>ie</b>:</p>" +
            "<p class=\"chiprow\"><b>believe</b> · <b>achieve</b> · <b>piece</b> · <b>field</b> · <b>friend</b> · <b>thief</b> · <b>relief</b> · <b>niece</b> · <b>chief</b></p>" +
            "<p><b>Except after c</b> — a c pulls the e in front:</p>" +
            "<p class=\"chiprow\"><b>receive</b> · <b>ceiling</b> · <b>perceive</b> · <b>conceive</b> · <b>receipt</b> · <b>deceit</b></p>" +
            "<p>And the full rhyme warns: <i>“…or when sounded as <b>a</b>, like in <b>neighbour</b> and <b>weigh</b>.”</i> For /eɪ/ it is <b>ei</b>: eight, weight, sleigh, vein, rein, beige.</p>",
          examples: [
            { w: "believe", ipa: "/bɪˈliːv/", sent: "I believe in you.", lvl: 2 },
            { w: "achieve", ipa: "/əˈtʃiːv/", sent: "You can achieve your goal.", lvl: 3 },
            { w: "piece", ipa: "/piːs/", sent: "Take one piece of paper.", lvl: 2 },
            { w: "field", ipa: "/fiːld/", sent: "The cows are in the field.", lvl: 2 },
            { w: "receive", ipa: "/rɪˈsiːv/", sent: "Did you receive my email?", lvl: 2 },
            { w: "ceiling", ipa: "/ˈsiːlɪŋ/", sent: "The ceiling is very high.", lvl: 3 },
            { w: "receipt", ipa: "/rɪˈsiːt/", sent: "Keep the receipt, please.", lvl: 3 },
            { w: "eight", ipa: "/eɪt/", sent: "I wake up at eight.", lvl: 1 },
            { w: "weight", ipa: "/weɪt/", sent: "What is your weight?", lvl: 2 },
            { w: "neighbour", ipa: "/ˈneɪbə/", sent: "My neighbour is friendly.", lvl: 2 },
          ],
          watch: [
            "Top rebels to just memorise: <b>weird</b> (not wierd), <b>their</b>, <b>being</b>, <b>seize</b>, <b>leisure</b>, <b>protein</b>.",
            "The rule only applies to the <b>/iː/</b> sound. If the pair says something else (weigh /eɪ/, science /aɪə/), ignore the rule.",
          ],
          quiz: [
            {
              q: "Choose correctly: rec__ve.",
              options: ["receive", "recieve", "receeve", "recieve"],
              answer: 0,
              explain: "After c → e before i: receive.",
            },
            {
              q: "Choose correctly: bel__ve.",
              options: ["beleive", "belieeve", "believe", "beleave"],
              answer: 2,
              explain: "No c → i before e: believe.",
            },
          ],
        },
      ],
    },

    {
      id: "doubling",
      title: "Consonant Doubling",
      icon: "👯",
      blurb: "When to double a consonant before -ed, -ing, -er (hop→hopped vs hope→hoped).",
      lessons: [
        {
          id: "cvc-doubling",
          title: "The 1-1-1 doubling rule",
          icon: "🥁",
          rule: "One syllable, one short vowel, one ending consonant → double it: hop→hopped, run→running.",
          why:
            "<p>English doubles a final consonant to protect a <b>short</b> vowel. Check three boxes:</p>" +
            "<ol><li><b>One</b> syllable (or the stress is on the last syllable)</li>" +
            "<li><b>One</b> vowel — and it is short</li>" +
            "<li><b>One</b> consonant at the end</li></ol>" +
            "<p>If all three are true, double the consonant before a vowel suffix (-ed, -ing, -er, -est):</p>" +
            "<p class=\"chiprow\">h<b>op</b>→h<b>opp</b>ed · r<b>un</b>→r<b>unn</b>ing · b<b>ig</b>→b<b>igg</b>er · st<b>op</b>→st<b>opp</b>ed · fl<b>at</b>→fl<b>att</b>er</p>" +
            "<p>Compare with magic-e words (two vowels, long sound): <b>hope→hoped</b> (no doubling!).</p>",
          examples: [
            { w: "hop", ipa: "/hɒp/", sent: "Frogs hop very well.", lvl: 1 },
            { w: "hopping", ipa: "/ˈhɒpɪŋ/", sent: "She is hopping on one foot.", lvl: 2 },
            { w: "run", ipa: "/rʌn/", sent: "I run every morning.", lvl: 1 },
            { w: "running", ipa: "/ˈrʌnɪŋ/", sent: "He is running fast.", lvl: 2 },
            { w: "big", ipa: "/bɪɡ/", sent: "That is a big dog.", lvl: 1 },
            { w: "bigger", ipa: "/ˈbɪɡə/", sent: "This box is bigger.", lvl: 2 },
            { w: "stop", ipa: "/stɒp/", sent: "Please stop the car.", lvl: 1 },
            { w: "stopped", ipa: "/stɒpt/", sent: "The rain stopped.", lvl: 2 },
          ],
          watch: [
            "Never double after <b>two</b> vowels: feel→feeling, rain→rained.",
            "Never double <b>w, x, y</b>: snow→snowing, fix→fixed, play→played.",
            "Two-syllable words double only if the stress is at the END: be<b>gin</b>→be<b>ginn</b>ing, but <b>visit</b>→<b>visiting</b> (stress on first part).",
          ],
          quiz: [
            {
              q: "hop + -ing → ?",
              options: ["hoping", "hopping", "hoppping", "hopen"],
              answer: 1,
              explain: "One syllable, one short vowel, one consonant → double p: hopping.",
            },
            {
              q: "hope + -ing → ?",
              options: ["hopping", "hopeing", "hoping", "hopeed"],
              answer: 2,
              explain: "hope has a magic e (long vowel) — drop the e, no doubling: hoping.",
            },
          ],
        },
      ],
    },

    {
      id: "suffixes",
      title: "Suffixes & Endings",
      icon: "🧱",
      blurb: "-tion, -sion, -er/-or, -ful, -ness, -ly, and the drop-the-e / change-the-y rules.",
      lessons: [
        {
          id: "tion-sion",
          title: "-tion / -sion / -cian — the /ʃən/ endings",
          icon: "🎚️",
          rule: "The /ʃən/ noun ending is -tion (most), -sion (after a vowel or s), -cian (for people/skills).",
          why:
            "<p>These endings all sound like <b>/ʃən/</b> — identical! Choose by the stem:</p>" +
            "<ul><li><b>-tion</b> is the default: nation, action, station, education, information, attention.</li>" +
            "<li><b>-sion</b> when the stem ends in <b>s</b> or a vowel: <i>decide→decision</i>, <i>televise→television</i>, <i>divide→division</i>, <i>conclude→conclusion</i>.</li>" +
            "<li><b>-cian</b> for a person with a skill: <i>music→musician</i>, <i>magic→magician</i>, <i>electric→electrician</i>, <i>beauty→beautician</i>.</li></ul>" +
            "<p>They all end in <b>-ion</b>, so if you are unsure, -tion is right about 70% of the time.</p>",
          examples: [
            { w: "nation", ipa: "/ˈneɪʃən/", sent: "Our nation is peaceful.", lvl: 2 },
            { w: "action", ipa: "/ˈækʃən/", sent: "We need action now.", lvl: 2 },
            { w: "station", ipa: "/ˈsteɪʃən/", sent: "The station is near here.", lvl: 2 },
            { w: "education", ipa: "/ˌedʒuˈkeɪʃən/", sent: "Education matters a lot.", lvl: 3 },
            { w: "decision", ipa: "/dɪˈsɪʒən/", sent: "It was a hard decision.", lvl: 3 },
            { w: "television", ipa: "/ˈtelɪvɪʒən/", sent: "She watches television.", lvl: 3 },
            { w: "musician", ipa: "/mjuːˈzɪʃən/", sent: "He is a great musician.", lvl: 3 },
          ],
          watch: [
            "Note the tiny pronunciation shift: <b>-tion</b> = /ʃən/, but many <b>-sion</b> words say /ʒən/ (decision, vision, television).",
            "<b>-ssion</b> after s: <i>session</i>, <i>mission</i>, <i>permission</i>.",
          ],
          quiz: [
            {
              q: "decide → the /ʃən/ noun is spelled…",
              options: ["decition", "decision", "decician", "decission"],
              answer: 1,
              explain: "Stem ends in de (vowel sound) → -sion: decision.",
            },
            {
              q: "music → a person is spelled…",
              options: ["musition", "musicion", "musician", "musitian"],
              answer: 2,
              explain: "People/skills take -cian: musician.",
            },
          ],
        },
        {
          id: "drop-e-change-y",
          title: "Drop the e / change the y",
          icon: "🔄",
          rule: "Silent e is dropped before vowel suffixes (make→making); y becomes i before consonant suffixes (happy→happiness).",
          why:
            "<p><b>Drop the e</b> — a magic e falls off whenever a vowel suffix is added (two vowels cannot sit together at the end):</p>" +
            "<p class=\"chiprow\">mak<b>e</b>→mak<b>ing</b> · wri<b>te</b>→wri<b>ten</b> · car<b>e</b>→car<b>ful</b>→car<b>less</b> · lov<b>e</b>→lov<b>able</b> · com<b>e</b>→com<b>ing</b></p>" +
            "<p>But <b>keep the e</b> after <b>c</b> or <b>g</b> to protect their soft sound: <i>notice→noticeable</i>, <i>courage→courageous</i>.</p>" +
            "<p><b>Change y→i</b> — a final <b>y</b> turns into <b>i</b> before a consonant suffix:</p>" +
            "<p class=\"chiprow\">happ<b>y</b>→happ<b>iness</b> · prett<b>y</b>→prett<b>ier</b> · dr<b>y</b>→dr<b>ied</b> · tr<b>y</b>→tr<b>ies</b></p>" +
            "<p>But keep the y before <b>-ing</b> (running→? no: <i>crying</i>) and in <b>shy→shyness</b>.</p>",
          examples: [
            { w: "making", ipa: "/ˈmeɪkɪŋ/", sent: "She is making dinner.", lvl: 2 },
            { w: "written", ipa: "/ˈrɪtən/", sent: "It is written in the book.", lvl: 2 },
            { w: "careful", ipa: "/ˈkeəfəl/", sent: "Be careful on the road.", lvl: 2 },
            { w: "lovable", ipa: "/ˈlʌvəbəl/", sent: "The puppy is lovable.", lvl: 3 },
            { w: "happiness", ipa: "/ˈhæpinəs/", sent: "Money cannot buy happiness.", lvl: 3 },
            { w: "prettier", ipa: "/ˈprɪtiə/", sent: "This dress is prettier.", lvl: 3 },
            { w: "crying", ipa: "/ˈkraɪɪŋ/", sent: "The baby is crying.", lvl: 2 },
          ],
          watch: [
            "Magic e words <b>keep</b> the e before consonant suffixes: <i>hopeful</i>, not hopful.",
            "<b>-ly</b> behaves like other consonant suffixes: happy→happily, angry→angrily.",
          ],
          quiz: [
            {
              q: "make + -ing → ?",
              options: ["makeing", "making", "makkng", "makeed"],
              answer: 1,
              explain: "Drop the silent e before -ing: making.",
            },
            {
              q: "happy + -ness → ?",
              options: ["happiness", "happyness", "happyess", "happieness"],
              answer: 0,
              explain: "y → i before the consonant suffix: happiness.",
            },
          ],
        },
        {
          id: "er-or-ist",
          title: "-er / -or / -ist / -ee — the ‘person’ endings",
          icon: "🧑‍🚀",
          rule: "Most ‘doer’ nouns end in -er (teacher); Latin/legal words take -or (actor); skill/belief takes -ist (artist).",
          why:
            "<p>English has four endings that all make ‘the person who…’, and they sound the same (/ə/):</p>" +
            "<ul><li><b>-er</b> — the common one, added to verbs: teach<b>er</b>, driv<b>er</b>, bak<b>er</b>, farm<b>er</b>, build<b>er</b>.</li>" +
            "<li><b>-or</b> — Latin-based, legal, official or ‘agent’ words: act<b>or</b>, doct<b>or</b>, direct<b>or</b>, invent<b>or</b>, sail<b>or</b>.</li>" +
            "<li><b>-ist</b> — a skill, belief or ‘-ism’ follower: art<b>ist</b>, scient<b>ist</b>, tour<b>ist</b>, typ<b>ist</b>.</li>" +
            "<li><b>-ee</b> — the person who <b>receives</b> the action: employ<b>ee</b>, train<b>ee</b>, refug<b>ee</b>.</li></ul>",
          examples: [
            { w: "teacher", ipa: "/ˈtiːtʃə/", sent: "My teacher is very kind.", lvl: 1 },
            { w: "driver", ipa: "/ˈdraɪvə/", sent: "The bus driver is patient.", lvl: 1 },
            { w: "builder", ipa: "/ˈbɪldə/", sent: "The builder fixed the roof.", lvl: 2 },
            { w: "actor", ipa: "/ˈæktə/", sent: "He is a famous actor.", lvl: 2 },
            { w: "doctor", ipa: "/ˈdɒktə/", sent: "See a doctor if you are ill.", lvl: 1 },
            { w: "artist", ipa: "/ˈɑːtɪst/", sent: "She is a talented artist.", lvl: 2 },
            { w: "scientist", ipa: "/ˈsaɪəntɪst/", sent: "The scientist made a discovery.", lvl: 3 },
            { w: "employee", ipa: "/ɪmˈplɔɪiː/", sent: "Every employee gets a break.", lvl: 3 },
          ],
          watch: [
            "No neat rule covers everything — the Sound Map and the tutor bot are your friends here. Say the word, then check.",
            "<b>-or</b> is often a hint the word came through French/Latin: governor, sponsor, survivor.",
          ],
          quiz: [
            {
              q: "teach → the ‘doer’ is…",
              options: ["teachist", "teacher", "teachor", "teachee"],
              answer: 1,
              explain: "Common verb + -er: teacher.",
            },
            {
              q: "art → a person with that skill is…",
              options: ["arter", "artor", "artist", "artee"],
              answer: 2,
              explain: "Skills take -ist: artist.",
            },
          ],
        },
      ],
    },

    {
      id: "homophones",
      title: "Homophones",
      icon: "👂",
      blurb: "Same sound, different spelling, different meaning — the classic trap. Learn meaning, not sound.",
      lessons: [
        {
          id: "there-their",
          title: "there / their / they’re",
          icon: "🎯",
          rule: "there = place · their = belonging to them · they’re = they are.",
          why:
            "<p>All three are pronounced <b>/ðeə/</b>. Choose by <b>meaning</b>:</p>" +
            "<ul><li><b>there</b> — a place (here/there): <i>The keys are over there.</i></li>" +
            "<li><b>their</b> — possession, ‘of them’: <i>Their car is red.</i></li>" +
            "<li><b>they’re</b> — short for <b>they are</b>: <i>They’re coming later.</i></li></ul>" +
            "<p>Test in your head: can you replace it with <b>they are</b>? → they’re. Does it mean ‘belonging to them’? → their. Otherwise → there.</p>",
          examples: [
            { w: "there", ipa: "/ðeə/", sent: "Your bag is there, on the chair.", lvl: 2 },
            { w: "their", ipa: "/ðeə/", sent: "Their house has a big garden.", lvl: 2 },
          ],
          watch: ["The same three-way trap: <b>your</b> (belonging) vs <b>you’re</b> (you are) vs <b>yore</b> (old times)."],
          quiz: [
            {
              q: "“___ going to be late.”",
              options: ["There", "Their", "They’re"],
              answer: 2,
              explain: "They are going to be late → they’re.",
            },
            {
              q: "“The dog wagged ___ tail.”",
              options: ["there", "their", "they’re"],
              answer: 1,
              explain: "Belonging to them → their.",
            },
          ],
        },
        {
          id: "to-too-two",
          title: "to / too / two — and its/it’s",
          icon: "2️⃣",
          rule: "to = direction · too = also / too much · two = 2 · it’s = it is · its = belonging.",
          why:
            "<p><b>to / too / two</b> — all /tuː/:</p>" +
            "<ul><li><b>to</b> — direction or infinitive: <i>go to bed</i>, <i>I want to eat</i>.</li>" +
            "<li><b>too</b> — ‘also’ or ‘excess’: <i>Me too</i>, <i>too big</i>. (The extra o is the ‘extra’ one — a useful memory hook.)</li>" +
            "<li><b>two</b> — the number 2.</li></ul>" +
            "<p><b>its / it’s</b> — the apostrophe is only ever short for <b>it is</b>:</p>" +
            "<ul><li><b>it’s</b> = it is: <i>It’s raining.</i></li>" +
            "<li><b>its</b> = belonging to it: <i>The dog wagged its tail.</i> (Possessives like his/her/its have NO apostrophe!)</li></ul>",
          examples: [
            { w: "to", ipa: "/tuː/", sent: "We walked to the park.", lvl: 1 },
            { w: "too", ipa: "/tuː/", sent: "That soup is too hot, and I am hungry too.", lvl: 2 },
            { w: "two", ipa: "/tuː/", sent: "I have two sisters.", lvl: 1 },
            { w: "its", ipa: "/ɪts/", sent: "The cat licked its paw.", lvl: 2 },
            { w: "it's", ipa: "/ɪts/", sent: "It is a beautiful day.", lvl: 2 },
          ],
          watch: [
            "More traps: <b>hear/here</b>, <b>write/right/rite</b>, <b>see/sea</b>, <b>mail/male</b>, <b>flower/flour</b>, <b>weak/week</b>, <b>hole/whole</b>, <b>board/bored</b>.",
          ],
          quiz: [
            {
              q: "“This coffee is ___ hot.”",
              options: ["to", "too", "two"],
              answer: 1,
              explain: "Excess → too (the ‘extra’ o).",
            },
            {
              q: "“The company lost ___ best client.”",
              options: ["it’s", "its", "its’"],
              answer: 1,
              explain: "Belonging to it → its, no apostrophe.",
            },
          ],
        },
      ],
    },

    {
      id: "tricky",
      title: "Tricky Words & Mnemonics",
      icon: "🧠",
      blurb: "The words that break every rule — locked into memory with stories.",
      lessons: [
        {
          id: "because",
          title: "because — and the elephant trick",
          icon: "🐘",
          rule: "because = Big Elephants Can Always Understand Small Elephants.",
          why:
            "<p><b>because</b> /bɪˈkɒz/ breaks every pattern — you simply have to know it. Generations of schoolchildren use this first-letter mnemonic:</p>" +
            "<p class=\"mnemonic\"><b>B</b>ig <b>E</b>lephants <b>C</b>an <b>A</b>lways <b>U</b>nderstand <b>S</b>mall <b>E</b>lephants</p>" +
            "<p>The same trick tames other rule-breakers:</p>" +
            "<ul><li><b>beautiful</b> → <b>B</b>ig <b>E</b>lephants <b>A</b>re <b>U</b>gly <b>T</b>ill <b>I</b>… no — try: <b>be a utiful</b> person: <b>be-a-u-ti-ful</b>.</li>" +
            "<li><b>friend</b> → a <b>friend</b> is there to the <b>end</b> (fri-END).</li>" +
            "<li><b>Wednesday</b> → <b>Wednes</b>-day, or ‘<b>WE Do Not Eat Soup DAY</b>’.</li>" +
            "<li><b>rhythm</b> → <b>R</b>hythm <b>H</b>as <b>Y</b>our <b>T</b>wo <b>H</b>ips <b>M</b>oving.</li></ul>",
          examples: [
            { w: "because", ipa: "/bɪˈkɒz/", sent: "I study because I want to learn.", lvl: 2 },
            { w: "beautiful", ipa: "/ˈbjuːtɪfəl/", sent: "What a beautiful sunset!", lvl: 2 },
            { w: "friend", ipa: "/frend/", sent: "He is a good friend of mine.", lvl: 1 },
            { w: "Wednesday", ipa: "/ˈwenzdeɪ/", sent: "We leave on Wednesday.", lvl: 3 },
            { w: "rhythm", ipa: "/ˈrɪðəm/", sent: "Dance to the rhythm of the music.", lvl: 3 },
          ],
          watch: [
            "Mnemonics work best when they are <b>silly or emotional</b> — your brain remembers strange pictures better than facts.",
            "For really stubborn words, write them by hand three times while saying each syllable out loud.",
          ],
          quiz: [
            {
              q: "The mnemonic ‘Big Elephants Can Always Understand Small Elephants’ spells…",
              options: ["basilica", "because", "breakfast", "building"],
              answer: 1,
              explain: "B-E-C-A-U-S-E → because.",
            },
            {
              q: "friend ends with…",
              options: ["end", "and", "ind", "ond"],
              answer: 0,
              explain: "A friend is there to the END: fri-END.",
            },
          ],
        },
        {
          id: "top-50",
          title: "The 25 most misspelled words",
          icon: "⚠️",
          rule: "These are the words that cost the most marks — drill them until they are automatic.",
          why:
            "<p>Spelling bees and examiners love these. Most break a rule you already know — the trick is <b>noticing which rule</b>:</p>" +
            "<p class=\"chiprow\">necessary · accommodation · definitely · separate · restaurant · tomorrow · beautiful · because · receive · believe · occurrence · embarrass · government · environment ·argument · rhythm · schedule · leisure · neighbour · colleague · sincerely · exaggerate ·privilege · maintenance · parliament</p>" +
            "<p>Use the Sound Map to hear each syllable, then the Dictation drill to burn them in. Tap any word below to hear it, see its IPA, and let Lex explain it.</p>",
          examples: [
            { w: "necessary", ipa: "/ˈnesəsəri/", sent: "Water is necessary for life.", lvl: 3 },
            { w: "accommodation", ipa: "/əˌkɒməˈdeɪʃən/", sent: "The accommodation was cheap.", lvl: 3 },
            { w: "definitely", ipa: "/ˈdefɪnətli/", sent: "I will definitely come.", lvl: 3 },
            { w: "separate", ipa: "/ˈsepərət/", sent: "Keep the two things separate.", lvl: 3 },
            { w: "restaurant", ipa: "/ˈrestrɒnt/", sent: "We ate at a nice restaurant.", lvl: 3 },
            { w: "tomorrow", ipa: "/təˈmɒrəʊ/", sent: "See you tomorrow morning.", lvl: 2 },
            { w: "receive", ipa: "/rɪˈsiːv/", sent: "I receive many emails daily.", lvl: 2 },
            { w: "government", ipa: "/ˈɡʌvənmənt/", sent: "The government changed the law.", lvl: 3 },
            { w: "environment", ipa: "/ɪnˈvaɪrənmənt/", sent: "Protect the environment.", lvl: 3 },
            { w: "argument", ipa: "/ˈɑːɡjuːmənt/", sent: "They had an argument.", lvl: 3 },
          ],
          watch: [
            "<b>necessary</b> — one C, two S’s: ‘a shirt has one Collar and two SleeveS’.",
            "<b>accommodation</b> — two C’s, two M’s: ‘two rooms (cc) for two mice (mm)’.",
            "<b>definitely</b> — ‘defi-NITE-ly’, not defiantly.",
          ],
          quiz: [
            {
              q: "How many c’s and s’s in necessary?",
              options: ["2 c, 1 s", "1 c, 2 s", "2 c, 2 s", "1 c, 1 s"],
              answer: 1,
              explain: "One Collar, two SleeveS: one c, two s’s.",
            },
            {
              q: "Choose correctly: accom__dation.",
              options: ["a", "aa", "o", "e"],
              answer: 0,
              explain: "It doubles up: accommodation (cc and mm).",
            },
          ],
        },
      ],
    },
  ];

  /* ==========================================================
     SOUND → SPELLING MAP
     { sym, key (sample word), type, spellings: [{s, note, words}] }
     The core tool for "hear a sound → know the spelling options".
     ========================================================== */
  S.SOUND_MAP = [
    // ---- Vowels ----
    { sym: "iː", key: "see", type: "vowel", spellings: [
      { s: "ee", note: "mid/end — the safest bet", words: ["see", "tree", "green", "meet", "week"] },
      { s: "ea", note: "mid/end — very common", words: ["meat", "sea", "read", "team"] },
      { s: "e", note: "with magic e or in open syllables", words: ["he", "she", "even"] },
      { s: "ie", note: "mid-word (i before e!)", words: ["piece", "thief", "believe"] },
      { s: "ei", note: "after c (except after c!)", words: ["receive", "ceiling"] },
      { s: "y", note: "end of short words", words: ["happy", "silly", "baby"] },
      { s: "i", note: "rare, in prefixes", words: ["machine", "police"] },
    ]},
    { sym: "ɪ", key: "sit", type: "vowel", spellings: [
      { s: "i", note: "the default short i", words: ["sit", "big", "ship", "win"] },
      { s: "y", note: "unstressed syllables", words: ["myth", "gym", "symbol"] },
      { s: "e", note: "a few odd words", words: ["pretty", "women", "begin"] },
      { s: "ui", note: "only in build", words: ["build"] },
    ]},
    { sym: "e", key: "bed", type: "vowel", spellings: [
      { s: "e", note: "the default short e", words: ["bed", "red", "ten", "leg"] },
      { s: "ea", note: "the rebel family", words: ["head", "bread", "thread", "sweater"] },
      { s: "a", note: "in a few French words", words: ["many", "any", "said", "friend"] },
      { s: "ai", note: "only in said/again", words: ["said", "again"] },
    ]},
    { sym: "æ", key: "cat", type: "vowel", spellings: [
      { s: "a", note: "the default short a", words: ["cat", "hat", "map", "man"] },
      { s: "al", note: "only in half/calf", words: ["half", "calf"] },
      { s: "au", note: "only in laugh/aunt (GB)", words: ["laugh", "aunt"] },
    ]},
    { sym: "ɑː", key: "car", type: "vowel", spellings: [
      { s: "ar", note: "the bossy-r default", words: ["car", "star", "park", "garden"] },
      { s: "a", note: "before r+consonant, or ‘ah’ words", words: ["fast", "class", "bath", "after"] },
      { s: "ear", note: "heart & friends", words: ["heart", "hearth"] },
      { s: "er", note: "in clerk/sergeant (GB)", words: ["clerk", "sergeant"] },
    ]},
    { sym: "ɒ", key: "hot", type: "vowel", spellings: [
      { s: "o", note: "the default short o", words: ["hot", "box", "dog", "stop"] },
      { s: "a", note: "after w/qu", words: ["want", "wash", "watch", "quality"] },
    ]},
    { sym: "ɔː", key: "four", type: "vowel", spellings: [
      { s: "or", note: "the bossy-r default", words: ["for", "short", "sport", "morning"] },
      { s: "aw", note: "mid/end", words: ["law", "saw", "draw", "awful"] },
      { s: "au", note: "mid-word", words: ["author", "caught", "autumn"] },
      { s: "augh", note: "caught-family", words: ["caught", "taught", "daughter"] },
      { s: "ough", note: "ought-family", words: ["thought", "bought", "ought"] },
      { s: "oor/oar", note: "‘or’ diphthong spellings", words: ["door", "floor", "board", "roar"] },
      { s: "ar", note: "after w", words: ["war", "warm", "towards"] },
    ]},
    { sym: "ʊ", key: "book", type: "vowel", spellings: [
      { s: "oo", note: "the short-oo family", words: ["book", "good", "look", "foot"] },
      { s: "u", note: "before l/r/sh", words: ["put", "full", "bull", "sugar"] },
      { s: "ou", note: "could/should/would", words: ["could", "should", "would"] },
    ]},
    { sym: "uː", key: "blue", type: "vowel", spellings: [
      { s: "oo", note: "the long-oo default", words: ["moon", "food", "school", "cool"] },
      { s: "ue", note: "end of words", words: ["blue", "true", "clue", "rescue"] },
      { s: "u-e", note: "magic e", words: ["rule", "June", "huge", "use"] },
      { s: "ew", note: "after consonants", words: ["new", "few", "grew", "flew"] },
      { s: "u", note: "rare open syllables", words: ["who", "two", "shoe"] },
    ]},
    { sym: "ʌ", key: "cup", type: "vowel", spellings: [
      { s: "u", note: "the default short u", words: ["cup", "sun", "bus", "run"] },
      { s: "o", note: "in ‘son/love’ family", words: ["son", "love", "come", "month"] },
      { s: "ou", note: "only in touch-family", words: ["touch", "country", "double"] },
      { s: "oo", note: "only in blood/flood", words: ["blood", "flood"] },
    ]},
    { sym: "ɜː", key: "bird", type: "vowel", spellings: [
      { s: "er", note: "commonest, also the job ending", words: ["her", "sister", "verb", "teacher"] },
      { s: "ir", note: "mid words", words: ["bird", "girl", "first", "shirt"] },
      { s: "ur", note: "mid/end", words: ["turn", "nurse", "hurt", "Thursday"] },
      { s: "or", note: "after w, & word/work", words: ["word", "work", "world", "worm"] },
      { s: "ear", note: "early-earth family", words: ["early", "earth", "heard"] },
      { s: "our", note: "journey-family", words: ["journey", "courtesy"] },
    ]},
    { sym: "ə", key: "about", type: "vowel", spellings: [
      { s: "any vowel", note: "the lazy schwa — the commonest sound in English", words: ["about", "doctor", "pencil", "sofa", "support"] },
    ]},
    { sym: "eɪ", key: "day", type: "diphthong", spellings: [
      { s: "a-e", note: "magic e", words: ["cake", "name", "make", "late"] },
      { s: "ay", note: "end of words", words: ["day", "play", "say", "away"] },
      { s: "ai", note: "mid words (never at the end)", words: ["rain", "wait", "train", "pain"] },
      { s: "ei", note: "weigh-family & after c", words: ["weigh", "eight", "weight", "sleigh"] },
      { s: "ey", note: "they/obey family", words: ["they", "grey", "prey", "obey"] },
      { s: "ea", note: "only in great/break/steak", words: ["great", "break", "steak"] },
    ]},
    { sym: "aɪ", key: "my", type: "diphthong", spellings: [
      { s: "i-e", note: "magic e", words: ["kite", "time", "five", "bike"] },
      { s: "y", note: "end of short words", words: ["my", "fly", "sky", "try"] },
      { s: "igh", note: "igh-family (silent gh)", words: ["high", "night", "light", "right"] },
      { s: "ie", note: "end of short words", words: ["pie", "die", "tie", "lie"] },
      { s: "i", note: "open syllables / prefixes", words: ["hi", "final", "spider"] },
      { s: "uy", note: "only in buy", words: ["buy"] },
    ]},
    { sym: "ɔɪ", key: "boy", type: "diphthong", spellings: [
      { s: "oy", note: "end of words", words: ["boy", "toy", "enjoy", "joy"] },
      { s: "oi", note: "mid words (never at the end)", words: ["coin", "join", "voice", "point"] },
    ]},
    { sym: "aʊ", key: "now", type: "diphthong", spellings: [
      { s: "ou", note: "mid words (never at the end)", words: ["out", "house", "cloud", "round"] },
      { s: "ow", note: "end of words", words: ["now", "cow", "town", "flower"] },
    ]},
    { sym: "əʊ", key: "go", type: "diphthong", spellings: [
      { s: "o-e", note: "magic e", words: ["home", "hope", "nose", "note"] },
      { s: "ow", note: "end of words (double-faced!)", words: ["low", "snow", "grow", "yellow"] },
      { s: "oa", note: "mid words (never at the end)", words: ["boat", "road", "coat", "soap"] },
      { s: "o", note: "open syllables", words: ["go", "no", "open", "hotel"] },
      { s: "ough", note: "only in dough/though/furlough", words: ["dough", "though"] },
    ]},
    { sym: "ɪə", key: "ear", type: "diphthong", spellings: [
      { s: "ear", note: "the default", words: ["ear", "hear", "near", "year"] },
      { s: "ere", note: "here/there family", words: ["here", "mere", "sere"] },
      { s: "eer", note: "beer-family", words: ["beer", "cheer", "deer", "steer"] },
      { s: "e-e", note: "zero/hero family", words: ["zero", "hero", "museum"] },
    ]},
    { sym: "eə", key: "hair", type: "diphthong", spellings: [
      { s: "air", note: "the default", words: ["air", "hair", "chair", "pair"] },
      { s: "are", note: "care-family", words: ["care", "share", "rare", "square"] },
      { s: "ear", note: "bear/pear family", words: ["bear", "pear", "tear"] },
      { s: "eir", note: "their/heir", words: ["their", "heir"] },
    ]},
    { sym: "ʊə", key: "tour", type: "diphthong", spellings: [
      { s: "our", note: "the default (rare sound)", words: ["tour", "pour", "four"] },
      { s: "ure", note: "sure/cure family", words: ["sure", "cure", "pure"] },
    ]},
    // ---- Consonants ----
    { sym: "k", key: "cat", type: "consonant", spellings: [
      { s: "k", note: "before e, i, y & at the end", words: ["key", "keep", "milk", "skin"] },
      { s: "c", note: "before a, o, u & consonants", words: ["cat", "cup", "clock", "club"] },
      { s: "ck", note: "after a short vowel, at the end", words: ["duck", "back", "kick", "rock"] },
      { s: "ch", note: "Greek-origin words", words: ["school", "chemist", "stomach", "ache"] },
      { s: "x", note: "actually /ks/", words: ["box", "fox", "six"] },
      { s: "qu", note: "only in cheque/queue family", words: ["cheque", "queue"] },
    ]},
    { sym: "s", key: "sun", type: "consonant", spellings: [
      { s: "s", note: "the default", words: ["sun", "bus", "yes", "less"] },
      { s: "ss", note: "after a short vowel", words: ["miss", "kiss", "glass", "dress"] },
      { s: "c", note: "before e, i, y (soft c)", words: ["city", "ice", "face", "cycle"] },
      { s: "sc", note: "Latin words", words: ["science", "scene", "scent"] },
      { s: "ps", note: "Greek words (p is silent)", words: ["psychology", "psalm"] },
      { s: "st", note: "only in listen/fasten (t silent)", words: ["listen", "fasten"] },
    ]},
    { sym: "dʒ", key: "jam", type: "consonant", spellings: [
      { s: "j", note: "at the start", words: ["jam", "jump", "job", "just"] },
      { s: "g", note: "before e, i, y (soft g)", words: ["giant", "gym", "page", "orange"] },
      { s: "dge", note: "after a short vowel, at the end", words: ["bridge", "edge", "judge", "badge"] },
      { s: "di", note: "in soldier/grandeur (rare)", words: ["soldier"] },
    ]},
    { sym: "tʃ", key: "chip", type: "consonant", spellings: [
      { s: "ch", note: "the default", words: ["chip", "chair", "rich", "church"] },
      { s: "tch", note: "after a short vowel, at the end", words: ["catch", "watch", "match", "kitchen"] },
      { s: "t", note: "in nature/future (with u)", words: ["nature", "future", "question"] },
    ]},
    { sym: "f", key: "fish", type: "consonant", spellings: [
      { s: "f", note: "the default", words: ["fish", "food", "five", "leaf"] },
      { s: "ff", note: "after a short vowel", words: ["off", "coffee", "staff", "fluffy"] },
      { s: "ph", note: "Greek-origin words", words: ["phone", "photo", "graph", "elephant"] },
      { s: "gh", note: "laugh/cough family", words: ["laugh", "cough", "rough", "enough"] },
      { s: "lf", note: "half-family (l is silent)", words: ["half", "calf"] },
    ]},
    { sym: "ʃ", key: "ship", type: "consonant", spellings: [
      { s: "sh", note: "the default", words: ["ship", "fish", "wash", "she"] },
      { s: "ti", note: "in -tion", words: ["nation", "station", "action"] },
      { s: "ci", note: "in -cial/-cian", words: ["special", "musician", "delicious"] },
      { s: "si", note: "in -sion", words: ["tension", "mission", "version"] },
      { s: "su", note: "in sure/sugar", words: ["sure", "sugar"] },
      { s: "ssi", note: "in mission-family", words: ["mission", "permission"] },
      { s: "ch", note: "French-origin words", words: ["machine", "chef", "chalet"] },
    ]},
    { sym: "ʒ", key: "vision", type: "consonant", spellings: [
      { s: "si", note: "in -sion (voiced)", words: ["vision", "decision", "television"] },
      { s: "ge", note: "in garage/courage", words: ["garage", "courage", "mirage"] },
      { s: "s", note: "in usual/measure/pleasure", words: ["usual", "measure", "pleasure"] },
      { s: "g", note: "in regime (rare)", words: ["regime"] },
    ]},
    { sym: "ŋ", key: "sing", type: "consonant", spellings: [
      { s: "ng", note: "the default — never say ‘n-g’", words: ["sing", "king", "long", "morning"] },
      { s: "n", note: "before k (k is silent)", words: ["think", "bank", "pink", "ankle"] },
    ]},
    { sym: "θ", key: "think", type: "consonant", spellings: [
      { s: "th", note: "unvoiced — tongue between teeth", words: ["think", "three", "bath", "mouth"] },
    ]},
    { sym: "ð", key: "this", type: "consonant", spellings: [
      { s: "th", note: "voiced — the grammar words", words: ["this", "the", "they", "mother", "with"] },
    ]},
    { sym: "ks", key: "box", type: "consonant", spellings: [
      { s: "x", note: "the default", words: ["box", "six", "fox", "next"] },
      { s: "ks", note: "across syllables", words: ["asks", "rinks"] },
      { s: "cs", note: "in mathematics/science", words: ["mathematics", "physics"] },
      { s: "cc", note: "in accident/accommodate", words: ["accident", "accent"] },
    ]},
    { sym: "kw", key: "queen", type: "consonant", spellings: [
      { s: "qu", note: "the only real option", words: ["queen", "quick", "quiet", "square"] },
    ]},
    { sym: "j", key: "yes", type: "consonant", spellings: [
      { s: "y", note: "at the start", words: ["yes", "you", "year", "yellow"] },
      { s: "i", note: "only in onion/brilliant", words: ["onion", "brilliant"] },
      { s: "u", note: "after q/g in cue, argue", words: ["cue", "argue", "rescue"] },
    ]},
  ];

  /* ==========================================================
     EXTRA DRILL WORDS (not tied to one lesson) — mixed bag for
     the “hear it once, spell it right” training.
     ========================================================== */
  S.EXTRA_WORDS = [
    { w: "trade", ipa: "/treɪd/", sent: "International trade is growing.", lvl: 2 },
    { w: "market", ipa: "/ˈmɑːkɪt/", sent: "The market opens at nine.", lvl: 2 },
    { w: "language", ipa: "/ˈlæŋɡwɪdʒ/", sent: "English is a global language.", lvl: 3 },
    { w: "question", ipa: "/ˈkwestʃən/", sent: "Can I ask you a question?", lvl: 2 },
    { w: "answer", ipa: "/ˈɑːnsə/", sent: "Do you know the answer?", lvl: 2 },
    { w: "knowledge", ipa: "/ˈnɒlɪdʒ/", sent: "Knowledge is power.", lvl: 3 },
    { w: "people", ipa: "/ˈpiːpəl/", sent: "Many people came to the party.", lvl: 2 },
    { w: "water", ipa: "/ˈwɔːtə/", sent: "Please bring me some water.", lvl: 1 },
    { w: "mother", ipa: "/ˈmʌðə/", sent: "My mother is a doctor.", lvl: 1 },
    { w: "father", ipa: "/ˈfɑːðə/", sent: "His father is tall.", lvl: 1 },
    { w: "picture", ipa: "/ˈpɪktʃə/", sent: "This is a nice picture.", lvl: 2 },
    { w: "future", ipa: "/ˈfjuːtʃə/", sent: "Think about your future.", lvl: 3 },
    { w: "machine", ipa: "/məˈʃiːn/", sent: "The machine is broken.", lvl: 3 },
    { w: "special", ipa: "/ˈspeʃəl/", sent: "Today is a special day.", lvl: 3 },
    { w: "phone", ipa: "/fəʊn/", sent: "Your phone is ringing.", lvl: 1 },
    { w: "photo", ipa: "/ˈfəʊtəʊ/", sent: "Let me take a photo.", lvl: 2 },
    { w: "laugh", ipa: "/lɑːf/", sent: "You make me laugh.", lvl: 2 },
    { w: "cough", ipa: "/kɒf/", sent: "He has a bad cough.", lvl: 3 },
    { w: "thought", ipa: "/θɔːt/", sent: "I thought about it a lot.", lvl: 3 },
    { w: "through", ipa: "/θruː/", sent: "Look through the window.", lvl: 3 },
    { w: "enough", ipa: "/ɪˈnʌf/", sent: "That is enough for today.", lvl: 3 },
    { w: "danger", ipa: "/ˈdeɪndʒə/", sent: "Be careful, there is danger.", lvl: 2 },
    { w: "bridge", ipa: "/brɪdʒ/", sent: "Cross the bridge slowly.", lvl: 2 },
    { w: "catch", ipa: "/kætʃ/", sent: "Can you catch the ball?", lvl: 2 },
    { w: "square", ipa: "/skweə/", sent: "Draw a square, please.", lvl: 2 },
    { w: "young", ipa: "/jʌŋ/", sent: "She is still very young.", lvl: 2 },
    { w: "month", ipa: "/mʌnθ/", sent: "Next month is my birthday.", lvl: 2 },
    { w: "world", ipa: "/wɜːld/", sent: "The world is a big place.", lvl: 2 },
    { w: "comfortable", ipa: "/ˈkʌmfətəbəl/", sent: "This chair is comfortable.", lvl: 3 },
    { w: "interesting", ipa: "/ˈɪntrəstɪŋ/", sent: "That book is interesting.", lvl: 3 },
    { w: "remember", ipa: "/rɪˈmembə/", sent: "Please remember the date.", lvl: 3 },
    { w: "different", ipa: "/ˈdɪfərənt/", sent: "We are all different.", lvl: 3 },
    { w: "important", ipa: "/ɪmˈpɔːtənt/", sent: "Family is important to me.", lvl: 3 },
    { w: "holiday", ipa: "/ˈhɒlədeɪ/", sent: "We had a lovely holiday.", lvl: 2 },
    { w: "exercise", ipa: "/ˈeksəsaɪz/", sent: "Exercise keeps you healthy.", lvl: 3 },
    { w: "vegetable", ipa: "/ˈvedʒtəbəl/", sent: "Eat your vegetables.", lvl: 3 },
  ];

  /* ==========================================================
     ACHIEVEMENTS — {id, icon, title, desc, xp, test(state)}
     state is the full progress object (see store.js).
     ========================================================== */
  S.ACHIEVEMENTS = [
    { id: "first-step", icon: "👣", title: "First Step", desc: "Complete your first lesson.", xp: 20, test: (s) => s.lessonsDone.length >= 1 },
    { id: "first-blood", icon: "🎯", title: "Sharp Ear", desc: "Spell 10 words correctly in dictation.", xp: 25, test: (s) => s.correctTotal >= 10 },
    { id: "combo-10", icon: "⚡", title: "In The Zone", desc: "Get 10 in a row without a mistake.", xp: 30, test: (s) => s.bestCombo >= 10 },
    { id: "combo-25", icon: "🔥", title: "Unstoppable", desc: "Get 25 in a row without a mistake.", xp: 60, test: (s) => s.bestCombo >= 25 },
    { id: "words-50", icon: "📚", title: "Word Collector", desc: "Master 50 words.", xp: 40, test: (s) => Object.keys(s.mastered).length >= 50 },
    { id: "words-150", icon: "🏛️", title: "Lexicon Builder", desc: "Master 150 words.", xp: 80, test: (s) => Object.keys(s.mastered).length >= 150 },
    { id: "streak-3", icon: "📅", title: "Consistent", desc: "Practice 3 days in a row.", xp: 35, test: (s) => s.bestStreak >= 3 },
    { id: "streak-7", icon: "🗓️", title: "Week Warrior", desc: "Practice 7 days in a row.", xp: 70, test: (s) => s.bestStreak >= 7 },
    { id: "module-1", icon: "🏅", title: "Module Master", desc: "Finish every lesson in one module.", xp: 50, test: (s) => s.modulesDone.length >= 1 },
    { id: "quiz-perfect", icon: "💯", title: "Perfectionist", desc: "Score 100% on a lesson quiz.", xp: 45, test: (s) => s.perfectQuizzes >= 1 },
    { id: "xp-500", icon: "⭐", title: "Rising Star", desc: "Earn 500 XP.", xp: 0, test: (s) => s.xp >= 500 },
    { id: "xp-2000", icon: "🌟", title: "Legend", desc: "Earn 2000 XP.", xp: 0, test: (s) => s.xp >= 2000 },
    { id: "review-20", icon: "🔁", title: "Comeback Kid", desc: "Fix 20 words you got wrong.", xp: 50, test: (s) => s.fixedCount >= 20 },
    { id: "drills-10", icon: "🏋️", title: "Drill Sergeant", desc: "Complete 10 full drills.", xp: 40, test: (s) => s.drillsDone >= 10 },
  ];

  /* ==========================================================
     LEVELS — XP thresholds and titles.
     ========================================================== */
  S.LEVELS = [
    { min: 0, name: "Novice", icon: "🌱" },
    { min: 100, name: "Apprentice", icon: "🌿" },
    { min: 250, name: "Scribe", icon: "✍️" },
    { min: 500, name: "Wordsmith", icon: "🗡️" },
    { min: 900, name: "Linguist", icon: "🗣️" },
    { min: 1400, name: "Orthographer", icon: "🎓" },
    { min: 2000, name: "Spell Master", icon: "🧙" },
    { min: 3000, name: "Legend", icon: "👑" },
  ];

  /* ==========================================================
     WRITING PROMPTS (for the Writing section).
     ========================================================== */
  S.WRITING_PROMPTS = [
    { id: "w1", title: "My favourite place", level: "Beginner", min: 60, prompt: "Describe a place where you feel happy and relaxed. What can you see, hear and smell there? Why is it special to you?" },
    { id: "w2", title: "A person I admire", level: "Beginner", min: 60, prompt: "Write about someone you admire. What are they like, and what have you learned from them?" },
    { id: "w3", title: "The best day of my life", level: "Elementary", min: 80, prompt: "Narrate the best day you can remember. Use past tenses and try to make the reader feel what you felt." },
    { id: "w4", title: "City or countryside?", level: "Intermediate", min: 100, prompt: "Some people prefer living in a big city, others prefer the countryside. What is your opinion, and why? Give examples." },
    { id: "w5", title: "Technology in education", level: "Intermediate", min: 120, prompt: "How has technology changed the way people learn? Discuss the advantages and disadvantages, and give your own view." },
    { id: "w6", title: "If I could change one thing", level: "Upper-Int.", min: 150, prompt: "If you could change one thing in the world, what would it be? Explain the problem and how your change would help." },
  ];

  /* ==========================================================
     HOMOPHONE / CONFUSABLE SETS for games & bot quizzes.
     ========================================================== */
  S.CONFUSABLES = [
    { sound: "/ðeə/", set: ["there", "their", "they're"], test: ["place", "of them", "they are"] },
    { sound: "/tuː/", set: ["to", "too", "two"], test: ["direction", "also / excess", "the number 2"] },
    { sound: "/ɪts/", set: ["its", "it's"], test: ["belonging to it", "it is"] },
    { sound: "/jɔː/", set: ["your", "you're"], test: ["belonging to you", "you are"] },
    { sound: "/hɪə/", set: ["hear", "here"], test: ["with the ears", "this place"] },
    { sound: "/raɪt/", set: ["write", "right", "rite"], test: ["with a pen", "correct", "a ceremony"] },
    { sound: "/siː/", set: ["see", "sea"], test: ["with the eyes", "the ocean"] },
    { sound: "/fluːə/", set: ["flower", "flour"], test: ["a plant", "for baking"] },
    { sound: "/wiːk/", set: ["weak", "week"], test: ["not strong", "7 days"] },
    { sound: "/həʊl/", set: ["hole", "whole"], test: ["an empty space", "complete"] },
  ];
})();

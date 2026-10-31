import type { Lesson } from "./types";

export const FOUNDATIONS_LESSONS: Lesson[] = [
  {
    slug: "not-magic",
    module: "foundations",
    index: 0,
    kind: "lesson",
    title: "It's Not Magic, It's Math",
    subtitle: "What AI actually is (and what it definitely is not)",
    hook: "Forget the movies. No robot is plotting anything. Here's what AI really is — and why it's already making decisions about you every single day.",
    minutes: 6,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "Every time your phone unlocks with your face, Spotify builds a playlist you actually like, or Gmail finishes your sentence — that's AI. Not a brain. Not a person. A program that learned patterns from massive piles of examples.",
      },
      {
        type: "text",
        heading: "Regular code vs. AI",
        kicker: "The one idea that unlocks everything",
        body: [
          "A normal program is a recipe: a human writes exact rules — IF the email contains 'FREE MONEY!!!', THEN mark it spam. The computer follows orders perfectly and thinks about nothing.",
          "AI flips that. Instead of writing the rules, humans show the computer thousands of examples — spam and not-spam — and the machine figures out the rules by itself. That process is called machine learning, and it's the engine under almost every AI you've ever used.",
        ],
      },
      {
        type: "compare",
        heading: "Same problem, two approaches",
        weak: {
          label: "Hand-written rules",
          text: "IF message has the word 'winner' → spam. (Scammers switch to 'w1nner' the next day. You rewrite the rules forever. You lose.)",
        },
        strong: {
          label: "Learned from examples",
          text: "Show the machine 100,000 real spam and real normal emails. It discovers patterns no human would think to write — weird spacing, hidden links, sender behavior — and adapts as spam evolves.",
        },
        note: "AI wins when rules are too messy, too many, or constantly changing.",
      },
      {
        type: "text",
        heading: "'Narrow' is the key word",
        body: [
          "All AI that exists today is narrow AI: scarily good at ONE task, useless at everything else. The model that beats world champions at chess can't tell you what a chess piece IS. Your music recommender knows your taste but couldn't recognize a photo of you.",
          "The sci-fi version — one system that can learn anything a human can, called AGI — does not exist. Anyone telling you otherwise is selling tickets to a movie that hasn't been filmed.",
        ],
      },
      {
        type: "callout",
        variant: "nova",
        title: "NOVA says",
        text: "When you hear 'AI', translate it in your head to: 'a pattern-finding machine trained on tons of examples.' That one swap destroys 90% of the hype.",
      },
      {
        type: "terms",
        terms: [
          { term: "Algorithm", def: "A set of step-by-step instructions a computer follows. A recipe." },
          { term: "Model", def: "The thing machine learning produces — the learned patterns, packaged up so they can make predictions on new stuff." },
          { term: "Machine learning", def: "Teaching computers by showing examples instead of writing rules." },
          { term: "Narrow AI", def: "AI built for one specific task. The only kind that exists today." },
        ],
      },
      {
        type: "stat",
        stats: [
          { value: "3.6B+", label: "photos labeled by vision AI every day" },
          { value: "~80%", label: "of what you watch next is picked by a recommender" },
          { value: "0", label: "AIs alive today that 'want' anything" },
        ],
        note: "AI is infrastructure now — invisible, everywhere, and run on math you can totally learn.",
      },
    ],
    quiz: [
      {
        q: "What makes machine learning different from traditional programming?",
        options: [
          "It runs on faster computers",
          "Humans write stricter rules for it",
          "It discovers rules from examples instead of following hand-written ones",
          "It can think and feel like a person",
        ],
        answer: 2,
        explain: "ML systems learn patterns from data. Nobody writes 'IF this THEN that' rules — the machine infers them from examples.",
      },
      {
        q: "An AI crushes grandmasters at chess but can't describe a chessboard. Why?",
        options: [
          "It's pretending not to know",
          "It's narrow AI — brilliant at one task, nothing else",
          "It wasn't updated to the latest version",
          "Chess is too simple for it",
        ],
        answer: 1,
        explain: "All modern AI is narrow: superhuman inside its one lane, absent outside it.",
      },
      {
        q: "Which of these is the best mental translation for 'AI'?",
        options: [
          "A digital brain that understands the world",
          "A pattern-finding machine trained on examples",
          "A search engine with a personality",
          "A robot plotting in a server farm",
        ],
        answer: 1,
        explain: "That framing — patterns from examples — will keep you accurate through every hype cycle.",
      },
    ],
  },
  {
    slug: "learning-from-data",
    module: "foundations",
    index: 1,
    kind: "lesson",
    title: "Learning From Examples",
    subtitle: "Training data, patterns, and the memorization trap",
    hook: "AIs don't come out smart. They're trained — like athletes, except instead of drills they consume millions of examples. Time to train one yourself.",
    minutes: 8,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "Training an AI is closer to coaching than coding. You don't tell it what a cat is — you show it ten thousand cats until 'cat-ness' becomes a pattern it can spot on its own.",
      },
      {
        type: "text",
        heading: "The three ingredients",
        body: [
          "Every machine learning project needs the same three things: data (a mountain of examples), labels (the correct answer for each example, when you're teaching supervised skills), and a learning algorithm that keeps adjusting itself whenever it guesses wrong.",
          "Guess → check against the label → adjust → repeat, millions of times. That's the whole training loop. The 'intelligence' is just what those millions of tiny corrections add up to.",
        ],
      },
      {
        type: "interactive",
        id: "teachable-machine",
        title: "Lab: Train a classifier yourself",
        caption: "Drop training examples for two species of alien critter — Zorps and Blips. Watch the machine draw its decision boundary live, then flip to TEST mode and see how it handles critters it's never seen. Starve one side of data and watch it get confidently wrong.",
      },
      {
        type: "text",
        heading: "The memorization trap (overfitting)",
        body: [
          "Here's a failure mode you'll recognize from school: imagine 'studying' by memorizing last year's exact exam answers. You score 100% on that paper — and bomb the real test, because you memorized instead of learning.",
          "Models do the same thing. Train too hard on too little data and the model memorizes noise instead of learning the pattern. This is called overfitting, and it's why 'it worked in training!' means nothing until it works on data it has never seen.",
        ],
      },
      {
        type: "list",
        heading: "What the lab just taught you",
        style: "bolt",
        items: [
          { title: "More data, better boundary", text: "With few examples, the model's guesses are shaky. Data is the entire game." },
          { title: "Lopsided data, lopsided model", text: "Train mostly Zorps and everything starts looking like a Zorp. Remember this for the bias module." },
          { title: "Confidence isn't accuracy", text: "A model can be 99% confident and 100% wrong about examples unlike anything it trained on." },
        ],
      },
      {
        type: "callout",
        variant: "key",
        title: "Key idea",
        text: "A model is a compressed summary of its training data. Nothing more. Ask 'what was it trained on?' and you instantly understand 80% of what any AI can and can't do.",
      },
    ],
    quiz: [
      {
        q: "In the training loop, what happens right after the model guesses wrong?",
        options: [
          "It deletes the example",
          "It adjusts itself slightly and tries again, millions of times",
          "A human rewrites its code",
          "It gives up on that category",
        ],
        answer: 1,
        explain: "Training = guess, measure the error, nudge the internals, repeat. The accumulation of nudges is the 'learning'.",
      },
      {
        q: "A model scores 100% on its training data but fails on new examples. What's this called?",
        options: ["Underfitting", "Deep learning", "Overfitting", "Hallucinating"],
        answer: 2,
        explain: "Overfitting = memorizing the practice test instead of learning the subject.",
      },
      {
        q: "You trained a pet-recognizer with 5,000 dog photos and 50 cat photos. Most likely result?",
        options: [
          "It works perfectly — numbers don't matter",
          "Everything starts getting labeled 'dog'",
          "It refuses to answer",
          "It only recognizes cats",
        ],
        answer: 1,
        explain: "Lopsided data produces a lopsided model. Imbalanced training examples are one of the biggest sources of real-world AI bias.",
      },
    ],
  },
  {
    slug: "neural-networks",
    module: "foundations",
    index: 2,
    kind: "lesson",
    title: "Brains Made of Math",
    subtitle: "Neural networks, layers, and billions of tiny knobs",
    hook: "The 'neural' in neural network is a biological metaphor stretched to its limit. Inside there's no thought — just numbers flowing through layers, getting multiplied and adjusted.",
    minutes: 7,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "A neural network is a machine made of millions of tiny dials. Input goes in one end, each dial twists the signal a little, and an answer comes out the other end. Training is just the art of setting all those dials correctly.",
      },
      {
        type: "text",
        heading: "One neuron = one tiny decision",
        body: [
          "Each artificial 'neuron' does something almost insultingly simple: it takes in some numbers, multiplies each by a weight (its opinion of how much that input matters), adds them up, and fires if the total passes a threshold.",
          "One neuron is nothing. But stack them in layers — millions of neurons, billions of weights — and simple decisions compound into extraordinary ones. Layer one detects edges in a photo. A deeper layer assembles edges into shapes. Deeper still: shapes become faces.",
        ],
      },
      {
        type: "interactive",
        id: "network-viz",
        title: "Lab: Fire a signal through a tiny network",
        caption: "Push a signal through three layers and watch how the weights shape the output. Then flip the weights and watch the same input produce a totally different answer. The weights ARE the knowledge.",
      },
      {
        type: "steps",
        heading: "How training sets the dials",
        steps: [
          { title: "Start random", text: "All billions of dials start at random values. The network's first answers are pure noise." },
          { title: "Score the error", text: "For each example, measure exactly how wrong the answer was." },
          { title: "Blame backwards", text: "Using calculus (backpropagation), trace the error backwards to figure out which dials are most responsible." },
          { title: "Nudge and repeat", text: "Turn each guilty dial a tiny bit in the correcting direction. Do this for millions of examples over days or weeks." },
        ],
      },
      {
        type: "callout",
        variant: "nova",
        title: "NOVA says",
        text: "'Deep learning' just means a network with many layers. 'Deep' refers to layer count, not depth of thought. Don't let the branding fool you.",
      },
      {
        type: "quote",
        text: "The network doesn't contain a picture of a cat. It contains billions of numbers that respond to cat-shaped patterns.",
        cite: "The mental model that will serve you forever",
      },
      {
        type: "terms",
        terms: [
          { term: "Weight", def: "A dial inside the network. Training = finding the right value for every weight." },
          { term: "Layer", def: "A stack of neurons. Each layer transforms the signal into something more abstract." },
          { term: "Backpropagation", def: "The algorithm that assigns blame for errors to each weight, so they can be adjusted." },
          { term: "Deep learning", def: "Machine learning with many-layered networks. Powers nearly all modern AI." },
        ],
      },
    ],
    quiz: [
      {
        q: "What is a 'weight' in a neural network?",
        options: [
          "How heavy the server is",
          "The network's confidence score",
          "An adjustable dial that controls how much an input matters",
          "A virus scanner",
        ],
        answer: 2,
        explain: "Weights are the billions of tunable dials. Learning = dialing them correctly.",
      },
      {
        q: "During backpropagation, the network…",
        options: [
          "Traces the error backwards to see which weights to adjust",
          "Deletes its last answer",
          "Sends data back to the user",
          "Restarts from scratch",
        ],
        answer: 0,
        explain: "Backprop works out each weight's share of the blame, then nudges them all slightly.",
      },
      {
        q: "Why do deeper networks recognize faces while shallow ones only find edges?",
        options: [
          "Deeper networks have bigger screens",
          "Each layer builds on the last: edges → shapes → parts → faces",
          "They use wifi instead of math",
          "They skip the boring input",
        ],
        answer: 1,
        explain: "Layers compose simple detections into increasingly abstract concepts.",
      },
    ],
  },
  {
    slug: "generative-ai",
    module: "foundations",
    index: 3,
    kind: "lesson",
    title: "How Chatbots Actually Work",
    subtitle: "Tokens, prediction, and why AI confidently invents facts",
    hook: "ChatGPT doesn't 'look up' answers and it doesn't 'know' things. It does one move, billions of times: predict the next chunk of text. Understanding this is your superpower.",
    minutes: 8,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "A large language model reads your message, and then asks itself the only question it knows how to ask: 'Given everything so far, what word (well, token) probably comes next?' Then it writes that. Then it asks again. That's the whole trick.",
      },
      {
        type: "text",
        heading: "Tokens: the atoms of AI text",
        body: [
          "AI doesn't read letters or whole words — it reads tokens: chunks of text like 'un-', 'believ', '-able', 'the', or '1998'. Your sentence gets chopped into tokens, which become numbers, which flow through a gigantic neural network.",
          "The network's job, learned from an enormous library of text: output a probability for every possible next token. 'The capital of France is…' → 'Paris' gets 92%, 'Lyon' gets 0.4%, 'spaghetti' gets essentially zero.",
        ],
      },
      {
        type: "interactive",
        id: "token-predictor",
        title: "Lab: Be the language model",
        caption: "Complete the sentence the way an LLM does — from raw probabilities. Hover the options to feel how 'likely' each continuation is, and notice what happens when the context gets ambiguous. There's no understanding here. Just very, very good guessing.",
      },
      {
        type: "text",
        heading: "So why does it sound so smart?",
        body: [
          "Because language is a shockingly good compression of human knowledge. To reliably predict the next word across millions of topics, the model had to internalize grammar, facts, reasoning patterns, styles — all as statistical machinery inside its weights.",
          "But — and this is the insight that separates pros from passengers — it has no truth-checker. It generates what's plausible, not what's verified. A plausible-sounding citation for a paper that doesn't exist flows through the exact same machinery as a real one.",
        ],
      },
      {
        type: "callout",
        variant: "warn",
        title: "Hallucination, defined",
        text: "When an AI generates confident, fluent, plausible-sounding content that is factually wrong or entirely fabricated — fake sources, wrong dates, invented statistics — that's a hallucination. It's not a bug that gets patched; it's a side effect of how prediction machines work.",
      },
      {
        type: "list",
        heading: "What this means for you",
        style: "check",
        items: [
          { text: "Fluency ≠ accuracy. Smooth writing proves nothing except that the model writes smoothly." },
          { text: "The more specific the claim (dates, quotes, page numbers), the more it needs checking." },
          { text: "AI is strongest as a first draft and a thinking partner — weakest as an encyclopedia." },
          { text: "Module 02 turns all of this into practical verification skills." },
        ],
      },
    ],
    quiz: [
      {
        q: "At its core, what does a chatbot do when it answers you?",
        options: [
          "Searches a database of verified facts",
          "Predicts the most likely next token, over and over",
          "Copies a Wikipedia paragraph",
          "Thinks, then writes",
        ],
        answer: 1,
        explain: "One mechanism: next-token prediction, iterated. Everything else is emergent behavior of that loop.",
      },
      {
        q: "Why do AI chatbots sometimes invent fake book titles or sources?",
        options: [
          "They're pranking you",
          "Their training data was deleted",
          "They generate plausible text, not verified text — there's no built-in truth check",
          "The internet is broken",
        ],
        answer: 2,
        explain: "The machinery that writes real citations is identical to the machinery that invents fake ones. Plausible ≠ true.",
      },
      {
        q: "What's a 'token'?",
        options: [
          "A coin you pay the AI",
          "A chunk of text — a word, part-word, or punctuation — that the model processes",
          "A security password",
          "A robot's memory card",
        ],
        answer: 1,
        explain: "Text is chopped into tokens before processing. 'Unbelievable' might be three tokens.",
      },
    ],
  },
  {
    slug: "foundations-boss",
    module: "foundations",
    index: 4,
    kind: "boss",
    title: "The Turing Gauntlet",
    subtitle: "Synthesize everything: data, networks, prediction",
    hook: "Four missions down. One gauntlet remains. Six questions, no mercy, and a fat stack of XP for survivors. Chain correct answers to build your combo multiplier.",
    minutes: 5,
    xp: 300,
    blocks: [
      {
        type: "lead",
        text: "This is a boss fight. Six questions covering everything from Module 01 — what AI is, how machines learn from data, how neural nets set their dials, and why chatbots hallucinate.",
      },
      {
        type: "callout",
        variant: "nova",
        title: "Boss rules",
        text: "Correct answers in a row build your combo — each combo step is worth +12 bonus XP. Miss one and the combo resets, but you can retry any question. Finish the gauntlet to light up your first network layer.",
      },
      {
        type: "stat",
        stats: [
          { value: "+300", label: "base XP for clearing this boss" },
          { value: "+60", label: "max combo bonus" },
          { value: "1", label: "network layer ignited" },
        ],
      },
    ],
    quiz: [
      {
        q: "Machine learning, in one sentence:",
        options: [
          "Computers following hand-written rules perfectly",
          "Computers discovering rules from examples instead of being told them",
          "Computers copying human brains exactly",
          "Computers searching the internet really fast",
        ],
        answer: 1,
        explain: "That inversion — examples in, rules out — is the whole field.",
      },
      {
        q: "A model trained on 2 million city photos fails on rural photos. The most useful question to ask is:",
        options: [
          "Was the model turned off and on again?",
          "What was it trained on?",
          "Is the model feeling okay?",
          "How big is the model's screen?",
        ],
        answer: 1,
        explain: "A model is a summary of its training data. Its blind spots live wherever its data didn't.",
      },
      {
        q: "Overfitting is best compared to…",
        options: [
          "Studying by memorizing last year's exam answers",
          "Studying with flashcards",
          "A computer virus",
          "Upgrading your GPU",
        ],
        answer: 0,
        explain: "Perfect on the practice set, useless on anything new = memorized, didn't learn.",
      },
      {
        q: "The 'knowledge' inside a trained neural network physically lives in its…",
        options: ["Cooldown timers", "Training labels", "Weights", "Error messages"],
        answer: 2,
        explain: "Billions of tuned weights ARE the model. Everything else is scaffolding.",
      },
      {
        q: "A chatbot gives you a perfectly formatted citation — author, journal, page numbers. You should…",
        options: [
          "Trust it — formatting that clean must be real",
          "Verify it exists before citing it — plausible text is cheap",
          "Assume it's from Wikipedia",
          "Cite half of it",
        ],
        answer: 1,
        explain: "Hallucinated citations look exactly like real ones. Verify before you trust — always.",
      },
      {
        q: "Why is 'narrow AI' the right description of today's systems?",
        options: [
          "They only work in narrow time zones",
          "Each one is excellent at its specific task and nothing outside it",
          "Their servers are physically small",
          "They have narrow vocabularies",
        ],
        answer: 1,
        explain: "Superhuman in one lane, absent everywhere else. No general machines yet.",
      },
    ],
  },
];

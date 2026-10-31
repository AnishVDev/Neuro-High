import type { Lesson } from "./types";

export const TOOLKIT_LESSONS: Lesson[] = [
  {
    slug: "prompt-anatomy",
    module: "toolkit",
    index: 0,
    kind: "lesson",
    title: "Anatomy of a Killer Prompt",
    subtitle: "Five ingredients that turn mush into magic",
    hook: "The difference between 'write about the Civil War' and a genuinely useful answer isn't the AI — it's the prompt. Prompts have anatomy. Learn it and you control the machine.",
    minutes: 8,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "A prompt is not a question you shout into a void. It's a spec sheet. The model fills in every gap you leave open — and its guesses about what you want are usually bland. Give it a job description, not a vibe.",
      },
      {
        type: "steps",
        heading: "The five-ingredient framework",
        steps: [
          { title: "ROLE — who should it be?", text: "'You are a patient biology tutor…' frames tone, depth, and vocabulary instantly." },
          { title: "TASK — the exact verb", text: "Not 'help with my essay' but 'list 5 counterarguments to my thesis.' Verbs are steering wheels." },
          { title: "CONTEXT — what it needs to know", text: "Grade level, what you already tried, the assignment's rules. AI can't read your mind or your rubric." },
          { title: "FORMAT — the shape of the answer", text: "Bullet points? 150 words? A table? A quiz? Untold, the model picks an essay by default." },
          { title: "CONSTRAINTS — the guardrails", text: "'No jargon.' 'Don't solve it — give me hints.' 'Cite only sources I can find in a library catalog.'" },
        ],
      },
      {
        type: "compare",
        heading: "Same student, two prompts",
        weak: {
          label: "Mush prompt",
          text: "explain photosynthesis",
        },
        strong: {
          label: "Spec-sheet prompt",
          text: "You are a biology tutor for a 10th grader. Explain photosynthesis in under 200 words using a cooking analogy, then give me 3 quick check-for-understanding questions. No jargon without definitions.",
        },
        note: "The second prompt took 20 extra seconds to write and saves five rounds of 'no, not like that.'",
      },
      {
        type: "interactive",
        id: "prompt-builder",
        title: "Lab: The Prompt Forge",
        caption: "Stack the five ingredients, forge your prompt, and fire the Signal Score. A weak prompt barely registers — a complete spec lights up the machine. Score 90+ to earn the Promptsmith badge.",
      },
      {
        type: "callout",
        variant: "nova",
        title: "NOVA says",
        text: "You don't need all five ingredients every time — a quick fact check doesn't need a ROLE. But when output quality matters, every missing ingredient is a dice roll.",
      },
      {
        type: "terms",
        terms: [
          { term: "Prompt", def: "The input you give a generative AI — instructions, context, and question combined." },
          { term: "Prompt engineering", def: "The craft of designing inputs that reliably produce the output you actually want." },
          { term: "Zero-shot", def: "Asking for something with no examples. Works fine; examples just make it better." },
        ],
      },
    ],
    quiz: [
      {
        q: "Which prompt will produce the most useful result?",
        options: [
          "'history project help'",
          "'List 8 possible thesis statements about the causes of WWI for an 11th-grade debate class, ranked from safest to most controversial.'",
          "'wwi stuff please'",
          "'Write my entire project, I don't care how'",
        ],
        answer: 1,
        explain: "Specific task + context + format + a useful ranking constraint. That's the anatomy at work.",
      },
      {
        q: "What does the CONSTRAINT ingredient do?",
        options: [
          "Makes the AI run faster",
          "Sets guardrails: length limits, 'no jargon', 'hints only'",
          "Chooses the AI's personality",
          "Nothing — it's optional decoration",
        ],
        answer: 1,
        explain: "Constraints fence in the output so you don't have to fence it in afterwards.",
      },
      {
        q: "You keep re-prompting because outputs are 'not quite right.' The root cause is usually…",
        options: [
          "The AI is being difficult on purpose",
          "Your prompt left gaps the model had to fill with guesses",
          "You need a newer computer",
          "The moon phase",
        ],
        answer: 1,
        explain: "Under-specified prompts get generic outputs. The fix is almost always in the prompt, not the model.",
      },
    ],
  },
  {
    slug: "iterate-like-pro",
    module: "toolkit",
    index: 1,
    kind: "lesson",
    title: "Iterate Like a Pro",
    subtitle: "The first output is a draft, not a destination",
    hook: "Beginners accept the first answer. Pros treat AI like a sparring partner — pushing back, demanding options, and raising the bar round after round.",
    minutes: 7,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "Chat is a conversation, not a vending machine. The most powerful words in AI aren't in your first prompt — they're in your second and third: 'make it tighter,' 'argue the opposite,' 'what are you missing?'",
      },
      {
        type: "list",
        heading: "Four follow-up superpowers",
        style: "bolt",
        items: [
          { title: "Demand options", text: "'Give me 5 versions, from safest to wildest.' One output is a gamble; five is a menu." },
          { title: "Critique the output", text: "'What are the weakest points in that plan?' The model is a shockingly good critic — even of itself." },
          { title: "Change the altitude", text: "'Now explain it simpler' / 'now go deeper on step 2.' Zoom in and out until it clicks." },
          { title: "Show, don't tell", text: "Paste an example of the style you want ('write headlines like THIS one') — few-shot examples beat adjectives." },
        ],
      },
      {
        type: "interactive",
        id: "scenario-deck",
        title: "Lab: Rescue the chat",
        caption: "Four conversations are going nowhere. At each fork, two follow-ups compete — one unlocks the machine, one wastes the round. Pick the strong move and feel the difference.",
      },
      {
        type: "text",
        heading: "The chaining technique",
        body: [
          "Big tasks crumble when you chain prompts: first 'help me brainstorm 10 angles,' then 'outline #3,' then 'draft section two,' then 'attack this draft as a skeptical teacher.' Each prompt stays small and sharp — and you stay in the director's chair the entire time.",
          "Notice what's happening: the AI does the typing, but the decisions — angle, structure, standard of quality — stay with you. That's the line between using AI as a thinking amplifier and using it as a thinking replacement.",
        ],
      },
      {
        type: "callout",
        variant: "key",
        title: "Key idea",
        text: "Quality is a conversation. If the output disappoints you, the cheapest fix in the world is a better follow-up — it costs ten seconds.",
      },
    ],
    scenarios: [
      {
        setup: "You asked for essay feedback and got: 'This essay is excellent! Well done!' — but your gut says it's not.",
        choiceA: {
          label: "Accept the compliment and submit",
          good: false,
          feedback: "AI defaults to cheerleading when you don't demand rigor. You just burned your one revision window.",
        },
        choiceB: {
          label: "'Stop being nice. Find my 3 weakest arguments and suggest a fix for each.'",
          good: true,
          feedback: "Exactly. Demanding specific criticism converts flattery into fuel.",
        },
      },
      {
        setup: "The AI's speech outline is boring — a generic intro, three generic points, done.",
        choiceA: {
          label: "'Give me 4 alternative outlines — one funny, one story-driven, one debate-style, one minimal.'",
          good: true,
          feedback: "Options unlock taste. You can't pick a great structure from a menu of one.",
        },
        choiceB: {
          label: "Shrug and make slides for the boring outline",
          good: false,
          feedback: "Generic in, generic out. Your audience deserved one more round of iteration.",
        },
      },
      {
        setup: "The explanation of mitosis reads like a textbook swallowed a textbook.",
        choiceA: {
          label: "Read it five times and hope it sticks",
          good: false,
          feedback: "Rereading is the weakest study move known to science — and the fix was one sentence away.",
        },
        choiceB: {
          label: "'Re-explain it as a heist story. Then quiz me with 5 questions.'",
          good: true,
          feedback: "Altitude change plus retrieval practice. Two pro moves in one message.",
        },
      },
      {
        setup: "You need AI-assisted code to match your teacher's style guide, but the output looks nothing like class examples.",
        choiceA: {
          label: "Paste a class example: 'Match THIS style exactly — naming, comments, indentation. Rewrite.'",
          good: true,
          feedback: "Few-shot power: one real example outperforms a paragraph of adjectives.",
        },
        choiceB: {
          label: "Add the word 'simpler' and re-roll the dice",
          good: false,
          feedback: "'Simpler' is a vibe, not a spec. An example IS the spec.",
        },
      },
    ],
    quiz: [
      {
        q: "The AI's first answer is mediocre. The pro move is to…",
        options: [
          "Give up — first answers are final",
          "Push back with specific follow-ups: options, critique, altitude changes",
          "Type the same prompt again louder",
          "Switch to a different website immediately",
        ],
        answer: 1,
        explain: "The conversation IS the tool. Follow-ups are free and unlimited — use them.",
      },
      {
        q: "What's 'chaining'?",
        options: [
          "Copying AI output into another AI",
          "Locking the AI so it can't change topics",
          "Breaking a big task into a sequence of small, sharp prompts where you direct each step",
          "Using the same prompt every day",
        ],
        answer: 2,
        explain: "Small sharp prompts + human direction beats one giant vague prompt every time.",
      },
      {
        q: "'Few-shot' means…",
        options: [
          "You only get a few attempts",
          "You show the AI examples of what you want inside your prompt",
          "The AI takes a few shots at guessing your grade",
          "A type of energy drink",
        ],
        answer: 1,
        explain: "Examples in the prompt are the strongest steering signal that exists.",
      },
    ],
  },
  {
    slug: "trust-verify",
    module: "toolkit",
    index: 2,
    kind: "lesson",
    title: "Trust Nothing, Verify Everything",
    subtitle: "Hallucinations, fake facts, and the 60-second check",
    hook: "AI can lie to you with total confidence and perfect grammar. Not on purpose — it literally can't tell the difference. That means the truth-checker's job… is yours.",
    minutes: 8,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "Remember: the model writes what's plausible, not what's verified. Most of the time plausible and true overlap. The danger zone is specifics — dates, names, quotes, statistics, citations — where a wrong answer looks exactly as polished as a right one.",
      },
      {
        type: "stat",
        stats: [
          { value: "2", label: "US lawyers sanctioned for filing ChatGPT-invented court cases" },
          { value: "~60s", label: "to verify a specific claim with a quick search" },
          { value: "∞", label: "how confident a model sounds while being wrong" },
        ],
        note: "Real case: a 2023 federal filing cited six court decisions that never existed. The lawyers trusted fluency. The judge was not amused.",
      },
      {
        type: "steps",
        heading: "The 60-second verification move",
        steps: [
          { title: "Spot the checkable claim", text: "Dates, quotes, statistics, study results, 'a paper by…', court cases, historical specifics." },
          { title: "Leave the chat", text: "Don't ask the AI 'are you sure?' — it will say yes with the same confidence. Search an independent source." },
          { title: "Trace to the origin", text: "Find the primary source: the actual paper, the official page, the original quote. One click away beats ten AI answers." },
          { title: "Treat AI as a tip-off", text: "Use its output as a list of leads — 'claims to investigate' — not as the final word." },
        ],
      },
      {
        type: "interactive",
        id: "hallucination-hunt",
        title: "Lab: Source Check — hunt the fakes",
        caption: "Six AI-generated claims below. Some are true; some are hallucinated — invented facts wearing a tuxedo. Flag every fake. Catch all six to earn the Hallucination Hunter badge.",
      },
      {
        type: "callout",
        variant: "warn",
        title: "The confidence trap",
        text: "There is zero correlation between how confidently an AI states something and whether it's true. None. Retrain your instincts: smooth, specific, and confident is exactly what a hallucination looks like.",
      },
      {
        type: "list",
        heading: "Your verification toolkit",
        style: "check",
        items: [
          { text: "Lateral reading: open new tabs; check what OTHER sources say about a claim instead of staring at this one." },
          { text: "Reverse-search stats and quotes — real ones leave trails; invented ones evaporate." },
          { text: "For schoolwork, library databases and .edu/.gov sources outrank any chatbot — and any random blog." },
          { text: "When the AI says 'studies show…', the study name is the first thing you verify." },
        ],
      },
    ],
    quiz: [
      {
        q: "An AI cites 'Martinez et al., 2021, Journal of Applied Psychology.' Your move?",
        options: [
          "Cite it — AI wouldn't invent formatting that precise",
          "Search for the actual paper before citing — invented citations look exactly this real",
          "Ask the AI if it's real and trust the answer",
          "Change the year to be safe",
        ],
        answer: 1,
        explain: "Fabricated citations are the classic hallucination. Verify against the real world, not against the AI's own confidence.",
      },
      {
        q: "Why is asking 'are you sure?' a weak verification strategy?",
        options: [
          "The AI gets offended",
          "The AI confirms with the same confidence whether it's right or wrong",
          "It costs money",
          "It deletes the conversation",
        ],
        answer: 1,
        explain: "Confidence is not an instrument. Verification must come from independent sources.",
      },
      {
        q: "The healthiest way to use AI-generated facts is as…",
        options: [
          "Final answers to copy into homework",
          "Leads to investigate through real sources",
          "Proof that the fact is true",
          "Things to memorize before bed",
        ],
        answer: 1,
        explain: "AI is a world-class lead generator and a world-class confabulator. Treat outputs accordingly.",
      },
    ],
  },
  {
    slug: "study-moves",
    module: "toolkit",
    index: 3,
    kind: "lesson",
    title: "Study Moves That Actually Work",
    subtitle: "Turn AI into a tutor, sparring partner, and quiz-master",
    hook: "Here's the plot twist: the highest-value AI uses produce LESS typing from the machine and MORE thinking from you. These five moves turn a chatbot into the best study partner you've ever had.",
    minutes: 7,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "Cognitive science is brutally clear on what builds memory: retrieval practice (pulling answers OUT of your brain), spacing, and getting corrective feedback. Notice what all three need? You, thinking. AI's superpower is manufacturing unlimited chances for exactly that.",
      },
      {
        type: "list",
        heading: "The five moves",
        style: "bolt",
        items: [
          { title: "The Socratic Tutor", text: "'Don't tell me the answer. Ask me questions that lead me to it.' Turns AI from answer-machine into thinking gym." },
          { title: "The Quiz-Master", text: "'Here's my chapter. Generate 10 practice questions, mix easy and brutal, don't show answers until I commit.' Infinite practice tests, zero photocopies." },
          { title: "The Rubber Duck", text: "Explain the concept TO the AI and have it hunt the gaps in your explanation. Teaching is the strongest learning move there is." },
          { title: "The Translator", text: "'Explain entropy like I'm into cooking / basketball / music.' Analogy on demand — the fix when the textbook's explanation doesn't fit your brain." },
          { title: "The Ruthless Editor", text: "'Here's my draft. Don't rewrite it — tell me the 3 weakest spots and ask me questions that force me to fix them myself.' Feedback without ghostwriting." },
        ],
      },
      {
        type: "compare",
        heading: "Same tool, opposite outcomes",
        weak: {
          label: "Brain OFF",
          text: "'Write my essay on Macbeth.' You learn nothing, risk everything (that's the next module), and show up to the exam with an empty tank.",
        },
        strong: {
          label: "Brain ON",
          text: "'Quiz me on Macbeth themes until I miss twice, then explain what I missed differently.' You walk into the exam loaded.",
        },
        note: "The machine types either way. The difference is entirely who does the thinking.",
      },
      {
        type: "callout",
        variant: "nova",
        title: "NOVA says",
        text: "Steal these prompts as starter code. The real pro move is remixing them into versions tuned to how YOUR brain works.",
      },
      {
        type: "quote",
        text: "AI should lower the effort of typing and raise the quality of thinking. If it's doing the reverse, you're holding it wrong.",
        cite: "Print this on your forearm",
      },
    ],
    quiz: [
      {
        q: "Which request will most improve what you actually remember tomorrow?",
        options: [
          "'Summarize chapter 4 so I can skim it instead of reading'",
          "'Quiz me on chapter 4 and explain whatever I get wrong'",
          "'Write my chapter 4 notes for me'",
          "'What's chapter 4 about, in one sentence'",
        ],
        answer: 1,
        explain: "Retrieval practice + corrective feedback is the learning combo backed by the most research.",
      },
      {
        q: "The pattern across all five study moves is…",
        options: [
          "The AI does all the work so you don't have to",
          "The AI manufactures situations where YOU have to think",
          "Longer prompts get better grades",
          "Each one requires a paid subscription",
        ],
        answer: 1,
        explain: "Quizzing, critiquing, translating, gap-hunting — every move puts your brain on the hook.",
      },
      {
        q: "'Explain this like I'm a chef' is powerful because…",
        options: [
          "Chefs are smart",
          "Analogies attach new ideas to knowledge you already have",
          "It shortens the text",
          "It makes the AI hungrier",
        ],
        answer: 1,
        explain: "Anchoring new concepts to existing mental models is one of the fastest routes to real understanding.",
      },
    ],
  },
  {
    slug: "toolkit-boss",
    module: "toolkit",
    index: 4,
    kind: "boss",
    title: "The Prompt Arena",
    subtitle: "Synthesize everything: prompt anatomy, iteration, verification",
    hook: "The arena gate is open. Six questions stand between you and a lit second layer on your neural build. Combo up.",
    minutes: 5,
    xp: 300,
    blocks: [
      {
        type: "lead",
        text: "Boss fight two. Six questions on the full toolkit — prompt ingredients, follow-up craft, verification discipline, and study mechanics. Combos multiply your XP; misses just cost you the chain, not the run.",
      },
      {
        type: "callout",
        variant: "nova",
        title: "Boss rules",
        text: "Chain correct answers for +12 XP per combo step. Clear the arena to ignite Layer 02 of your neural build and bank 300 base XP.",
      },
    ],
    quiz: [
      {
        q: "The five prompt ingredients are Role, Task, Context, Format, and…",
        options: ["Emojis", "Constraints", "Compliments", "Capital letters"],
        answer: 1,
        explain: "Constraints are the guardrails — length, style bans, 'hints only'. Without them you're rolling dice.",
      },
      {
        q: "Which follow-up improves output the most?",
        options: [
          "'Try again'",
          "'Thanks'",
          "'Argue against your own answer, then fix the three weakest points you found'",
          "'please please please'",
        ],
        answer: 2,
        explain: "Self-critique + targeted repair converts one mediocre draft into a strong one.",
      },
      {
        q: "AI gives you a dazzling statistic for your presentation. Before using it you should…",
        options: [
          "Screenshot the chat as your citation",
          "Trace it to the original source — no source, no stat",
          "Round it to a nicer number",
          "Add 'approximately' and move on",
        ],
        answer: 1,
        explain: "Unverifiable statistics are hallucination bait. The origin or the bin.",
      },
      {
        q: "Fluency and accuracy in AI output are…",
        options: [
          "The same thing",
          "Guaranteed together",
          "Independent — smooth writing says nothing about truth",
          "Only linked on weekends",
        ],
        answer: 2,
        explain: "The model optimizes for plausible language. Truth-checking is your department.",
      },
      {
        q: "The strongest AI study pattern is…",
        options: [
          "AI types, you copy, teacher grades",
          "AI generates retrieval practice and feedback while you do the thinking",
          "You memorize the AI's summaries",
          "You avoid AI entirely",
        ],
        answer: 1,
        explain: "Use the machine to create thinking reps, not to skip them.",
      },
      {
        q: "Your prompt output is generic. First suspect?",
        options: [
          "The model is tired",
          "Your prompt under-specified task, context, or format",
          "Mercury retrograde",
          "Too much context",
        ],
        answer: 1,
        explain: "Generic prompts are the number-one cause of generic outputs. Spec it tighter.",
      },
    ],
  },
];

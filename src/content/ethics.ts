import type { Lesson } from "./types";

export const ETHICS_LESSONS: Lesson[] = [
  {
    slug: "where-is-the-line",
    module: "ethics",
    index: 0,
    kind: "lesson",
    title: "Where's the Line?",
    subtitle: "Academic integrity in the age of infinite help",
    hook: "AI can brainstorm with you or write for you — and only one of those is learning. The line between them is real, it matters, and you're the one holding the chalk.",
    minutes: 7,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "Nobody's confused about the extremes. 'Help me think of topics' is obviously fine; 'write my essay and I'll paste it' is obviously cheating. The interesting stuff — the stuff that'll actually define your school career — lives in the gray zone between them.",
      },
      {
        type: "text",
        heading: "The spectrum of help",
        body: [
          "Think about it like a workout. A coach who critiques your form, designs your drills, and spots you on heavy lifts? You still did the work — you get stronger. A coach who lifts the bar for you and hands you the medal? The medal's fake and so are the muscles.",
          "School exists to build the muscles. An assignment is the workout, not the trophy. When AI does the thinking, you're paying full tuition for an empty gym.",
        ],
      },
      {
        type: "list",
        heading: "Usually green (still check your teacher's policy)",
        style: "check",
        items: [
          { text: "Brainstorming topics, angles, and research questions" },
          { text: "Getting feedback on YOUR draft — then revising it yourself" },
          { text: "Practice quizzes, flashcards, and explanation of concepts you're stuck on" },
          { text: "Outlining your own ideas into a structure" },
        ],
      },
      {
        type: "list",
        heading: "Usually red (this is the cheating zone)",
        style: "x",
        items: [
          { text: "Submitting AI-written text as your own work — any amount, any class" },
          { text: "AI-generated citations, quotes, or 'facts' you never verified" },
          { text: "Solving the actual assignment for you when the skill being tested is the point" },
          { text: "Using AI on tests or when the teacher said no" },
        ],
      },
      {
        type: "callout",
        variant: "key",
        title: "The receipts test",
        text: "One question cuts through all the fog: 'If my teacher could see this whole chat — every prompt, every output — would I be proud of how I worked?' If yes, green light. If your stomach just dropped, you already know.",
      },
      {
        type: "text",
        heading: "The disclosure habit",
        body: [
          "Policies differ by teacher and by assignment — the same AI use that's fine in one class is misconduct in another. So build one habit that protects you everywhere: disclose. 'I used ChatGPT to brainstorm angles and critique my outline; the analysis and writing are mine.'",
          "Disclosure converts a potential accusation into a demonstration of maturity. Teachers don't flunk students for honesty — they flunk them for deception. When in doubt: ask before, not after.",
        ],
      },
    ],
    scenarios: [
      {
        setup: "Tomorrow's essay isn't started and it's 11pm. Your cursor hovers over the chatbot.",
        choiceA: {
          label: "'Write me 900 words on the New Deal.' Submit, sleep, pray.",
          good: false,
          feedback: "That's the textbook definition of academic dishonesty — plus you walk into the in-class essay with nothing in the tank.",
        },
        choiceB: {
          label: "'Here are my 3 rough ideas — help me pick the strongest and outline MY argument. I write, you critique.'",
          good: true,
          feedback: "You still did the thinking — late, caffeinated, but yours. You keep the skill AND the integrity.",
        },
      },
      {
        setup: "A friend offers you a 'totally undetectable' prompt chain that rewrites AI text to dodge detection tools.",
        choiceA: {
          label: "Hard pass, and maybe save a friend",
          good: true,
          feedback: "Detectors are unreliable, but that's not why you pass — laundering text you didn't write is still cheating, just with extra steps.",
        },
        choiceB: {
          label: "Take the prompts — it's basically foolproof",
          good: false,
          feedback: "The risk isn't just getting caught; it's graduating with skills you never built. That's an expensive things-to-not-know.",
        },
      },
      {
        setup: "You used AI to understand a hard concept, then wrote the assignment entirely yourself, citing real sources you read.",
        choiceA: {
          label: "Mention it briefly: 'Used AI tutoring to understand X. All writing is mine.'",
          good: true,
          feedback: "Disclosure is power. You've documented honest process — the exact thing integrity policies exist to protect.",
        },
        choiceB: {
          label: "Say nothing and hope nobody asks",
          good: false,
          feedback: "You did nothing wrong — why leave doubt lying around? Silence turns an innocent process into a suspicious one.",
        },
      },
      {
        setup: "The assignment says 'no AI assistance.' Your idea-generation session with AI feels harmless.",
        choiceA: {
          label: "Follow the stated rule, or ask the teacher to clarify the boundary",
          good: true,
          feedback: "When rules are explicit, 'harmless' isn't your call. Asking shows maturity; sneaking shows the opposite.",
        },
        choiceB: {
          label: "Use it anyway — brainstorming doesn't count",
          good: false,
          feedback: "The syllabus is the syllabus. The move that costs nothing — asking — is the only green one here.",
        },
      },
    ],
    quiz: [
      {
        q: "Which use of AI is most clearly INTEGRITY-SAFE?",
        options: [
          "'Write a conclusion for my essay'",
          "'Here's my draft — point out weak logic and ask me questions so I fix it myself'",
          "'Paraphrase this AI text so detectors miss it'",
          "'Summarize the book I was assigned to read' (as a substitute for reading)",
        ],
        answer: 1,
        explain: "Feedback on your own work keeps the thinking with you. That's the whole test.",
      },
      {
        q: "The 'receipts test' asks:",
        options: [
          "Did you save the chat logs?",
          "If your teacher saw your entire AI conversation, would you be proud of how you worked?",
          "Did you pay for the premium version?",
          "Did the AI cite its sources?",
        ],
        answer: 1,
        explain: "It's a gut-check that cuts through gray zones instantly.",
      },
      {
        q: "The single habit that protects you across every class and policy is…",
        options: [
          "Using the newest AI model",
          "Deleting chat history",
          "Disclosing your AI use proactively",
          "Only using AI on weekends",
        ],
        answer: 2,
        explain: "Transparency converts suspicion into trust. Honest process, disclosed early, is bulletproof.",
      },
    ],
  },
  {
    slug: "bias",
    module: "ethics",
    index: 1,
    kind: "lesson",
    title: "Machines Learn Our Baggage",
    subtitle: "Bias in, bias out — and why it scales",
    hook: "AI doesn't invent prejudice. It inherits ours — from data we fed it — and then applies it at machine scale, with machine confidence. Remember the lopsided lab from Module 01? This is that lesson, with stakes.",
    minutes: 7,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "A model is a compressed summary of its training data. If the data carries the fingerprints of an unfair world — and it does — the model learns those patterns too, faithfully and at scale.",
      },
      {
        type: "text",
        heading: "How bias sneaks in",
        body: [
          "Nobody programs 'be biased.' It seeps in through the examples: train a hiring model on a decade of resumes from a company that mostly hired one kind of person, and the model dutifully learns 'this is what a good hire looks like.' Train a chatbot on internet text and it absorbs every stereotype the internet ever shouted.",
          "Then the output comes back looking like The Objective Answer From The Computer. That's the trap: bias with a confident, chrome-plated interface is more convincing than bias from a person.",
        ],
      },
      {
        type: "stat",
        stats: [
          { value: "34%", label: "error rate gap: darker-skinned women vs. light-skinned men in 2018 commercial face analysis*" },
          { value: "1", label: "major tech company that scrapped a hiring tool after it learned to penalize resumes containing 'women's'" },
          { value: "0", label: "models that are free of their training data's patterns" },
        ],
        note: "*Gender Shades study, Joy Buolamwini & Timnit Gebru — the research that made the industry take this seriously.",
      },
      {
        type: "callout",
        variant: "nova",
        title: "NOVA says",
        text: "Whenever an AI gives an answer about people — cultures, genders, neighborhoods, 'normal' anything — ask: whose examples taught it that? What would it answer if it trained on a different slice of the world?",
      },
      {
        type: "steps",
        heading: "What you can actually do",
        steps: [
          { title: "Interrogate the training data", text: "'What was this trained on?' is the most powerful question in AI. Limited answers in = limited world out." },
          { title: "Second-source people-claims", text: "Anything about groups of humans deserves a check against sources written by those humans." },
          { title: "Prompt for perspectives", text: "'Give me the strongest version of multiple viewpoints' explicitly widens the lane." },
          { title: "Say something", text: "Feedback buttons exist because vendors do fix flagged patterns. Found a biased output? Reporting it is a real lever." },
        ],
      },
      {
        type: "quote",
        text: "The machine doesn't hate anyone. It just learned our history at scale — including the parts we're trying to outgrow. That makes audit a human job.",
        cite: "Why this is Module 03",
      },
    ],
    quiz: [
      {
        q: "Where does AI bias primarily come from?",
        options: [
          "Evil programmers",
          "Patterns absorbed from biased training data",
          "Random cosmic rays",
          "The color scheme of the app",
        ],
        answer: 1,
        explain: "Models faithfully learn their data's patterns — including the unfair ones. Bias in, bias out.",
      },
      {
        q: "Why is AI bias more dangerous than a biased person, in some ways?",
        options: [
          "It's applied at massive scale and looks objective",
          "It types faster",
          "It never sleeps",
          "It can vote",
        ],
        answer: 0,
        explain: "Scale + the halo of 'computer objectivity' is what makes a biased model an amplification engine.",
      },
      {
        q: "Your strongest everyday defense when AI makes claims about groups of people?",
        options: [
          "Trust it — math has no feelings",
          "Check the claim against sources from the people it's describing",
          "Close the app",
          "Ask it to be 20% less biased",
        ],
        answer: 1,
        explain: "Lateral checks against primary voices beat any internal dial.",
      },
    ],
  },
  {
    slug: "synthetic-world",
    module: "ethics",
    index: 2,
    kind: "lesson",
    title: "Deepfakes & Fake Facts",
    subtitle: "Reading a world where seeing is no longer believing",
    hook: "Your grandparents were told 'pics or it didn't happen.' You live in the era where a photo, a voice note, and a video prove absolutely nothing. Welcome — here's your field guide.",
    minutes: 7,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "Generative AI can now manufacture faces, voices, photos, and video that look real enough to fool adults, journalists, and occasionally entire news cycles. The skill for your generation isn't spotting glitches — it's verifying sources.",
      },
      {
        type: "text",
        heading: "The trust shift",
        body: [
          "Deepfakes used to have tells — weird ears, six fingers, melting backgrounds. They mostly don't anymore. The technology improved; the detection cues didn't keep up.",
          "So the playbook changed. The question 'does this LOOK fake?' is losing to 'where did this come from, and does anyone credible report the same thing?' Verification moved from the pixels to the source. Good news: that's a skill you already started building in Module 02.",
        ],
      },
      {
        type: "steps",
        heading: "The SIFT move (use it on anything wild)",
        steps: [
          { title: "STOP", text: "Before sharing — notice your pulse. That's how manipulation works. The more it spikes your emotions, the more it needs checking." },
          { title: "INVESTIGATE the source", text: "Who posted this? What else do they post? Is this account 12 days old with 4 followers and a flag in the bio?" },
          { title: "FIND better coverage", text: "Do credible outlets report the same event? Real events leave trails across many independent sources." },
          { title: "TRACE to the original", text: "Quotes, clips, and images get stripped of context. Find where it came from before deciding what it means." },
        ],
      },
      {
        type: "callout",
        variant: "warn",
        title: "The emotional urgency tell",
        text: "Fabrications are engineered to make you feel something fast — outrage, fear, victory, belonging. 'Share this NOW' energy is itself a red flag. Real information survives a 10-minute pause.",
      },
      {
        type: "list",
        heading: "Why this matters at your school",
        style: "bolt",
        items: [
          { text: "Fake screenshots of classmates 'saying things' are already a bullying vector — verify before believing, never before sharing." },
          { text: "Voice cloning needs only seconds of audio. A 'friend in trouble' call asking for money? Verify through another channel. Always." },
          { text: "Your own face and voice are training data the moment you post them publicly. Post consciously." },
        ],
      },
    ],
    quiz: [
      {
        q: "A shocking video of a public figure is going viral. The most reliable first move is…",
        options: [
          "Zoom in on the pixels looking for glitches",
          "Check whether credible outlets independently report it, and who posted it originally",
          "Share it with 'not sure if real but wow'",
          "Trust it — video doesn't lie",
        ],
        answer: 1,
        explain: "Source triangulation beats pixel-hunting now. SIFT: stop, investigate the source, find better coverage, trace.",
      },
      {
        q: "The strongest psychological red flag in misinformation is…",
        options: [
          "It's written in a formal tone",
          "It's engineered to spike an emotion and make you share immediately",
          "It has too many citations",
          "It's boring",
        ],
        answer: 1,
        explain: "Outrage and urgency are manufacturing tells. Real info can wait 10 minutes.",
      },
      {
        q: "A 'friend' calls from an unknown number, voice sounds right, urgently needs gift cards. You…",
        options: [
          "Help immediately — you'd recognize that voice anywhere",
          "Hang up and verify through another channel — reach them at their real number",
          "Ask them to say something only a friend would know",
          "Negotiate the amount",
        ],
        answer: 1,
        explain: "Seconds of audio are enough to clone a voice in 2025. Out-of-band verification is the adult move.",
      },
    ],
  },
  {
    slug: "your-data",
    module: "ethics",
    index: 3,
    kind: "lesson",
    title: "Your Data Is the Product",
    subtitle: "Privacy, attribution, and owning your digital self",
    hook: "Everything you type into a chatbot goes somewhere — to servers, logs, and sometimes training sets. The last mission of Module 03: protect your data like it matters, and give credit like a pro.",
    minutes: 6,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "Free AI tools aren't free — you pay in data. Every prompt is logged, reviewed, and (depending on settings and provider) folded into future training. That doesn't mean 'never use it.' It means 'use it like someone who knows where the data goes.'",
      },
      {
        type: "text",
        heading: "What to never feed the machine",
        body: [
          "Rule of thumb: don't paste anything into a chatbot you wouldn't want read out loud in a crowded cafeteria. Your full name + address + schedule? Never. Your friend's medical stuff to get 'advice'? That's not your data to give. Passwords, IDs, private family details, other people's secrets — hard no.",
          "Also no: pasting entire unpublished works from other people, proprietary school materials you don't own, or anything covered by an NDA (your future employer's code stays out of chatbots — asking 'can I paste this?' first is a career skill).",
        ],
      },
      {
        type: "list",
        heading: "Privacy hygiene, AI edition",
        style: "check",
        items: [
          { text: "Strip names and specifics: 'a friend who failed chem' beats 'Jessica Rivera from 4th period'" },
          { text: "Check the tool's training-data settings — most let you opt out of training" },
          { text: "School accounts ≠ personal accounts; know which is which" },
          { text: "Assume anything entered could resurface. Prompt accordingly." },
        ],
      },
      {
        type: "text",
        heading: "Giving credit: citing AI like a scholar",
        body: [
          "AI use belongs in your work's documentation when it contributed. APA and MLA both publish AI citation formats (you cite the tool, version, date, and how you used it — often in an appendix with your prompts). When your teacher sets a stricter format, theirs wins.",
          "Beyond compliance, citation is flexing. 'Here's my process, AI included' signals that you have nothing to hide and know exactly what you're doing — the two most employable signals a student can send.",
        ],
      },
      {
        type: "callout",
        variant: "key",
        title: "The accountability anchor",
        text: "Whatever the AI helped produce, YOU are accountable for it — its errors, its biases, its invented citations. 'The AI wrote that' has never once transferred responsibility. You ship it, you own it.",
      },
    ],
    quiz: [
      {
        q: "Which is safe to paste into a chatbot?",
        options: [
          "Your classmate's therapy session notes for 'summary help'",
          "A general question about managing homework stress — names stripped",
          "Your home address so it 'knows where you live' for weather tips",
          "Your friend's password to troubleshoot their login",
        ],
        answer: 1,
        explain: "Vague, anonymized, non-sensitive = fine. Personal data — yours or anyone's — stays out.",
      },
      {
        q: "When AI meaningfully helped your assignment, the pro move is to…",
        options: [
          "Hide it — nobody needs to know",
          "Cite the tool and describe how you used it, per your class's citation format",
          "Tell only your close friends",
          "Delete the chat",
        ],
        answer: 1,
        explain: "APA/MLA have AI formats; your teacher's rules override. Disclosure is armor AND scholarship.",
      },
      {
        q: "An AI-assisted paragraph turns out to contain a plagiarized passage. Who's responsible?",
        options: [
          "The AI company",
          "Nobody — accidents happen",
          "You — you shipped it, you own it",
          "The person who wrote the original",
        ],
        answer: 2,
        explain: "Accountability never transfers to the tool. Final responsibility always lands on the human who submits.",
      },
    ],
  },
  {
    slug: "ethics-boss",
    module: "ethics",
    index: 4,
    kind: "boss",
    title: "Judgment Day",
    subtitle: "Synthesize everything: integrity, bias, truth, data",
    hook: "Final boss. Six questions across the ethics gauntlet. Clear it to ignite Layer 03 — and if you've finished everything, your full neural network lights up.",
    minutes: 5,
    xp: 300,
    blocks: [
      {
        type: "lead",
        text: "The last boss. Integrity boundaries, bias literacy, verification instincts, data hygiene — six questions, one glowing network on the other side. Build the combo.",
      },
      {
        type: "callout",
        variant: "nova",
        title: "Boss rules",
        text: "Combos pay +12 XP per step, miss and the chain resets. Clear this and Module 03 locks in — plus the Team Human badge joins your shelf.",
      },
    ],
    quiz: [
      {
        q: "The dividing line between legit AI help and cheating is best described as…",
        options: [
          "Whether you get caught",
          "Whether the AI typed any words",
          "Whether the thinking — the skill being built — stayed with you",
          "Whether it's past 9pm",
        ],
        answer: 2,
        explain: "The workout metaphor: help with your form is fine; someone else lifting the bar isn't.",
      },
      {
        q: "A teacher says 'no AI on this assignment.' You used it to brainstorm before reading that. Now what?",
        options: [
          "Keep quiet — brainstorming doesn't count",
          "Follow the stated rule and redo the thinking yourself, or ask the teacher directly",
          "Only use half of the AI ideas",
          "Cite the AI and proceed anyway",
        ],
        answer: 1,
        explain: "Explicit rules outrank your personal interpretation. Asking is free and reads as maturity.",
      },
      {
        q: "Why does AI bias matter more than individual human bias?",
        options: [
          "It doesn't — bias is bias",
          "It scales: one biased model can affect millions of decisions while looking objective",
          "Because robots are scary",
          "Because it's always wrong",
        ],
        answer: 1,
        explain: "Scale plus the objectivity halo is the entire problem statement.",
      },
      {
        q: "Best response to a viral, shocking clip with no credible coverage yet:",
        options: [
          "Share with 'POV: insane'",
          "SIFT: stop, investigate the source, find better coverage, trace the original",
          "Comment 'fake??' and watch the replies decide",
          "Assume true until debunked",
        ],
        answer: 1,
        explain: "Verification lives in sources, not pixels or vibes.",
      },
      {
        q: "Which belongs in a chatbot?",
        options: [
          "An anonymized question about time management",
          "Your login credentials 'for testing'",
          "A friend's private texts for 'summarizing'",
          "Your full legal name, address, and routine",
        ],
        answer: 0,
        explain: "Strip specifics. Anonymized, non-sensitive questions get the same quality answers.",
      },
      {
        q: "Who is accountable for the accuracy of AI-assisted work you submit?",
        options: [
          "The model provider",
          "The open-source community",
          "You, entirely",
          "Shared 50/50 with the AI",
        ],
        answer: 2,
        explain: "You ship it, you own it. Responsibility never transfers to the tool.",
      },
    ],
  },
];

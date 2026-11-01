import type { Lesson } from "./types";

export const TOOLKIT_LESSONS: Lesson[] = [
  {
    slug: "prompt-anatomy",
    module: "toolkit",
    index: 0,
    kind: "lesson",
    title: "The Anatomy of a Strong Prompt",
    subtitle: "Five ingredients that make AI responses more useful",
    hook: "Ask an AI to \"write about the Civil War\" and you'll get something generic. Ask it the right way and you'll get something genuinely helpful. The difference usually isn't the AI. It's the prompt. Let's look at what makes a prompt work.",
    minutes: 8,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "Think of a prompt less like a question and more like a set of instructions. Whatever you leave out, the AI has to guess, and its guesses tend to be safe and generic. The more clearly you describe what you need, the closer the response will be to what you actually want.",
      },
      {
        type: "steps",
        heading: "The five-ingredient framework",
        steps: [
          { title: "ROLE: Who should the AI act as?", text: "Starting with \"You are a patient biology tutor...\" helps set the tone, depth, and vocabulary of the response." },
          { title: "TASK: What exactly should it do?", text: "Instead of \"help with my essay,\" try \"list 5 counterarguments to my thesis.\" A specific action verb gives the AI a clear direction." },
          { title: "CONTEXT: What does it need to know?", text: "Your grade level, what you've already tried, the assignment's requirements. The AI can't see your rubric unless you share it." },
          { title: "FORMAT: What should the answer look like?", text: "Bullet points? 150 words? A table? A practice quiz? If you don't say, the AI will usually default to paragraphs." },
          { title: "CONSTRAINTS: What are the limits?", text: "\"Avoid jargon.\" \"Give me hints instead of the answer.\" \"Keep it under one page.\" Constraints keep the response focused." },
        ],
      },
      {
        type: "compare",
        heading: "Same student, two different prompts",
        weak: {
          label: "Vague prompt",
          text: "explain photosynthesis",
        },
        strong: {
          label: "Specific prompt",
          text: "You are a biology tutor for a 10th grader. Explain photosynthesis in under 200 words using a cooking analogy, then give me 3 quick questions to check my understanding. Define any technical terms you use.",
        },
        note: "The second prompt takes about 20 extra seconds to write, and it can save you several rounds of \"that's not quite what I meant.\"",
      },
      {
        type: "interactive",
        id: "prompt-builder",
        title: "Lab: Build a Prompt",
        caption: "Combine the five ingredients to build your own prompt, then check its Signal Score. Notice how the score changes as you add each ingredient. Reach 90 or higher to earn the Promptsmith badge.",
      },
      {
        type: "callout",
        variant: "nova",
        title: "NOVA says",
        text: "You don't need all five ingredients every time. A quick fact question probably doesn't need a role. But when the quality of the answer really matters, each ingredient you include makes a good result more likely.",
      },
      {
        type: "terms",
        terms: [
          { term: "Prompt", def: "The input you give a generative AI, including your instructions, context, and question." },
          { term: "Prompt engineering", def: "The skill of writing inputs that reliably produce the output you're looking for." },
          { term: "Zero-shot", def: "Asking the AI to do something without giving it any examples. This often works, but examples can improve results." },
        ],
      },
    ],
    quiz: [
      {
        q: "Which prompt is most likely to produce a useful result?",
        options: [
          "\"List 8 possible thesis statements about the causes of WWI for an 11th-grade debate class, ranked from most widely accepted to most debatable.\"",
          "\"Help me with my history project about WWI.\"",
          "\"Tell me everything about the causes of WWI.\"",
        ],
        answer: 0,
        explain: "This prompt includes a clear task, helpful context (11th-grade debate class), a specific format (8 statements), and a useful way to organize them. That's prompt anatomy in action.",
      },
      {
        q: "What does the CONSTRAINTS ingredient do?",
        options: [
          "It tells the AI what role or personality to take on",
          "It sets limits on the response, like length, vocabulary, or \"hints only\"",
          "It gives the AI background information about your assignment",
        ],
        answer: 1,
        explain: "Constraints set boundaries on the output, so you don't have to trim or fix it afterward. Setting a role is the ROLE ingredient, and background information is CONTEXT.",
      },
      {
        q: "You keep re-prompting because the AI's answers are \"not quite right.\" What's the most likely cause?",
        options: [
          "The AI model you're using isn't advanced enough for the task",
          "Your prompts are too long, so the AI is getting confused",
          "Your prompt left out details, so the AI had to guess what you wanted",
        ],
        answer: 2,
        explain: "When a prompt is missing details, the AI fills the gaps with generic guesses. The fix is usually adding more specific information, not switching tools.",
      },
    ],
  },
  {
    slug: "iterate-like-pro",
    module: "toolkit",
    index: 1,
    kind: "lesson",
    title: "Improving Responses Through Iteration",
    subtitle: "Treat the first answer as a first draft",
    hook: "Many people accept whatever the AI says first. Experienced users treat it as the start of a conversation. They ask follow-up questions, request alternatives, and keep refining until the answer is actually good.",
    minutes: 7,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "Working with AI is a conversation, not a one-time request. Some of the most useful things you can type come after the first response: \"Make this more concise,\" \"Argue the opposite side,\" or \"What did you leave out?\"",
      },
      {
        type: "list",
        heading: "Four useful follow-up strategies",
        style: "bolt",
        items: [
          { title: "Ask for options", text: "\"Give me 5 versions, from most traditional to most creative.\" One answer is a single guess. Several answers let you choose the best fit." },
          { title: "Ask for a critique", text: "\"What are the weakest parts of this plan?\" AI can be surprisingly good at spotting problems, even in its own work." },
          { title: "Adjust the level of detail", text: "\"Explain that more simply\" or \"Go deeper on step 2.\" Zoom in or out until the idea makes sense to you." },
          { title: "Show an example", text: "Paste a sample of the style you want, like \"Write headlines similar to this one.\" Examples (called few-shot prompting) usually work better than descriptions." },
        ],
      },
      {
        type: "interactive",
        id: "scenario-deck",
        title: "Lab: Improve the Conversation",
        caption: "Each of these four conversations has gotten stuck. At each point, choose between two follow-ups. One moves the conversation forward, and one doesn't. See if you can pick the stronger move each time.",
      },
      {
        type: "text",
        heading: "Breaking big tasks into steps",
        body: [
          "Large tasks become much easier when you break them into a sequence of smaller prompts. This is called chaining. For example: first \"Help me brainstorm 10 angles for this essay,\" then \"Outline angle #3,\" then \"Give feedback on my draft of section two,\" then \"Critique this draft like a skeptical teacher would.\" Each prompt stays focused, and you guide the process at every step.",
          "Notice who's making the decisions here. The AI helps generate ideas and feedback, but you choose the angle, the structure, and the standard of quality. That's the difference between using AI to support your thinking and using it to replace your thinking.",
        ],
      },
      {
        type: "callout",
        variant: "key",
        title: "Key idea",
        text: "A better response is usually one follow-up away. If an answer isn't what you need, take ten seconds to tell the AI specifically what to change.",
      },
    ],
    scenarios: [
      {
        setup: "You asked for feedback on your essay, and the AI replied: \"This essay is excellent! Well done!\" But you suspect it still needs work.",
        choiceA: {
          label: "Accept the feedback and submit the essay",
          good: false,
          feedback: "AI tends to be encouraging unless you ask for critical feedback. You missed a chance to make your essay stronger.",
        },
        choiceB: {
          label: "\"Please be critical. Identify my 3 weakest arguments and suggest how to improve each one.\"",
          good: true,
          feedback: "Nice work. Asking for specific, critical feedback turns general praise into something you can actually use.",
        },
      },
      {
        setup: "The AI gave you a speech outline, but it's pretty bland: a generic introduction, three generic points, and a conclusion.",
        choiceA: {
          label: "\"Give me 4 alternative outlines: one humorous, one built around a story, one structured as a debate, and one minimal.\"",
          good: true,
          feedback: "Great choice. Seeing several options helps you recognize which approach fits your topic and audience best.",
        },
        choiceB: {
          label: "Use the bland outline and start making slides",
          good: false,
          feedback: "A generic prompt led to a generic outline. One more round of iteration could have given you something much more engaging.",
        },
      },
      {
        setup: "The AI's explanation of mitosis is accurate, but it's dense and hard to follow.",
        choiceA: {
          label: "Reread the explanation several times until it makes sense",
          good: false,
          feedback: "Rereading is one of the least effective study strategies. A quick follow-up could have given you a clearer explanation.",
        },
        choiceB: {
          label: "\"Re-explain mitosis as a story with characters. Then quiz me with 5 questions.\"",
          good: true,
          feedback: "Excellent. You changed the explanation style and added retrieval practice, which are two effective strategies in one message.",
        },
      },
      {
        setup: "You're getting AI help with code for class, but the output doesn't match the style your teacher requires.",
        choiceA: {
          label: "Paste an example from class: \"Match this style exactly, including naming, comments, and indentation.\"",
          good: true,
          feedback: "That's few-shot prompting. One real example communicates much more than a description could.",
        },
        choiceB: {
          label: "Ask it to \"make it simpler\" and try again",
          good: false,
          feedback: "\"Simpler\" is open to interpretation, so the AI still has to guess. An example shows it exactly what you need.",
        },
      },
    ],
    quiz: [
      {
        q: "What does \"few-shot prompting\" mean?",
        options: [
          "Including examples of what you want inside your prompt",
          "Limiting yourself to a few attempts so you don't overuse AI",
          "Asking several short questions instead of one long one",
        ],
        answer: 0,
        explain: "Few-shot prompting means showing the AI examples. Examples are one of the clearest ways to communicate the style or format you want.",
      },
      {
        q: "What is \"chaining\"?",
        options: [
          "Copying one AI's output into a different AI for a second opinion",
          "Repeating the same prompt until you get a better answer",
          "Breaking a big task into a series of smaller prompts, with you guiding each step",
        ],
        answer: 2,
        explain: "Chaining splits a large task into focused steps. Each prompt stays manageable, and you stay in charge of the decisions.",
      },
      {
        q: "The AI's first answer is okay but not great. What's the best next step?",
        options: [
          "Start a new chat and type the exact same prompt again",
          "Reply with specific follow-ups, like asking for options, a critique, or a simpler explanation",
          "Accept the answer, since AI responses are usually as good as they'll get",
        ],
        answer: 1,
        explain: "Specific follow-ups give the AI clear direction for improvement. Repeating the same prompt gives it no new information to work with.",
      },
    ],
  },
  {
    slug: "trust-verify",
    module: "toolkit",
    index: 2,
    kind: "lesson",
    title: "Checking AI's Facts",
    subtitle: "Hallucinations, made-up sources, and the 60-second check",
    hook: "AI can state something false with complete confidence and perfect grammar. It isn't lying on purpose. It simply can't tell the difference between true and false. That means checking the facts is up to you.",
    minutes: 8,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "Remember, AI generates text that sounds plausible, not text that has been verified. Most of the time, what sounds right and what is right overlap. The risk is highest with specifics like dates, names, quotes, statistics, and citations, where a wrong answer looks just as polished as a correct one.",
      },
      {
        type: "stat",
        stats: [
          { value: "6", label: "court cases cited in a legal filing that turned out not to exist" },
          { value: "2", label: "lawyers sanctioned for submitting the AI-invented cases" },
          { value: "~60s", label: "the time it usually takes to verify a specific claim" },
        ],
        note: "This really happened. In 2023, lawyers in a federal case used ChatGPT for research and submitted citations to cases the AI had made up. They trusted how convincing the answer sounded, and the court fined them for it.",
      },
      {
        type: "steps",
        heading: "The 60-second verification check",
        steps: [
          { title: "Identify claims you can check", text: "Look for dates, quotes, statistics, study results, references to specific papers, and historical details." },
          { title: "Use an outside source", text: "Asking the AI \"Are you sure?\" won't help, because it will often answer with the same confidence either way. Search somewhere independent instead." },
          { title: "Find the original source", text: "Look for the actual study, the official website, or the original quote. The primary source is more reliable than any summary." },
          { title: "Treat AI output as a starting point", text: "Think of AI's claims as leads to investigate, not as final answers." },
        ],
      },
      {
        type: "interactive",
        id: "hallucination-hunt",
        title: "Lab: Spot the Hallucinations",
        caption: "Below are six claims generated by AI. Some are true, and some are hallucinations: made-up facts that sound convincing. Can you identify which ones are false? Find all of them to earn the Hallucination Hunter badge.",
      },
      {
        type: "callout",
        variant: "warn",
        title: "Confidence isn't evidence",
        text: "How confident an AI sounds tells you nothing about whether it's correct. A hallucination often looks exactly like a good answer: smooth, specific, and certain. Let the evidence decide, not the tone.",
      },
      {
        type: "list",
        heading: "Verification strategies",
        style: "check",
        items: [
          { text: "Read laterally: open new tabs and see what other trustworthy sources say about the claim." },
          { text: "Search for statistics and quotes directly. Real ones usually show up in multiple places; invented ones usually don't." },
          { text: "For schoolwork, library databases and .edu or .gov sources are more reliable than chatbots or random blogs." },
          { text: "When AI says \"studies show...,\" find the specific study before you use the claim." },
        ],
      },
    ],
    quiz: [
      {
        q: "Why is asking the AI \"Are you sure?\" a weak way to verify a fact?",
        options: [
          "The AI tends to answer with the same confidence whether it's right or wrong",
          "The AI isn't allowed to change an answer once it has given it",
          "The AI will always change its answer, even when it was correct",
        ],
        answer: 0,
        explain: "An AI's confidence doesn't reflect its accuracy, so asking it to double-check itself isn't reliable. Real verification comes from independent sources.",
      },
      {
        q: "What's the most effective way to use facts that an AI gives you?",
        options: [
          "As reliable answers, as long as the AI provides a citation",
          "As leads to investigate using trustworthy sources",
          "As reliable answers, as long as they include specific details",
        ],
        answer: 1,
        explain: "AI is great at pointing you toward ideas to explore, but citations and specific details can be invented too. Always confirm with a real source.",
      },
      {
        q: "An AI cites \"Martinez et al., 2021, Journal of Applied Psychology\" to support a claim. What should you do?",
        options: [
          "Use the citation, since the detailed formatting suggests it's real",
          "Ask the AI to confirm the source is real, then use it",
          "Search for the actual paper before citing it",
        ],
        answer: 2,
        explain: "Made-up citations are one of the most common types of hallucination, and they often look completely legitimate. Check that the paper exists before you rely on it.",
      },
    ],
  },
  {
    slug: "study-moves",
    module: "toolkit",
    index: 3,
    kind: "lesson",
    title: "Study Strategies That Actually Work",
    subtitle: "Use AI as a tutor, quiz partner, and feedback coach",
    hook: "Here's something surprising: the most valuable ways to use AI for learning involve less writing from the AI and more thinking from you. These five strategies can turn an AI chatbot into a genuinely helpful study partner.",
    minutes: 7,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "Research on learning is clear about what helps you remember: retrieval practice (recalling information from memory), spacing out your studying, and getting feedback on your mistakes. All three require you to do the thinking. AI is useful because it can create endless opportunities for that kind of practice.",
      },
      {
        type: "list",
        heading: "Five study strategies",
        style: "bolt",
        items: [
          { title: "The Socratic Tutor", text: "\"Don't give me the answer. Ask me questions that help me figure it out.\" This turns AI from an answer source into a thinking coach." },
          { title: "The Quiz Partner", text: "\"Here are my notes. Write 10 practice questions, from easy to challenging, and don't show the answers until I respond.\" Unlimited practice tests, whenever you need them." },
          { title: "The Listener", text: "Explain a concept to the AI and ask it to point out gaps or mistakes in your explanation. Teaching something is one of the best ways to learn it." },
          { title: "The Translator", text: "\"Explain entropy using an analogy about cooking (or basketball, or music).\" Helpful when the textbook's explanation just isn't clicking." },
          { title: "The Feedback Coach", text: "\"Here's my draft. Don't rewrite it. Point out the 3 weakest spots and ask me questions that help me fix them.\" You get feedback while the work stays yours." },
        ],
      },
      {
        type: "compare",
        heading: "Same tool, very different results",
        weak: {
          label: "AI does the thinking",
          text: "\"Write my essay on Macbeth.\" You don't learn the material, you risk academic integrity problems (more on that in the next module), and you're unprepared for the test.",
        },
        strong: {
          label: "You do the thinking",
          text: "\"Quiz me on the themes in Macbeth. When I miss one, explain it a different way.\" You walk into the test actually knowing the material.",
        },
        note: "The AI produces text in both cases. What matters is who's doing the thinking.",
      },
      {
        type: "callout",
        variant: "nova",
        title: "NOVA says",
        text: "Feel free to use these prompts as starting points. Over time, try adjusting them to fit the way you learn best.",
      },
      {
        type: "quote",
        text: "AI should make the typing easier and the thinking better. If it's doing the opposite, it's time to change how you're using it.",
        cite: "A good rule to remember",
      },
    ],
    quiz: [
      {
        q: "Why is asking AI to \"explain this using a cooking analogy\" an effective strategy?",
        options: [
          "Analogies connect new ideas to things you already understand",
          "Analogies make the explanation shorter and faster to read",
          "Analogies force the AI to use simpler vocabulary",
        ],
        answer: 0,
        explain: "Linking a new concept to something familiar gives your brain a framework to attach it to. That makes it easier to understand and remember.",
      },
      {
        q: "Which request will help you remember chapter 4 best tomorrow?",
        options: [
          "\"Summarize chapter 4 so I can review the main points quickly.\"",
          "\"Write detailed notes on chapter 4 that I can study from.\"",
          "\"Quiz me on chapter 4 and explain anything I get wrong.\"",
        ],
        answer: 2,
        explain: "Retrieval practice combined with feedback is one of the most well-supported study strategies in learning research. Summaries and notes can help, but they don't make you recall the information yourself.",
      },
      {
        q: "What do all five study strategies in this lesson have in common?",
        options: [
          "They let the AI handle the hard parts so you can focus on reviewing",
          "They use AI to create situations where you have to think",
          "They work best when you give the AI as much text as possible",
        ],
        answer: 1,
        explain: "Quizzing, explaining, getting feedback, using analogies: each strategy puts your brain to work. That active effort is what leads to real learning.",
      },
    ],
  },
  {
    slug: "toolkit-boss",
    module: "toolkit",
    index: 4,
    kind: "boss",
    title: "The Prompt Arena",
    subtitle: "Put it all together: prompts, iteration, and verification",
    hook: "Time to show what you've learned. Six questions stand between you and the second layer of your neural build. Let's see how many you can get in a row.",
    minutes: 5,
    xp: 300,
    blocks: [
      {
        type: "lead",
        text: "This is the module challenge. You'll answer six questions covering everything in this unit: prompt ingredients, follow-up strategies, fact-checking, and study techniques. Answering correctly in a row builds a combo for bonus XP. If you miss one, your combo resets, but you can keep going.",
      },
      {
        type: "callout",
        variant: "nova",
        title: "How it works",
        text: "Each correct answer in a row adds +12 XP to your combo. Complete the challenge to unlock Layer 02 of your neural build and earn 300 base XP.",
      },
    ],
    quiz: [
      {
        q: "The five prompt ingredients are Role, Task, Context, Format, and...",
        options: ["Tone", "Constraints", "Examples", "Purpose"],
        answer: 1,
        explain: "Constraints set the limits of the response, such as length, vocabulary, or \"hints only.\" Without them, the AI has to guess where the boundaries are.",
      },
      {
        q: "Which follow-up is most likely to improve an AI's response?",
        options: [
          "\"Try again, but make it better.\"",
          "\"Can you make it longer and more detailed?\"",
          "\"Rewrite it in a more formal tone.\"",
          "\"Identify the three weakest points in your answer, then fix each one.\"",
        ],
        answer: 3,
        explain: "Asking the AI to critique its own work and then fix specific problems gives it clear direction. Vague requests like \"make it better\" leave it guessing.",
      },
      {
        q: "The AI gives you an impressive statistic for your presentation. Before using it, you should...",
        options: [
          "Trace it back to its original source",
          "Include a screenshot of the AI chat as your source",
          "Ask the AI where it found the statistic and cite that",
          "Add \"approximately\" in case the number is slightly off",
        ],
        answer: 0,
        explain: "Statistics are a common type of hallucination, and an AI can even invent the source it names. If you can't find the original source, don't use the statistic.",
      },
      {
        q: "How are fluency (how smooth the writing sounds) and accuracy related in AI output?",
        options: [
          "Fluent writing is usually a sign that the information is accurate",
          "Fluent writing is only a concern when the topic is technical",
          "They're unrelated: well-written text can still be completely wrong",
          "Less fluent writing is usually a sign that the AI is unsure",
        ],
        answer: 2,
        explain: "AI is designed to produce natural-sounding language, whether or not the content is true. Checking accuracy is your job.",
      },
      {
        q: "Which approach to studying with AI leads to the strongest learning?",
        options: [
          "Having the AI write summaries that you read and review",
          "Having the AI write notes that you memorize before the test",
          "Avoiding AI entirely, since any use of it hurts learning",
          "Having the AI quiz you and give feedback while you do the thinking",
        ],
        answer: 3,
        explain: "The goal is to use AI to create more practice for your brain, not to skip the practice. Quizzing with feedback keeps you actively thinking.",
      },
      {
        q: "You keep getting generic responses from an AI. What's the most likely cause?",
        options: [
          "Your prompt didn't include enough detail about the task, context, or format",
          "The AI tool you're using isn't powerful enough",
          "You gave the AI too much context, which confused it",
          "The topic is too complicated for AI to handle",
        ],
        answer: 0,
        explain: "Generic prompts are the most common cause of generic responses. Adding specifics about what you need is usually the fastest fix.",
      },
    ],
  },
];

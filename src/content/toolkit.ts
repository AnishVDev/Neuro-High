Here is the revised version of `TOOLKIT_LESSONS`. I kept all interactive IDs, badge references, scenario structures, and XP mechanics intact, while adopting a clearer Khan Academy-style tone and correcting overstated claims (such as models having "zero correlation" between confidence and accuracy, always defaulting to essays, or reliably critiquing their own mistakes without guidance, as well as updating the context around the 2023 federal court sanctions case).

```ts
import type { Lesson } from "./types";

export const TOOLKIT_LESSONS: Lesson[] = [
  {
    slug: "prompt-anatomy",
    module: "toolkit",
    index: 0,
    kind: "lesson",
    title: "What Makes an Effective Prompt",
    subtitle: "Five parts that help you get clearer, more useful responses",
    hook: "Typing 'write about the Civil War' usually gets you a broad, generic summary. Giving clear instructions and context makes it much more likely that you'll get a helpful response.",
    minutes: 8,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "When you leave out details in a prompt, a language model fills in the blanks based on common patterns in its training data. That often leads to vague or overly long answers. Treating your prompt like a clear set of instructions helps guide the response toward what you actually need. (And whenever you use AI for schoolwork, make sure to check your teacher's guidelines first.)",
      },
      {
        type: "steps",
        heading: "Five helpful parts of a prompt",
        steps: [
          {
            title: "Role: perspective and audience level",
            text: "Asking the model to respond like a patient biology tutor or a debate opponent helps set the tone, vocabulary, and level of detail.",
          },
          {
            title: "Task: the specific action",
            text: "Use a clear verb. Instead of 'help with my essay,' try 'list 4 possible counterarguments to my thesis.'",
          },
          {
            title: "Context: relevant background",
            text: "Include your grade level, what you have already studied, or the goal of your assignment. The model only knows what you share in the conversation.",
          },
          {
            title: "Format: how to organize the output",
            text: "Ask for bullet points, a 150-word paragraph, a comparison table, or practice questions. If you don't specify a format, the model chooses one on its own, which may be much longer than you need.",
          },
          {
            title: "Constraints: boundaries to follow",
            text: "Set clear limits, such as 'define any technical terms,' 'keep it under 200 words,' or 'give me hints without solving the problem.'",
          },
        ],
      },
      {
        type: "compare",
        heading: "Comparing two prompts on the same topic",
        weak: {
          label: "Vague prompt",
          text: "explain photosynthesis",
        },
        strong: {
          label: "Specific prompt",
          text: "Act as a biology tutor for a 10th-grade student. Explain photosynthesis in under 200 words using a cooking analogy, and define any technical terms you use. At the end, ask me 3 short questions to check my understanding.",
        },
        note: "Taking an extra 20 seconds to specify the level, format, and limits can save several rounds of back-and-forth.",
      },
      {
        type: "interactive",
        id: "prompt-builder",
        title: "Lab: The Prompt Forge",
        caption:
          "Combine the five parts to build a clear prompt and check your Signal Score. Vague requests score low, while specific instructions raise your score. Reach 90 or higher to earn the Promptsmith badge.",
      },
      {
        type: "callout",
        variant: "nova",
        title: "NOVA's tip",
        text: "You don't need all five parts every single time. A quick definition doesn't require a role or a long list of constraints. Still, when an answer feels too generic, checking which of these five parts is missing is an easy way to improve it.",
      },
      {
        type: "terms",
        terms: [
          {
            term: "Prompt",
            def: "The input you give a generative AI system, including your question, instructions, and background context.",
          },
          {
            term: "Prompt engineering",
            def: "The practice of writing and refining prompts so an AI system is more likely to produce useful, relevant outputs.",
          },
          {
            term: "Zero-shot prompting",
            def: "Asking a model to perform a task using instructions alone, without providing sample inputs or outputs in your prompt.",
          },
        ],
      },
    ],
    quiz: [
      {
        q: "Which prompt is most likely to produce a focused, useful response?",
        options: [
          "'history project help'",
          "'List 6 possible thesis statements about the causes of World War I for an 11th-grade history debate, ordered from widely accepted to more debated.'",
          "'wwi information please'",
          "'Tell me everything about World War I'",
        ],
        answer: 1,
        explain:
          "This prompt names a clear task, gives grade-level and class context, specifies the format (a list of 6), and explains how to organize them.",
      },
      {
        q: "What is the purpose of adding constraints to a prompt?",
        options: [
          "They make the computer's hardware run faster",
          "They set clear boundaries, such as word limits, 'define technical terms,' or 'hints only'",
          "They guarantee that every fact in the answer is verified",
          "They replace the need to state a task",
        ],
        answer: 1,
        explain:
          "Constraints set boundaries on length, tone, or how much help you want so the response stays focused on your goal.",
      },
      {
        q: "If you keep getting responses that feel too broad or slightly off-topic, what is usually the best first step?",
        options: [
          "Assume the model cannot answer questions on that subject",
          "Check where your prompt left out details about the task, context, or format",
          "Restart your browser and paste the exact same words",
          "Remove all punctuation from your prompt",
        ],
        answer: 1,
        explain:
          "When key details are missing, the model has to guess what you want. Clarifying your task, context, or desired format usually improves the result.",
      },
    ],
  },
  {
    slug: "iterate-like-pro",
    module: "toolkit",
    index: 1,
    kind: "lesson",
    title: "Improving Results Through Iteration",
    subtitle: "Treating the first response as a starting point",
    hook: "Your first prompt doesn't have to get everything right at once. Often, the most useful results come from reviewing the initial answer and following up with specific adjustments.",
    minutes: 7,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "Working with a chatbot is an iterative process. Once you see a first response, it becomes much easier to tell what needs adjusting, whether you want a simpler explanation, a different angle, or more concrete examples.",
      },
      {
        type: "list",
        heading: "Four helpful ways to follow up",
        style: "bolt",
        items: [
          {
            title: "Ask for distinct options",
            text: "'Give me 4 different ways to structure this introduction, from straightforward to story-driven.' Comparing options helps you decide what works best.",
          },
          {
            title: "Ask for targeted critique",
            text: "'Point out two places in my outline where a skeptical reader might ask for stronger evidence.' Chatbots tend to be agreeable unless you ask specifically for weak spots, and you should still decide for yourself which suggestions make sense.",
          },
          {
            title: "Adjust the level of detail",
            text: "'Explain step 2 in simpler terms' or 'Go deeper into how this equation is derived.' You can zoom out for the big picture or zoom in on one confusing detail.",
          },
          {
            title: "Include an example (few-shot prompting)",
            text: "If you need a specific format or coding style, paste a short sample into your prompt. Showing a concrete example is often clearer than describing a style with adjectives.",
          },
        ],
      },
      {
        type: "interactive",
        id: "scenario-deck",
        title: "Lab: Guide the conversation",
        caption:
          "Each of these four conversations has stalled. Choose the follow-up prompt that gives clearer direction and leads to a more helpful response.",
      },
      {
        type: "text",
        heading: "Breaking complex work into steps (prompt chaining)",
        body: [
          "Large tasks are much easier to manage when you break them into a sequence of smaller prompts, sometimes called prompt chaining. For example, you might start by brainstorming possible angles, pick the one you like best, draft a section on your own, and then ask for feedback against your assignment rubric.",
          "Notice who makes the decisions in that process. When you handle one small step at a time, you stay in charge of the ideas, structure, and final writing, using the tool to support your thinking rather than replace it.",
        ],
      },
      {
        type: "callout",
        variant: "key",
        title: "Key idea",
        text: "Treat the first output as a rough starting point. If a response misses the mark, a specific follow-up explaining what to change is usually much more effective than starting over.",
      },
    ],
    scenarios: [
      {
        setup:
          "You asked for feedback on your rough draft and got: 'This essay is well written! Great job!'—even though you know some parts are still weak.",
        choiceA: {
          label: "Take the compliment and turn in the draft as is",
          good: false,
          feedback:
            "Chatbots often default to polite praise unless you ask for specific areas to improve, which means you miss out on helpful revision ideas.",
        },
        choiceB: {
          label:
            "'Look closely at my reasoning. Point out my 3 weakest arguments and suggest how I could support each one better.'",
          good: true,
          feedback:
            "Asking for specific weaknesses against clear criteria gives you actionable feedback you can evaluate and use as you revise.",
        },
      },
      {
        setup:
          "You asked for ideas to organize a class presentation, and the response is a predictable three-point outline that feels dull.",
        choiceA: {
          label:
            "'Give me 4 alternative ways to organize this talk: one built around a case study, one structured as a question-and-answer, one comparing two viewpoints, and one concise overview.'",
          good: true,
          feedback:
            "Asking for distinct structures gives you real options to compare and adapt for your audience.",
        },
        choiceB: {
          label: "Settle for the dull outline and start making slides anyway",
          good: false,
          feedback:
            "Accepting a generic first attempt makes it harder to keep your audience engaged when one quick follow-up could have surfaced better structures.",
        },
      },
      {
        setup:
          "You asked for an explanation of mitosis, and the response is packed with dense terminology that is hard to follow.",
        choiceA: {
          label: "Reread the same paragraph five times and hope you remember it",
          good: false,
          feedback:
            "Passively rereading confusing text is much less effective than asking for a clearer explanation and testing your understanding.",
        },
        choiceB: {
          label:
            "'Explain mitosis step by step using an everyday analogy, define each key term in plain language, and then ask me 4 review questions.'",
          good: true,
          feedback:
            "Adjusting the explanation level and adding practice questions helps you understand the concept and check what you actually retained.",
        },
      },
      {
        setup:
          "You asked for help formatting practice code to match your computer science class's style guide, but the variable names and comments don't look like your class examples.",
        choiceA: {
          label:
            "Paste a sample from class: 'Follow the exact naming conventions, comment style, and indentation shown in this example.'",
          good: true,
          feedback:
            "Providing a concrete example (few-shot prompting) shows the exact pattern you want much more clearly than general descriptions.",
        },
        choiceB: {
          label: "Reply 'make it cleaner' and hope it matches your teacher's rules",
          good: false,
          feedback:
            "'Cleaner' means different things in different coding guides. Sharing an actual example removes the guesswork.",
        },
      },
    ],
    quiz: [
      {
        q: "When an AI tool's first response is too generic, what is usually the most effective next move?",
        options: [
          "Stop there, since follow-up messages rarely change the result",
          "Follow up with specific directions, such as asking for alternatives, examples, or a different level of detail",
          "Submit the exact same prompt again in all capital letters",
          "Accept the generic version without changing anything",
        ],
        answer: 1,
        explain:
          "Specific follow-up prompts let you steer the conversation, adjust the depth, or compare alternatives based on what was missing in the first answer.",
      },
      {
        q: "What is prompt chaining?",
        options: [
          "Pasting the exact same prompt into five different chatbots at once",
          "Combining ten unrelated questions into one long paragraph",
          "Breaking a complex task into a sequence of smaller, focused prompts that you guide step by step",
          "Repeating a question until you get a shorter answer",
        ],
        answer: 2,
        explain:
          "Prompt chaining splits a big project into manageable steps so you can review and direct the work at each stage.",
      },
      {
        q: "What does 'few-shot prompting' mean?",
        options: [
          "You are only allowed a few questions per session",
          "You include a few examples of the pattern or style you want inside your prompt",
          "You keep your prompt under five words",
          "You ask the model to guess your question without context",
        ],
        answer: 1,
        explain:
          "In few-shot prompting, you provide sample inputs or outputs in your prompt so the model can follow that pattern.",
      },
    ],
  },
  {
    slug: "trust-verify",
    module: "toolkit",
    index: 2,
    kind: "lesson",
    title: "Verifying AI-Generated Information",
    subtitle: "Spotting errors, checking sources, and reading laterally",
    hook: "A chatbot can present an inaccurate date, statistic, or citation in clear, confident prose. Because the model doesn't automatically know when it is wrong, checking important claims is up to you.",
    minutes: 8,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "Language models generate text by predicting likely continuations, which means accurate facts and invented details can look equally polished on screen. General explanations of common topics are often helpful, but specific claims—such as dates, quotes, statistics, and citations—always need an outside check.",
      },
      {
        type: "text",
        heading: "A real-world lesson from a federal courtroom",
        body: [
          "In 2023, attorneys in a U.S. federal court case submitted a legal brief citing six court decisions generated with ChatGPT. None of those six cases actually existed; the case names, citations, and internal quotes had been fabricated.",
          "When one of the attorneys had asked the chatbot whether the cases were real, it assured him they were and could be found in standard legal databases. A federal judge ultimately sanctioned two lawyers and their firm—a memorable reminder that polished formatting and confident reassurance are no substitute for checking original sources.",
        ],
      },
      {
        type: "steps",
        heading: "A practical four-step verification check",
        steps: [
          {
            title: "Spot specific, checkable claims",
            text: "Pay close attention to dates, numbers, direct quotes, study findings, named articles, court cases, and historical details.",
          },
          {
            title: "Step outside the chat",
            text: "Don't rely on asking the chatbot, 'Are you sure?' It may confidently repeat an error—or even back down from a correct answer. Open a search engine or library database instead.",
          },
          {
            title: "Trace the claim to its source",
            text: "Find the primary source: the actual published paper, official agency dataset, or original text, rather than a secondhand summary.",
          },
          {
            title: "Treat AI output as a starting lead",
            text: "Use the response to gather search terms and ideas to investigate, then rely on and cite the verified sources you actually read.",
          },
        ],
      },
      {
        type: "interactive",
        id: "hallucination-hunt",
        title: "Lab: Source Check",
        caption:
          "Review the six AI-generated claims below. Some are accurate, while others contain fabricated facts or sources. Flag every inaccurate claim to earn the Hallucination Hunter badge.",
      },
      {
        type: "callout",
        variant: "warn",
        title: "Why tone isn't evidence",
        text: "How confident a chatbot sounds is not a reliable indicator of whether it is right. Sometimes a model expresses uncertainty, and other times it states a completely invented citation as plain fact. Judge a claim by outside evidence, not by how smoothly it reads.",
      },
      {
        type: "list",
        heading: "Your verification toolkit",
        style: "check",
        items: [
          {
            text: "Read laterally: open a new tab and check what independent, reputable sources say about the claim or source.",
          },
          {
            text: "Search exact quotes and statistics: real quotes and published numbers usually trace back to original documents, while invented ones leave no trail.",
          },
          {
            text: "Use strong reference sources: school library databases, peer-reviewed journals, and official government or university publications are much more reliable than unverified chat output.",
          },
          {
            text: "Question vague phrases like 'studies show': look up the specific authors, journal, and year, and verify what the researchers actually found.",
          },
        ],
      },
    ],
    quiz: [
      {
        q: "A chatbot cites 'Martinez et al., 2021, Journal of Applied Psychology.' What should you do before using that source?",
        options: [
          "Include it in your bibliography since the citation format looks complete",
          "Search a library database or academic index to confirm the paper exists and actually says what the chatbot claims",
          "Ask the chatbot 'Is this a real paper?' and rely on its answer",
          "Remove the year so you don't have to verify the exact issue",
        ],
        answer: 1,
        explain:
          "Language models can generate realistic-looking citations for articles that do not exist, or misstate what a real article says. Always verify the actual source.",
      },
      {
        q: "Why is asking a chatbot 'Are you sure?' an unreliable way to check a fact?",
        options: [
          "It uses too many tokens to run a search",
          "The model can sound just as confident repeating an inaccurate claim—or apologize when it was actually right",
          "It automatically erases your previous prompts",
          "Chatbots are programmed to refuse follow-up questions about facts",
        ],
        answer: 1,
        explain:
          "Asking the same model to confirm its own claim does not replace independent evidence. Real verification requires checking reliable outside sources.",
      },
      {
        q: "What is the safest way to treat specific facts or sources suggested by a chatbot?",
        options: [
          "As verified quotations ready to paste into an assignment",
          "As starting leads that you verify using reliable primary or reference sources",
          "As proof that no further research is needed",
          "As guaranteed summaries of peer-reviewed databases",
        ],
        answer: 1,
        explain:
          "Chatbots can help point you toward topics and terms to search, but any factual claim you rely on should be confirmed in a trustworthy source.",
      },
    ],
  },
  {
    slug: "study-moves",
    module: "toolkit",
    index: 3,
    kind: "lesson",
    title: "Using AI to Study Effectively",
    subtitle: "Turning a chatbot into a practice and review partner",
    hook: "You learn the most when you actively work through ideas yourself. Used thoughtfully, AI can generate practice questions, analogies, and feedback while keeping your own thinking at the center.",
    minutes: 7,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "Research in cognitive psychology points to a few study habits that consistently build long-term understanding: retrieval practice (recalling information from memory rather than just rereading), spacing study sessions over time, and checking your mistakes with feedback. All three require active effort from you. AI can help create extra opportunities to practice—as long as you ground it in your class notes, double-check explanations that seem off, and follow your teacher's rules.",
      },
      {
        type: "list",
        heading: "Five active study strategies",
        style: "bolt",
        items: [
          {
            title: "Guided questioning (Socratic style)",
            text: "'I'm stuck on this quadratic equation. Don't give me the answer—ask me guiding questions one step at a time.' This helps you work through the reasoning yourself.",
          },
          {
            title: "Custom practice quizzes",
            text: "Paste in your study guide or notes and ask: 'Create 8 practice questions of mixed difficulty. Ask them one at a time and wait for my response before explaining.' Check any surprising answers against your textbook.",
          },
          {
            title: "Explain it in your own words",
            text: "Write out your own explanation of a concept, share your textbook definition, and ask the model to point out anything unclear or missing in your version. Explaining an idea is a great way to spot gaps in your understanding.",
          },
          {
            title: "Tailored analogies",
            text: "'Explain entropy using an analogy from cooking or basketball, then connect each part of the analogy back to the actual physics terms.' Linking new concepts to familiar ideas can make abstract topics click.",
          },
          {
            title: "Focused feedback without rewriting",
            text: "'Read my rough draft, identify 3 places where my evidence or reasoning is unclear, and ask me questions to help me revise them myself. Do not rewrite my sentences.' You get constructive feedback while keeping your own voice.",
          },
        ],
      },
      {
        type: "compare",
        heading: "Two ways to approach the same assignment",
        weak: {
          label: "Skipping the thinking",
          text: "'Write my essay on ambition in Macbeth.' Turning in AI-written work violates academic integrity rules in most classes, and it leaves you unprepared when you have to discuss or test on the play yourself.",
        },
        strong: {
          label: "Supporting your thinking",
          text: "'Here are my notes on ambition in Macbeth. Quiz me with 5 short-answer questions one at a time, and tell me which scenes or details I should review when my answer is incomplete.'",
        },
        note: "Both prompts use the same tool, but only the second one builds your own knowledge and skills.",
      },
      {
        type: "callout",
        variant: "nova",
        title: "NOVA's tip",
        text: "Try pasting your own class notes or vocabulary list into these study prompts. Giving the model your exact course material keeps practice questions focused on what your class covers and reduces factual slip-ups.",
      },
      {
        type: "quote",
        text: "A good study tool reduces busywork while asking you to think more deeply—not the other way around.",
        cite: "A practical rule of thumb for studying with AI",
      },
    ],
    quiz: [
      {
        q: "Which study prompt is most likely to help you remember a chapter on tomorrow's quiz?",
        options: [
          "'Summarize chapter 4 in three sentences so I don't have to read it'",
          "'Using my notes from chapter 4 below, quiz me one question at a time and explain anything I miss'",
          "'Write a set of chapter 4 study notes for me'",
          "'List the headings in chapter 4'",
        ],
        answer: 1,
        explain:
          "Actively recalling answers from memory (retrieval practice) and reviewing feedback on your mistakes strengthens memory far more than passively skimming a summary.",
      },
      {
        q: "What do all five active study strategies in this lesson have in common?",
        options: [
          "They let the AI complete the assignment so you can save time",
          "They use AI to set up questions, analogies, or feedback where you still do the thinking",
          "They require writing prompts that are at least 500 words long",
          "They replace the need to read your textbook or class notes",
        ],
        answer: 1,
        explain:
          "Whether you are answering quiz questions, explaining a concept in your own words, or revising from feedback, real learning happens when you actively process the material.",
      },
      {
        q: "Why can asking for an analogy tied to something you know well (like cooking or sports) help you learn a tough concept?",
        options: [
          "Analogies replace technical definitions on science exams",
          "Connecting unfamiliar ideas to concepts you already understand makes new material easier to grasp",
          "It forces the model to verify its facts in an outside database",
          "Short analogies guarantee there are no oversimplifications",
        ],
        answer: 1,
        explain:
          "Analogies help bridge what you already know and a new concept—especially when you also connect the analogy back to the actual course terms.",
      },
    ],
  },
  {
    slug: "toolkit-boss",
    module: "toolkit",
    index: 4,
    kind: "boss",
    title: "Toolkit Challenge",
    subtitle: "Review prompt design, iteration, verification, and study strategies",
    hook: "Ready to put Module 02 together? Answer these six questions to test your skills and unlock the second layer of your network.",
    minutes: 5,
    xp: 300,
    blocks: [
      {
        type: "lead",
        text: "This six-question challenge reviews the main skills from Module 02: writing clear prompts, refining results with follow-ups, verifying factual claims, and using AI to support active studying.",
      },
      {
        type: "callout",
        variant: "nova",
        title: "Challenge rules",
        text: "Consecutive correct answers build your combo for +12 bonus XP per step. Missing a question resets your combo, though you can retry it. Complete all six questions to earn 300 base XP and unlock Layer 02 of your network.",
      },
    ],
    quiz: [
      {
        q: "In this module's framework, the five parts of a clear prompt are Role, Task, Context, Format, and…",
        options: ["Praise", "Constraints", "Capital letters", "Search links"],
        answer: 1,
        explain:
          "Constraints set helpful boundaries—such as length limits, 'define technical terms,' or 'give hints only.'",
      },
      {
        q: "Which follow-up prompt is most likely to help you improve a weak outline?",
        options: [
          "'Try again'",
          "'Looks good, thanks'",
          "'Identify the three weakest points in this outline and suggest what evidence or examples would make them stronger'",
          "'Make it better please'",
        ],
        answer: 2,
        explain:
          "Asking for specific weaknesses and targeted improvements gives you concrete ideas to evaluate, whereas vague requests like 'try again' leave the goal unclear.",
      },
      {
        q: "A chatbot gives you a striking statistic for a class presentation. What should you do before putting it on a slide?",
        options: [
          "Take a screenshot of the chat as your source citation",
          "Track down the original study or official dataset to confirm the number is real and accurately described",
          "Round the number slightly so it sounds more approximate",
          "Keep it as long as the chatbot named an organization",
        ],
        answer: 1,
        explain:
          "Chatbots can invent or misquote statistics even while naming real organizations. If you cannot verify a statistic in a reliable original source, do not use it.",
      },
      {
        q: "In AI-generated writing, fluency and factual accuracy are…",
        options: [
          "Always identical",
          "Guaranteed whenever a citation is included",
          "Separate qualities—clear, confident writing can still contain factual errors",
          "Easy to tell apart just by checking grammar",
        ],
        answer: 2,
        explain:
          "A language model can produce smooth, grammatical prose whether a specific claim is accurate or mistaken, which is why outside verification matters.",
      },
      {
        q: "Which pattern represents the most effective way to study with AI?",
        options: [
          "Having AI write your homework answers while you copy them down",
          "Using AI to generate retrieval practice and feedback while you recall and work through the answers yourself",
          "Memorizing AI summaries instead of reading assigned texts",
          "Asking AI to rewrite your rough drafts from scratch",
        ],
        answer: 1,
        explain:
          "Active recall, working through problems step by step, and revising your own work build genuine understanding that sticks on exams and in class.",
      },
      {
        q: "If a prompt produces a vague, generic response, what is the first thing you should check?",
        options: [
          "Whether the server is running slowly",
          "Whether your prompt left out key details about the task, context, or desired format",
          "Whether you forgot to say 'please'",
          "Whether your device screen is too small",
        ],
        answer: 1,
        explain:
          "Vague prompts leave the model to guess what you want. Adding clearer context, format instructions, or constraints is usually the quickest fix.",
      },
    ],
  },
];
```

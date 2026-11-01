import type { Lesson } from "./types";

export const ETHICS_LESSONS: Lesson[] = [
  {
    slug: "where-is-the-line",
    module: "ethics",
    index: 0,
    kind: "lesson",
    title: "Where Is the Line?",
    subtitle: "Academic integrity when AI help is always available",
    hook: "AI can help you think through an assignment, or it can do the assignment for you. Only one of those helps you learn. This lesson looks at where that line falls and how to stay on the right side of it.",
    minutes: 7,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "Some cases are easy to judge. Asking AI to suggest possible essay topics is usually fine. Asking it to write your essay so you can turn it in as your own is not. The harder questions fall between those two extremes, and those are the ones this lesson focuses on.",
      },
      {
        type: "text",
        heading: "A range of help",
        body: [
          "Think about working with a coach. A coach who watches your form, suggests drills, and gives you feedback is helping you improve, because you are still doing the work. A coach who does the exercises for you might make the results look good, but you don't get any stronger.",
          "Assignments work in a similar way. Their purpose is to help you build skills like reasoning, writing, and problem-solving. When AI does that thinking for you, you may finish the assignment, but you miss the learning it was designed to create.",
        ],
      },
      {
        type: "list",
        heading: "Often acceptable (always check your teacher's policy)",
        style: "check",
        items: [
          { text: "Brainstorming possible topics, angles, or research questions" },
          { text: "Getting feedback on a draft you wrote, then revising it yourself" },
          { text: "Generating practice questions or asking for explanations of concepts you find confusing" },
          { text: "Organizing your own ideas into an outline" },
        ],
      },
      {
        type: "list",
        heading: "Usually not acceptable",
        style: "x",
        items: [
          { text: "Submitting AI-generated writing as your own work without permission and disclosure" },
          { text: "Including AI-generated citations, quotes, or facts that you have not checked" },
          { text: "Having AI complete the specific task the assignment is meant to assess" },
          { text: "Using AI during a test, or on any assignment where your teacher has said not to" },
        ],
      },
      {
        type: "callout",
        variant: "key",
        title: "The transparency test",
        text: "Ask yourself: 'If my teacher read this entire conversation, every prompt and every response, would I be comfortable with how I used AI?' If the answer is yes, you are probably on solid ground. If you hesitate, that's a sign to rethink your approach or ask your teacher.",
      },
      {
        type: "text",
        heading: "Making disclosure a habit",
        body: [
          "AI policies vary from teacher to teacher and even from assignment to assignment. A use that's allowed in one class might count as misconduct in another. One habit that helps in every situation is disclosure: briefly explaining how you used AI. For example: 'I used ChatGPT to brainstorm topics and get feedback on my outline. The analysis and writing are my own.'",
          "Disclosure shows that you are being honest about your process, and it gives your teacher the information they need to evaluate your work fairly. It does not make a prohibited use acceptable, though. If you aren't sure whether something is allowed, ask before you start, not after you submit.",
        ],
      },
    ],
    scenarios: [
      {
        setup:
          "It's 11 p.m., your essay is due tomorrow, and you haven't started. You open a chatbot.",
        choiceA: {
          label: "'Write me 900 words on the New Deal.' Then submit whatever it produces.",
          good: false,
          feedback:
            "Submitting AI-written work as your own is a clear academic integrity violation. It also leaves you unprepared for in-class writing or tests on the same material.",
        },
        choiceB: {
          label:
            "'Here are my three rough ideas. Help me choose the strongest one and organize my argument. I'll write it, and then you can give me feedback.'",
          good: true,
          feedback:
            "You're still doing the thinking and the writing, even under time pressure. As long as your teacher allows this kind of help, you keep both the learning and your integrity.",
        },
      },
      {
        setup:
          "A friend offers you a set of prompts that supposedly rewrite AI text so detection tools can't flag it.",
        choiceA: {
          label: "Decline, and consider talking to your friend about it",
          good: true,
          feedback:
            "AI detectors are unreliable, but that isn't the real issue. Disguising writing you didn't produce is still submitting someone else's work as your own.",
        },
        choiceB: {
          label: "Use the prompts since they seem foolproof",
          good: false,
          feedback:
            "Getting caught is only one risk. The bigger cost is skipping the skills the assignment was meant to build, which you'll need later.",
        },
      },
      {
        setup:
          "You used AI to help you understand a difficult concept. Then you wrote the assignment entirely on your own, citing real sources you read yourself.",
        choiceA: {
          label: "Add a short note: 'I used AI to help me understand X. All writing is my own.'",
          good: true,
          feedback:
            "A brief disclosure documents your honest process and removes any uncertainty about how you used AI.",
        },
        choiceB: {
          label: "Say nothing and hope it never comes up",
          good: false,
          feedback:
            "You didn't do anything wrong, but staying silent can create unnecessary doubt. A quick note makes your process clear.",
        },
      },
      {
        setup:
          "The assignment instructions say 'no AI assistance.' Using AI just to brainstorm ideas seems harmless to you.",
        choiceA: {
          label: "Follow the rule as written, or ask your teacher to clarify what counts",
          good: true,
          feedback:
            "When a rule is stated clearly, it's your teacher's decision what counts, not yours. Asking a clarifying question is always a reasonable choice.",
        },
        choiceB: {
          label: "Use it anyway, since brainstorming probably doesn't count",
          good: false,
          feedback:
            "'No AI assistance' can include brainstorming. If you think there might be an exception, ask first instead of assuming.",
        },
      },
    ],
    quiz: [
      {
        q: "Which use of AI is most likely to be consistent with academic integrity (assuming your teacher allows AI feedback)?",
        options: [
          "'Write a conclusion for my essay'",
          "'Here's my draft. Point out weak reasoning and ask me questions so I can fix it myself'",
          "'Reword this AI-generated text so detectors won't flag it'",
          "'Summarize the book I was assigned so I don't have to read it'",
        ],
        answer: 1,
        explain:
          "Getting feedback on your own work keeps the thinking and writing in your hands. The other options have AI do the work the assignment is meant to build.",
      },
      {
        q: "What question does the transparency test ask?",
        options: [
          "Did you save a copy of the chat?",
          "If your teacher read your entire AI conversation, would you be comfortable with how you used it?",
          "Did you use a paid version of the tool?",
          "Did the AI include citations?",
        ],
        answer: 1,
        explain:
          "This question helps you judge unclear situations by considering whether your process would hold up to an honest look.",
      },
      {
        q: "Which habit is most helpful across different classes and AI policies?",
        options: [
          "Always using the newest AI model",
          "Deleting your chat history",
          "Clearly disclosing how you used AI, and asking when you're unsure",
          "Using AI only on weekends",
        ],
        answer: 2,
        explain:
          "Disclosure and asking questions keep your process transparent. They don't make a prohibited use acceptable, but they help you avoid misunderstandings.",
      },
    ],
  },
  {
    slug: "bias",
    module: "ethics",
    index: 1,
    kind: "lesson",
    title: "How Bias Gets into AI",
    subtitle: "Where bias comes from and why its effects can spread",
    hook: "AI systems can reflect unfair patterns from the data they learn from and the choices people make when building them. Because these systems can make many decisions quickly, those patterns can affect a large number of people. Remember the imbalanced data in the Module 01 lab? This lesson looks at what happens when the stakes are real.",
    minutes: 7,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "A model's behavior is shaped by its training data and by the decisions of the people who design it. If the data reflects past unfairness, or if key groups are underrepresented, the model can learn and repeat those patterns.",
      },
      {
        type: "text",
        heading: "How bias can enter a system",
        body: [
          "Developers rarely set out to build a biased system. Bias usually enters through the data and design choices. For example, if a hiring model is trained on years of past hiring decisions from a company that mostly hired one type of candidate, the model may learn to favor applicants who resemble those past hires. A chatbot trained on large amounts of internet text can pick up stereotypes that appear in that text.",
          "Bias can also come from how data is labeled, what the system is designed to predict, and how it is tested and used. Part of the risk is that a computer's output can seem neutral and objective, which may make people less likely to question it.",
        ],
      },
      {
        type: "stat",
        stats: [
          {
            value: "34.7%",
            label: "highest error rate for darker-skinned women in a 2018 study of commercial gender-classification systems*",
          },
          {
            value: "0.8%",
            label: "highest error rate for lighter-skinned men in the same study*",
          },
          {
            value: "2018",
            label: "year Reuters reported that Amazon had abandoned an experimental recruiting tool that downgraded résumés containing the word 'women's'",
          },
        ],
        note: "*Gender Shades study by Joy Buolamwini and Timnit Gebru, which tested systems from three companies. The research drew wide attention to differences in how well facial analysis tools performed across groups.",
      },
      {
        type: "callout",
        variant: "nova",
        title: "NOVA's tip",
        text: "When an AI tool makes claims about people, such as cultures, genders, or neighborhoods, ask: What kinds of data might have shaped this answer? Whose perspectives might be missing?",
      },
      {
        type: "steps",
        heading: "What you can do",
        steps: [
          {
            title: "Ask about the data and design",
            text: "Ask what a system was trained on and how it was tested. If the data left out certain groups or situations, the system may perform poorly for them.",
          },
          {
            title: "Check claims about people",
            text: "Compare AI-generated claims about groups of people with reliable sources, including sources written by members of those groups.",
          },
          {
            title: "Ask for multiple perspectives",
            text: "Prompts like 'Describe several viewpoints on this issue and the evidence behind each' can help you see beyond a single framing.",
          },
          {
            title: "Report problems",
            text: "Many tools include a way to flag responses. Reporting biased or harmful output gives developers information they can use to improve the system.",
          },
        ],
      },
      {
        type: "quote",
        text: "An AI system does not have intentions, but it can still repeat unfair patterns from the world it learned from. That's why people need to examine and test it.",
        cite: "Why human oversight matters",
      },
    ],
    quiz: [
      {
        q: "Which statement best describes where AI bias comes from?",
        options: [
          "Programmers deliberately add it to every system",
          "Patterns in training data, along with choices about how a system is designed, tested, and used",
          "Random hardware errors",
          "The color scheme of the app",
        ],
        answer: 1,
        explain:
          "Training data is a major source of bias, but design decisions, labeling, and how a system is used also matter.",
      },
      {
        q: "Why can bias in an AI system have especially wide effects?",
        options: [
          "It can affect a large number of decisions, and its output may appear objective",
          "It can type faster than people",
          "It runs at all hours",
          "It can vote in elections",
        ],
        answer: 0,
        explain:
          "One system can be applied to many people, and its output can seem neutral, which may make biased results harder to notice and question.",
      },
      {
        q: "What is a good everyday response when an AI tool makes claims about a group of people?",
        options: [
          "Accept it, because computers are neutral",
          "Check the claim against reliable sources, including those from the people being described",
          "Close the app and ignore the topic",
          "Ask it to be '20% less biased'",
        ],
        answer: 1,
        explain:
          "Checking outside sources, especially perspectives from the people being described, is more reliable than trusting the tool's output.",
      },
    ],
  },
  {
    slug: "synthetic-world",
    module: "ethics",
    index: 2,
    kind: "lesson",
    title: "Deepfakes and False Information",
    subtitle: "How to evaluate media when images and audio can be faked",
    hook: "For a long time, a photo or video was treated as strong evidence that something happened. Today, AI tools can create realistic images, audio, and video, so media on its own is no longer enough proof. This lesson gives you a practical way to check what you see.",
    minutes: 7,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "Generative AI can create faces, voices, photos, and videos that are realistic enough to fool many people, including experienced journalists. Looking for visual mistakes can help, but the most reliable skill is checking where the content came from.",
      },
      {
        type: "text",
        heading: "Shifting from 'how does it look?' to 'where did it come from?'",
        body: [
          "Early AI-generated images often had obvious flaws, such as extra fingers or distorted backgrounds. Newer tools make these mistakes less often, so visual clues are no longer a dependable way to judge whether something is real. A real image can also look strange, and a fake one can look perfect.",
          "Because of this, a better approach is to ask: Who created or shared this? Do credible, independent sources report the same thing? This builds on the verification skills from Module 02.",
        ],
      },
      {
        type: "steps",
        heading: "The SIFT method",
        steps: [
          {
            title: "Stop",
            text: "Pause before you share or react. If a post makes you feel strong emotions quickly, that's a good reason to check it carefully.",
          },
          {
            title: "Investigate the source",
            text: "Who posted it? What else have they posted? Is the account new, anonymous, or known for misleading content?",
          },
          {
            title: "Find better coverage",
            text: "Look for reports from credible, independent sources. Real events of public interest are usually covered by more than one reliable outlet.",
          },
          {
            title: "Trace claims to the original context",
            text: "Quotes, clips, and images are often cropped or shared without context. Find the original source to understand what actually happened.",
          },
        ],
      },
      {
        type: "callout",
        variant: "warn",
        title: "Watch for emotional urgency",
        text: "False or misleading content is often designed to provoke strong reactions, such as outrage, fear, or excitement, and to get you to share it quickly. Pressure to 'share this now' is a warning sign. Accurate information will still be accurate after you take a few minutes to check it.",
      },
      {
        type: "list",
        heading: "Why this matters for students",
        style: "bolt",
        items: [
          {
            text: "Fake screenshots or images of classmates can be used for bullying. Don't believe or share them without strong evidence that they are real.",
          },
          {
            text: "Voice-cloning tools can imitate a person using a short audio sample. If you get an urgent call asking for money or personal information, even from a familiar voice, hang up and contact the person through a number you know is theirs. Some families agree on a code word for emergencies.",
          },
          {
            text: "Photos, videos, and audio you post publicly can be copied and potentially used to create fake content. Think about what you share and who can see it.",
          },
        ],
      },
    ],
    quiz: [
      {
        q: "A shocking video of a public figure is spreading quickly online. What is the most reliable first step?",
        options: [
          "Zoom in and look for visual glitches",
          "Check who originally posted it and whether credible outlets independently report it",
          "Share it with the caption 'not sure if this is real'",
          "Assume it's real because it's a video",
        ],
        answer: 1,
        explain:
          "Checking the source and looking for independent coverage is more reliable than searching for visual flaws. This follows the SIFT method.",
      },
      {
        q: "Which feature is a common warning sign in misleading content?",
        options: [
          "It uses a formal tone",
          "It's designed to trigger a strong emotion and make you share it right away",
          "It includes many citations",
          "It's long and detailed",
        ],
        answer: 1,
        explain:
          "Emotional urgency is a common tactic in misleading content. Taking time to verify helps you avoid spreading false information.",
      },
      {
        q: "You get a call from an unknown number. The voice sounds like your friend, and they urgently ask you to buy gift cards. What should you do?",
        options: [
          "Help right away, since you recognize the voice",
          "Hang up and contact your friend directly using a number you know is theirs",
          "Keep talking until you're sure the voice is real",
          "Agree to send a smaller amount",
        ],
        answer: 1,
        explain:
          "Voices can be imitated with AI. Contacting the person through a separate, trusted channel is the safest way to confirm the request.",
      },
    ],
  },
  {
    slug: "your-data",
    module: "ethics",
    index: 3,
    kind: "lesson",
    title: "Protecting Your Data",
    subtitle: "Privacy, citing AI, and taking responsibility for your work",
    hook: "What you type into a chatbot may be stored and, depending on the service and your settings, reviewed or used to improve the system. In this final lesson of Module 03, you'll learn how to protect personal information and how to credit AI properly.",
    minutes: 6,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "Many AI tools store conversations. Depending on the provider and your settings, some conversations may be reviewed by people or used to train future models. This doesn't mean you should avoid AI tools, but it does mean you should understand what happens to the information you share.",
      },
      {
        type: "text",
        heading: "Information to keep out of chatbots",
        body: [
          "A helpful rule: don't enter anything you wouldn't be comfortable having other people read. Avoid sharing your full name together with your address or daily schedule, passwords, ID numbers, or private family details. Other people's private information, such as a friend's health issues or personal messages, isn't yours to share.",
          "Also be careful with material that isn't yours to distribute, such as someone else's unpublished writing or confidential documents. In future jobs, you may be required to keep certain information private, so checking whether you're allowed to share something before pasting it into a tool is a useful habit to build now.",
        ],
      },
      {
        type: "list",
        heading: "Privacy habits for using AI",
        style: "check",
        items: [
          {
            text: "Remove names and identifying details. 'A friend who is struggling in chemistry' works just as well as a real name.",
          },
          {
            text: "Review the tool's privacy and data settings. Many services let you limit whether your conversations are used for training.",
          },
          {
            text: "Know whether you're using a school account or a personal account. They may have different rules and privacy protections.",
          },
          {
            text: "Assume that anything you enter could be stored or seen by others, and write your prompts with that in mind.",
          },
        ],
      },
      {
        type: "text",
        heading: "Giving credit: how to cite AI",
        body: [
          "When AI contributes to your work, you should acknowledge it. Both APA and MLA have published guidance on citing generative AI. These citations typically include the tool's name, its creator, the version or date you used it, and information about your prompt. APA also suggests explaining how you used the tool in your paper and, for longer exchanges, including the full conversation in an appendix. If your teacher requires a specific format or disclosure statement, follow your teacher's instructions.",
          "Citing AI does more than satisfy a requirement. It shows readers exactly how your work was produced and demonstrates that you're using these tools thoughtfully and honestly.",
        ],
      },
      {
        type: "callout",
        variant: "key",
        title: "You are responsible for your work",
        text: "If you submit work that AI helped produce, you are responsible for what it contains, including errors, biased statements, or invented citations. Saying 'the AI wrote that' does not shift responsibility away from you. That's why checking AI-assisted work before you submit it is essential.",
      },
    ],
    quiz: [
      {
        q: "Which of these is appropriate to enter into a chatbot?",
        options: [
          "A classmate's private counseling notes, so you can get a summary",
          "A general question about managing homework stress, with no names or identifying details",
          "Your home address, so it can give you local weather tips",
          "Your friend's password, so you can troubleshoot their account",
        ],
        answer: 1,
        explain:
          "General questions without personal details are fine. Sensitive information, whether yours or someone else's, should stay out of chatbots.",
      },
      {
        q: "If AI significantly contributed to your assignment, what should you do?",
        options: [
          "Keep it to yourself",
          "Cite the tool and describe how you used it, following your class's required format",
          "Tell only your friends",
          "Delete the conversation",
        ],
        answer: 1,
        explain:
          "APA and MLA both provide guidance for citing AI, and your teacher's requirements take priority. Clear acknowledgment is part of honest scholarship.",
      },
      {
        q: "An AI-assisted paragraph you submitted turns out to contain a passage copied from another source without credit. Who is responsible?",
        options: [
          "The AI company",
          "No one, since it was an accident",
          "You, because you submitted the work",
          "The author of the original passage",
        ],
        answer: 2,
        explain:
          "The person who submits the work is responsible for its content. This is why it's important to review and verify anything AI helps you produce.",
      },
    ],
  },
  {
    slug: "ethics-boss",
    module: "ethics",
    index: 4,
    kind: "boss",
    title: "Ethics Challenge",
    subtitle: "Review academic integrity, bias, verification, and data privacy",
    hook: "This is the final challenge. Answer six questions about the ethics of using AI to unlock Layer 03. If you've completed every module, your full network will light up.",
    minutes: 5,
    xp: 300,
    blocks: [
      {
        type: "lead",
        text: "This six-question challenge reviews the main ideas from Module 03: academic integrity, bias in AI systems, verifying information, and protecting personal data.",
      },
      {
        type: "callout",
        variant: "nova",
        title: "Challenge rules",
        text: "Consecutive correct answers build your combo for +12 bonus XP per step. A missed question resets your combo. Complete the challenge to finish Module 03 and earn the Team Human badge.",
      },
    ],
    quiz: [
      {
        q: "Which statement best describes the line between appropriate AI help and cheating?",
        options: [
          "Whether you get caught",
          "Whether the AI wrote any words at all",
          "Whether you did the thinking and skill-building the assignment requires, within your teacher's rules",
          "What time of day you used the tool",
        ],
        answer: 2,
        explain:
          "Like a coach who gives feedback versus one who does the exercises for you, appropriate help supports your work instead of replacing it.",
      },
      {
        q: "Your teacher says 'no AI on this assignment,' but you already used AI to brainstorm before you saw the rule. What should you do?",
        options: [
          "Say nothing, since brainstorming probably doesn't count",
          "Set aside the AI ideas and do the brainstorming yourself, or talk to your teacher about it",
          "Use only half of the AI's ideas",
          "Cite the AI and continue as planned",
        ],
        answer: 1,
        explain:
          "Your teacher's stated rule takes priority over your own interpretation. Talking to your teacher openly is the safest choice.",
      },
      {
        q: "Why can bias in an AI system have wider effects than bias in a single person?",
        options: [
          "It can't; the effects are always identical",
          "One system can influence a large number of decisions, and its output can appear objective",
          "Because robots are frightening",
          "Because AI output is always wrong",
        ],
        answer: 1,
        explain:
          "The scale at which AI systems are used, combined with the appearance of objectivity, can make biased results spread widely and go unquestioned.",
      },
      {
        q: "A shocking clip is going viral, but no credible outlets have reported on it yet. What's the best response?",
        options: [
          "Share it right away with a reaction caption",
          "Use SIFT: stop, investigate the source, find better coverage, and trace it to the original context",
          "Comment 'fake?' and let other people decide",
          "Assume it's true until someone proves otherwise",
        ],
        answer: 1,
        explain:
          "Checking the source and looking for credible coverage is more reliable than relying on how the clip looks or what others say.",
      },
      {
        q: "Which of these is appropriate to enter into a chatbot?",
        options: [
          "A general question about time management, with no personal details",
          "Your login information, to test the tool",
          "A friend's private messages, so you can get a summary",
          "Your full name, address, and daily routine",
        ],
        answer: 0,
        explain:
          "General questions without identifying details usually get equally helpful answers and keep your information private.",
      },
      {
        q: "Who is responsible for the accuracy of AI-assisted work that you submit?",
        options: [
          "The company that made the AI model",
          "The open-source community",
          "You, as the person submitting the work",
          "You and the AI share responsibility equally",
        ],
        answer: 2,
        explain:
          "When you submit work, you take responsibility for its content. That's why reviewing and verifying AI-assisted work matters.",
      },
    ],
  },
];

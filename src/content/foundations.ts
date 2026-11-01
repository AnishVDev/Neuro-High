import type { Lesson } from "./types";

export const FOUNDATIONS_LESSONS: Lesson[] = [
  {
    slug: "not-magic",
    module: "foundations",
    index: 0,
    kind: "lesson",
    title: "It's Not Magic, It's Math",
    subtitle: "What AI actually is, and what it isn't",
    hook: "AI in movies usually means robots with plans of their own. Real AI is much less dramatic, but it already plays a part in many decisions that affect you every day.",
    minutes: 6,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "When your phone unlocks with your face, when a music app builds a playlist you enjoy, or when your email suggests the end of a sentence, you're using AI. It isn't a brain, and it isn't a person. It's a computer program that has learned patterns from a very large number of examples.",
      },
      {
        type: "text",
        heading: "Regular code vs. AI",
        kicker: "The main idea behind everything else in this module",
        body: [
          "A traditional program works like a recipe. A person writes exact rules, such as: IF an email contains \"FREE MONEY!!!\", THEN mark it as spam. The computer follows those rules exactly. It doesn't understand them; it just carries them out.",
          "Machine learning takes a different approach. Instead of writing the rules, people give the computer thousands of examples of spam and non-spam emails, and the computer works out patterns that separate the two. Machine learning is the approach behind most of the AI you use today.",
        ],
      },
      {
        type: "compare",
        heading: "One problem, two approaches",
        weak: {
          label: "Hand-written rules",
          text: "IF a message contains the word \"winner\" → spam. The problem: spammers can switch to \"w1nner\" the next day, and someone has to keep updating the rules by hand. With millions of variations, it's very hard to keep up.",
        },
        strong: {
          label: "Learned from examples",
          text: "Give the program 100,000 labeled examples of spam and normal email. It can pick up on patterns a person might not think to write down, like unusual spacing, suspicious links, or sender behavior. When it's retrained on newer examples, it can keep up as spam changes.",
        },
        note: "Learning from examples works best when the rules would be too complicated, too numerous, or too quick to change for people to write by hand.",
      },
      {
        type: "text",
        heading: "Why \"narrow\" matters",
        body: [
          "Most AI systems today are narrow AI: they're built to do one task, or a small set of related tasks, very well. A program that beats world champions at chess can't hold a conversation about chess or recognize a chess piece in a photo. A music recommender learns your listening habits, but it can't recognize your face.",
          "Some newer systems, like chatbots, can handle a wider range of tasks, but they still have major limits. A system that can learn and understand anything a human can, often called artificial general intelligence (AGI), does not exist yet. Experts disagree about whether or when it might be built.",
        ],
      },
      {
        type: "callout",
        variant: "nova",
        title: "NOVA says",
        text: "When you hear \"AI,\" try thinking \"a program that finds patterns after being trained on lots of examples.\" That simple description will help you judge a lot of the claims you hear about AI.",
      },
      {
        type: "terms",
        terms: [
          { term: "Algorithm", def: "A set of step-by-step instructions a computer follows, similar to a recipe." },
          { term: "Model", def: "What machine learning produces: the learned patterns, stored in a form that can make predictions about new examples." },
          { term: "Machine learning", def: "A way of building computer programs by having them learn from examples instead of following only hand-written rules." },
          { term: "Narrow AI", def: "AI designed for a specific task or a limited set of tasks. This describes nearly all AI in use today." },
        ],
      },
      {
        type: "stat",
        stats: [
          { value: "~80%", label: "of what people watch on Netflix comes from its recommendations, according to the company" },
          { value: "Billions", label: "of photos and videos are sorted and filtered by AI on social media every day" },
          { value: "0", label: "AI systems today have wants, feelings, or goals of their own" },
        ],
        note: "AI now works quietly in the background of many apps and services, and the math behind it is something you can learn.",
      },
    ],
    quiz: [
      {
        q: "What makes machine learning different from traditional programming?",
        options: [
          "It runs on faster computers",
          "Humans write stricter rules for it",
          "It learns patterns from examples instead of following only hand-written rules",
          "It can think and feel like a person",
        ],
        answer: 2,
        explain: "In machine learning, people don't write every \"IF this, THEN that\" rule. The program learns patterns from example data.",
      },
      {
        q: "An AI can beat grandmasters at chess but can't describe a chessboard. Why?",
        options: [
          "It's pretending not to know",
          "It's narrow AI, built to do one task very well",
          "It wasn't updated to the latest version",
          "Chess is too simple for it",
        ],
        answer: 1,
        explain: "A chess program is trained only to choose good moves. It has no ability outside that task.",
      },
      {
        q: "Which description of AI is the most accurate?",
        options: [
          "A digital brain that understands the world",
          "A program that finds patterns after being trained on examples",
          "A search engine with a personality",
          "A robot making plans in a data center",
        ],
        answer: 1,
        explain: "Thinking of AI as \"patterns learned from examples\" will help you separate realistic claims from exaggerated ones.",
      },
    ],
  },
  {
    slug: "learning-from-data",
    module: "foundations",
    index: 1,
    kind: "lesson",
    title: "Learning From Examples",
    subtitle: "Training data, patterns, and the problem of memorizing",
    hook: "AI systems don't start out knowing anything. They have to be trained, using huge numbers of examples. In this lesson, you'll train one yourself.",
    minutes: 8,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "Training an AI is a lot like teaching by example. You don't give it a definition of a cat. Instead, you show it thousands of labeled pictures of cats and other animals until it learns the patterns that usually mean \"cat.\"",
      },
      {
        type: "text",
        heading: "The three ingredients",
        body: [
          "Most machine learning projects need three things: data (a large set of examples), labels (the correct answer for each example, in a common approach called supervised learning), and a learning algorithm that adjusts the model whenever its guesses are wrong.",
          "The model makes a guess, compares it to the correct label, adjusts itself slightly, and repeats this many thousands or millions of times. This is called the training loop. What looks like \"intelligence\" is the combined result of all those small adjustments.",
        ],
      },
      {
        type: "interactive",
        id: "teachable-machine",
        title: "Lab: Train a classifier",
        caption: "Add training examples for two kinds of made-up alien creatures, Zorps and Blips. Watch the model draw a decision boundary between them as you go. Then switch to TEST mode to see how it handles creatures it hasn't seen before. Try giving one group very few examples and see how the model's predictions change.",
      },
      {
        type: "text",
        heading: "The memorization problem (overfitting)",
        body: [
          "Imagine preparing for a test by memorizing the exact answers to last year's exam. You'd get a perfect score on last year's exam, but you'd struggle on the real test because you memorized answers instead of learning the material.",
          "Models can make the same mistake. If a model is trained too closely on a small or limited set of data, it can learn random details of those examples instead of the general pattern. This is called overfitting. That's why a model's performance on its training data isn't enough. It has to be tested on new data it has never seen.",
        ],
      },
      {
        type: "list",
        heading: "What the lab shows",
        style: "bolt",
        items: [
          { title: "More data usually means better predictions", text: "With only a few examples, the model's boundary is unreliable. The amount and quality of data matter a lot." },
          { title: "Unbalanced data leads to unbalanced results", text: "If you train mostly on Zorps, the model starts labeling too many creatures as Zorps. This idea will come up again in the bias module." },
          { title: "Confidence isn't the same as accuracy", text: "A model can be very confident and still be wrong, especially on examples that are different from its training data." },
        ],
      },
      {
        type: "callout",
        variant: "key",
        title: "Key idea",
        text: "A model reflects the data it was trained on. One of the most useful questions you can ask about any AI system is \"What was it trained on?\" The answer tells you a lot about what it's likely to do well and where it may fail.",
      },
    ],
    quiz: [
      {
        q: "In the training loop, what happens after the model makes a wrong guess?",
        options: [
          "It deletes the example",
          "It adjusts itself slightly, and the process repeats many times",
          "A person rewrites its code",
          "It stops trying to learn that category",
        ],
        answer: 1,
        explain: "Training means guessing, measuring the error, making small adjustments, and repeating. All those adjustments together are the \"learning.\"",
      },
      {
        q: "A model scores 100% on its training data but does poorly on new examples. What is this called?",
        options: ["Underfitting", "Deep learning", "Overfitting", "Hallucinating"],
        answer: 2,
        explain: "Overfitting is like memorizing a practice test instead of learning the subject.",
      },
      {
        q: "You train a pet recognizer with 5,000 dog photos and 50 cat photos. What's the most likely result?",
        options: [
          "It works perfectly, since the numbers don't matter",
          "It labels too many animals as dogs, including many cats",
          "It refuses to answer",
          "It only recognizes cats",
        ],
        answer: 1,
        explain: "Unbalanced training data often leads to unbalanced results. This is one of the major sources of bias in real-world AI.",
      },
    ],
  },
  {
    slug: "neural-networks",
    module: "foundations",
    index: 2,
    kind: "lesson",
    title: "Networks Made of Math",
    subtitle: "Neural networks, layers, and adjustable weights",
    hook: "Neural networks are loosely inspired by the brain, but they work very differently. Inside, there are no thoughts, just numbers passing through layers and being multiplied, added, and adjusted.",
    minutes: 7,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "You can picture a neural network as a machine with a huge number of adjustable dials. Information goes in one side, each dial changes the signal a little, and an answer comes out the other side. Training is the process of finding good settings for all those dials.",
      },
      {
        type: "text",
        heading: "Each neuron does a small calculation",
        body: [
          "An artificial \"neuron\" does something quite simple. It takes in a few numbers, multiplies each one by a weight (a value that represents how much that input matters), adds the results together, and then passes the total through a function that determines its output.",
          "One neuron can't do much. But when you connect many of them in layers, sometimes with billions of weights, those simple calculations combine into something powerful. In an image-recognition network, early layers often respond to simple features like edges. Later layers combine those into shapes, and even later layers can respond to things like faces.",
        ],
      },
      {
        type: "interactive",
        id: "network-viz",
        title: "Lab: Send a signal through a small network",
        caption: "Send a signal through three layers and watch how the weights affect the output. Then change the weights and notice how the same input produces a completely different answer. What the network has learned is stored in its weights.",
      },
      {
        type: "steps",
        heading: "How training sets the weights",
        steps: [
          { title: "Start with random values", text: "At first, every weight is set to a random value, so the network's answers are basically meaningless." },
          { title: "Measure the error", text: "For each training example, calculate how far off the network's answer was." },
          { title: "Work backwards", text: "Using calculus, a method called backpropagation traces the error back through the network to figure out how much each weight contributed to it." },
          { title: "Adjust and repeat", text: "Change each weight slightly in the direction that reduces the error. Repeat this across many examples. For large models, training can take weeks or even months." },
        ],
      },
      {
        type: "callout",
        variant: "nova",
        title: "NOVA says",
        text: "\"Deep learning\" means using neural networks with many layers. The word \"deep\" refers to the number of layers, not to deep thinking.",
      },
      {
        type: "quote",
        text: "The network doesn't store a picture of a cat. It stores a large set of numbers that respond strongly to patterns that look like cats.",
        cite: "A helpful way to think about neural networks",
      },
      {
        type: "terms",
        terms: [
          { term: "Weight", def: "An adjustable number in the network that controls how much an input affects the result. Training means finding good values for the weights." },
          { term: "Layer", def: "A group of neurons. Each layer transforms the information it receives, often into more general or abstract features." },
          { term: "Backpropagation", def: "The method used to figure out how much each weight contributed to an error, so the weights can be adjusted." },
          { term: "Deep learning", def: "Machine learning that uses neural networks with many layers. It powers most of today's advanced AI." },
        ],
      },
    ],
    quiz: [
      {
        q: "What is a \"weight\" in a neural network?",
        options: [
          "How heavy the computer is",
          "The network's confidence score",
          "An adjustable number that controls how much an input matters",
          "A type of virus scanner",
        ],
        answer: 2,
        explain: "Weights are the adjustable numbers inside the network. Learning means finding good values for them.",
      },
      {
        q: "During backpropagation, the network…",
        options: [
          "Traces the error backwards to figure out how to adjust each weight",
          "Deletes its last answer",
          "Sends data back to the user",
          "Restarts from the beginning",
        ],
        answer: 0,
        explain: "Backpropagation figures out how much each weight contributed to the error so each one can be adjusted slightly.",
      },
      {
        q: "Why can networks with more layers recognize complex things like faces?",
        options: [
          "They have bigger screens",
          "Each layer builds on the one before it: edges → shapes → parts → faces",
          "They use Wi-Fi instead of math",
          "They skip the input",
        ],
        answer: 1,
        explain: "Layers combine simple features into more complex ones, step by step.",
      },
    ],
  },
  {
    slug: "generative-ai",
    module: "foundations",
    index: 3,
    kind: "lesson",
    title: "How Chatbots Actually Work",
    subtitle: "Tokens, prediction, and why AI sometimes makes up facts",
    hook: "A chatbot like ChatGPT doesn't work by looking up answers the way you might expect. At its core, it repeats one step over and over: predicting the next piece of text. Understanding this will help you use these tools well.",
    minutes: 8,
    xp: 120,
    blocks: [
      {
        type: "lead",
        text: "A large language model (LLM) reads your message and predicts what piece of text is most likely to come next. It adds that piece, then predicts the next one, and keeps going until the response is complete. Every answer is built this way, one small piece at a time.",
      },
      {
        type: "text",
        heading: "Tokens: the building blocks of AI text",
        body: [
          "Language models don't read text letter by letter or always word by word. They work with tokens, which are chunks of text. A token might be a whole word like \"the,\" part of a word like \"believ,\" a number, or a punctuation mark. Your message is split into tokens, each token is turned into numbers, and those numbers pass through a very large neural network.",
          "Based on patterns learned from a huge amount of text, the network assigns a probability to every possible next token. For \"The capital of France is…,\" the token \"Paris\" would get a very high probability, \"Lyon\" a very low one, and \"spaghetti\" almost none. (These numbers are just an illustration.)",
        ],
      },
      {
        type: "interactive",
        id: "token-predictor",
        title: "Lab: Think like a language model",
        caption: "Finish the sentence the way a language model would, by choosing from a list of possible next words and their probabilities. Hover over each option to see how likely it is, and notice what happens when the sentence could go in several directions.",
      },
      {
        type: "text",
        heading: "Why does it sound so knowledgeable?",
        body: [
          "Human writing contains a lot of knowledge. To predict the next word well across millions of topics, a model has to pick up grammar, facts, common lines of reasoning, and writing styles. All of this is stored as patterns in its weights.",
          "However, a language model doesn't automatically check whether what it writes is true. It produces text that is likely, based on patterns, which is not the same as text that has been verified. A made-up citation for a book that doesn't exist is produced by exactly the same process as a real one. Some chatbots can search the web or use other tools to help, but they can still make mistakes.",
        ],
      },
      {
        type: "callout",
        variant: "warn",
        title: "What is a hallucination?",
        text: "When an AI produces confident, well-written content that is wrong or completely made up, such as fake sources, incorrect dates, or invented statistics, it's called a hallucination. Developers are working to reduce hallucinations, but because of how these models generate text, they can't be fully eliminated.",
      },
      {
        type: "list",
        heading: "What this means for you",
        style: "check",
        items: [
          { text: "Well-written isn't the same as correct. Smooth writing only shows that the model is good at writing." },
          { text: "The more specific a claim is (dates, quotes, statistics, page numbers), the more important it is to check it." },
          { text: "AI is most useful for brainstorming, drafting, and explaining ideas. It's less reliable as a source of facts." },
          { text: "In Module 02, you'll learn practical ways to check AI-generated information." },
        ],
      },
    ],
    quiz: [
      {
        q: "At its core, what does a chatbot do when it answers you?",
        options: [
          "Searches a database of verified facts",
          "Predicts the most likely next token, over and over",
          "Copies a paragraph from Wikipedia",
          "Thinks through the answer like a person, then writes it",
        ],
        answer: 1,
        explain: "A language model builds its response by repeatedly predicting the next token. Its other abilities come from how well it has learned to do this.",
      },
      {
        q: "Why do AI chatbots sometimes invent fake book titles or sources?",
        options: [
          "They're playing a joke on you",
          "Their training data was deleted",
          "They produce likely-sounding text and don't automatically check whether it's true",
          "The internet is broken",
        ],
        answer: 2,
        explain: "The same process that produces real citations can also produce fake ones. Sounding believable doesn't make something true.",
      },
      {
        q: "What is a \"token\"?",
        options: [
          "A coin you pay the AI",
          "A chunk of text, such as a word, part of a word, or punctuation, that the model processes",
          "A security password",
          "A robot's memory card",
        ],
        answer: 1,
        explain: "Text is split into tokens before the model processes it. A long word like \"unbelievable\" may be split into more than one token.",
      },
    ],
  },
  {
    slug: "foundations-boss",
    module: "foundations",
    index: 4,
    kind: "boss",
    title: "The Turing Challenge",
    subtitle: "Review everything: data, neural networks, and prediction",
    hook: "You've finished four lessons. Now it's time to put it all together. Answer six questions to earn bonus XP, and build a streak of correct answers to increase your combo.",
    minutes: 5,
    xp: 300,
    blocks: [
      {
        type: "lead",
        text: "This challenge has six questions covering all of Module 01: what AI is, how machines learn from data, how neural networks adjust their weights, and why chatbots sometimes make things up.",
      },
      {
        type: "callout",
        variant: "nova",
        title: "How it works",
        text: "Each correct answer in a row after your first adds to your combo, and each combo step is worth +12 bonus XP. If you miss a question, your combo resets, but you can try that question again. Complete the challenge to light up the first layer of your network.",
      },
      {
        type: "stat",
        stats: [
          { value: "+300", label: "base XP for completing the challenge" },
          { value: "+60", label: "maximum combo bonus" },
          { value: "1", label: "network layer unlocked" },
        ],
      },
    ],
    quiz: [
      {
        q: "Which sentence best describes machine learning?",
        options: [
          "Computers following hand-written rules perfectly",
          "Computers learning patterns from examples instead of being given every rule",
          "Computers copying human brains exactly",
          "Computers searching the internet very quickly",
        ],
        answer: 1,
        explain: "Machine learning starts with examples and produces patterns, instead of starting with rules written by people.",
      },
      {
        q: "A model trained on 2 million photos of cities does poorly on photos of the countryside. What's the most useful question to ask?",
        options: [
          "Was the model turned off and on again?",
          "What was it trained on?",
          "Is the model feeling okay?",
          "How big is the model's screen?",
        ],
        answer: 1,
        explain: "A model reflects its training data. It's most likely to struggle with the kinds of examples it didn't see during training.",
      },
      {
        q: "Overfitting is most like…",
        options: [
          "Studying by memorizing last year's exam answers",
          "Studying with flashcards",
          "A computer virus",
          "Upgrading your computer's graphics card",
        ],
        answer: 0,
        explain: "An overfit model does great on the examples it trained on but poorly on new ones, like someone who memorized answers without learning the material.",
      },
      {
        q: "In a trained neural network, what it has learned is stored mainly in its…",
        options: ["Timers", "Training labels", "Weights", "Error messages"],
        answer: 2,
        explain: "The weights hold the patterns the network learned during training.",
      },
      {
        q: "A chatbot gives you a neatly formatted citation with an author, journal, and page numbers. What should you do?",
        options: [
          "Trust it, since a citation that detailed must be real",
          "Check that the source actually exists before using it",
          "Assume it came from Wikipedia",
          "Use only part of it",
        ],
        answer: 1,
        explain: "Made-up citations can look exactly like real ones. Always check a source before you rely on it.",
      },
      {
        q: "Why is \"narrow AI\" a good description of most AI systems today?",
        options: [
          "They only work in certain time zones",
          "Each one is built to do a specific task well and can't do much outside it",
          "Their servers are physically small",
          "They only know a few words",
        ],
        answer: 1,
        explain: "Today's AI systems can be extremely good at the tasks they were built for, but none can learn and understand anything the way a person can.",
      },
    ],
  },
];

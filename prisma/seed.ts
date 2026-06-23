import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const posts = [
  {
    title: "The Antidote is Soul",
    slug: "the-antidote-is-soul",
    excerpt:
      "How do you stand out in the age of agents? Every website has cool animations now. AI made perfection free — and the only thing left worth having is soul.",
    category: "Essays",
    author: "Jonathan Pedoeem",
    featured: true,
    coverImage:
      "https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=minimal%20editorial%20pen%20and%20ink%20sketch%20of%20a%20single%20candle%20flame%20on%20cream%20paper%2C%20fine%20line%20art%2C%20vintage%20engraving%20style%2C%20warm%20beige%20tones&image_size=landscape_4_3",
    content: `Every SaaS landing page has the same purple gradients, the same floating illustrations, the same polished corners. AI made perfection free. Every digital meal is a bowl.

When the cost of polish drops to zero, polish stops being a signal. What remains is taste — the accumulation of a thousand small decisions that no model can shortcut for you.

## The texture of intention

Soul is not a feature you ship. It is the residue of caring about things that do not scale. A hand-drawn illustration. An unexpected serif. A sentence that took an afternoon.

> The antidote to slop is not more craft. It is more conviction.

We are entering an era where the homogenizing pull of generation is strongest precisely where it is cheapest. The way out is to spend deliberately where it counts.`,
  },
  {
    title: "What is Context Engineering?",
    slug: "what-is-context-engineering",
    excerpt:
      "Prompt engineering exploded when ChatGPT launched. But the real discipline emerging now is broader: shaping everything the model sees.",
    category: "Prompting",
    author: "Jonathan Pedoeem",
    featured: true,
    coverImage:
      "https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=minimal%20editorial%20pen%20and%20ink%20sketch%20of%20layered%20paper%20documents%20and%20a%20fountain%20pen%2C%20fine%20line%20art%2C%20vintage%20engraving%20style%2C%20warm%20cream%20background&image_size=landscape_4_3",
    content: `The term "prompt engineering" really exploded when ChatGPT launched in late 2022. It started as simple tricks to get better responses from AI. Add "please" and "thank you." Create elaborate role-playing scenarios.

Context engineering is the broader practice: deciding what information enters the model's window, in what order, and in what form.

## Beyond the prompt

A prompt is a string. Context is a system — retrieval, memory, tools, and formatting working together.

The teams that win are the ones that treat context as an engineering surface, not an afterthought.`,
  },
  {
    title: "How to Evaluate LLM Prompts Beyond Simple Use Cases",
    slug: "how-to-evaluate-llm-prompts",
    excerpt:
      "A common question we get: how can I evaluate my LLM application? Teams push this off because there is no clear answer. Here is a practical path.",
    category: "Prompting",
    author: "Jonathan Pedoeem",
    featured: true,
    coverImage:
      "https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=minimal%20editorial%20pen%20and%20ink%20sketch%20of%20a%20balance%20scale%20with%20paper%20cards%2C%20fine%20line%20art%2C%20vintage%20engraving%20style%2C%20warm%20beige%20tones&image_size=landscape_4_3",
    content: `A common question we get is: "How can I evaluate my LLM application?" Teams often push off this question because there is not a clear answer or tool.

If you're doing classification or something programmatic, evaluation is easy. The hard part is open-ended generation.

## Start with the hard cases

Build a dataset of your edge cases first. The boring middle takes care of itself; the tail is where reputations are made or lost.`,
  },
  {
    title: "The emergence of Agent-First Software Design",
    slug: "agent-first-software-design",
    excerpt:
      "For decades, programming meant writing explicit if/else decision trees. A new paradigm is emerging where the engineer orchestrates rather than dictates.",
    category: "Essays",
    author: "Jonathan Pedoeem",
    featured: false,
    coverImage:
      "https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=minimal%20editorial%20pen%20and%20ink%20sketch%20of%20interconnected%20gears%20and%20nodes%2C%20fine%20line%20art%2C%20vintage%20engraving%20style%2C%20warm%20cream%20paper&image_size=landscape_4_3",
    content: `There's a shift happening in how we build software. For decades, programming meant writing explicit if/else decision trees. Parse this response. Handle this edge case.

A new paradigm is emerging where the job of the software engineer isn't to write every branch, but to design the environment in which an agent operates.

## From control flow to context

You stop writing the steps and start writing the constraints. It is a humbling, powerful inversion.`,
  },
  {
    title: "Get Out of the Model's Way",
    slug: "get-out-of-the-models-way",
    excerpt:
      "When something doesn't work, the instinct is to add more. More guardrails. More structure. With LLMs, this instinct is often wrong.",
    category: "Prompting",
    author: "Jonathan Pedoeem",
    featured: false,
    coverImage:
      "https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=minimal%20editorial%20pen%20and%20ink%20sketch%20of%20an%20open%20birdcage%20with%20a%20bird%20flying%20out%2C%20fine%20line%20art%2C%20vintage%20engraving%20style%2C%20warm%20beige&image_size=landscape_4_3",
    content: `When something doesn't work, the instinct is to add more. More guardrails. More tools. More structure. With LLMs, this instinct is often wrong.

Paradoxically, AI engineers are building elaborate systems to constrain models that are now smarter than the constraints themselves.

## Trust, then verify

Give the model room. Then measure. Most of your scaffolding is load-bearing only in your imagination.`,
  },
  {
    title: "We hosted the first Vibe Coding Olympics",
    slug: "vibe-coding-olympics",
    excerpt:
      "A three-round, aggressively time-boxed hackathon where the only score that mattered was whether the result felt good.",
    category: "News",
    author: "Jonathan Pedoeem",
    featured: false,
    coverImage:
      "https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=minimal%20editorial%20pen%20and%20ink%20sketch%20of%20a%20laurel%20wreath%20and%20a%20laptop%2C%20fine%20line%20art%2C%20vintage%20engraving%20style%2C%20warm%20cream%20background&image_size=landscape_4_3",
    content: `Last week we hosted the first-ever Vibe Coding Olympics in the heart of New York City: a three-round, aggressively time-boxed hackathon where the only score that mattered was whether the result felt good.

Prompting used to be the hard part. Now the hard part is deciding what is worth building.

## Taste as a sport

We judged on feel. It turns out feel is surprisingly legible when you put it on a stage.`,
  },
];

async function main() {
  await prisma.contactMessage.deleteMany();
  await prisma.post.deleteMany();

  for (const post of posts) {
    await prisma.post.create({ data: post });
  }

  console.log(`Seeded ${posts.length} posts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

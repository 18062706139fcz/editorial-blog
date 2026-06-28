import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const posts = [
  {
    title: "反药是灵魂",
    slug: "the-antidote-is-soul",
    excerpt:
      "当 AI 让精致变得廉价，真正稀缺的不是更多动效，而是判断、克制，以及一点不愿让步的灵魂。",
    category: "随笔",
    author: "Ryker",
    featured: true,
    coverImage:
      "https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=minimal%20editorial%20pen%20and%20ink%20sketch%20of%20a%20single%20candle%20flame%20on%20cream%20paper%2C%20fine%20line%20art%2C%20vintage%20engraving%20style%2C%20warm%20beige%20tones&image_size=landscape_4_3",
    content: `每一个产品页都开始拥有漂亮的圆角、顺滑的动效、恰到好处的插图。AI 把精致变得廉价，也把很多原本能区分人的信号抹平了。

当 polish 的成本降到接近零，polish 就不再是信号。剩下能被看见的，是一连串小判断：哪里应该留白，哪里应该克制，哪里需要一句不像模板的句子。

## 意图的纹理

灵魂不是一个可以排进 sprint 的功能，它更像是那些不容易规模化的在意留下的痕迹。一个手工改过的标题。一张没有迎合趋势的图。一个明明可以省掉、但你还是写完的过渡。

> 对抗平庸的反药不是更多手艺，而是更清楚的立场。

生成会把最便宜的地方拉向同一种光滑。要逃出去，就要把力气花在真正重要的地方。`,
  },
  {
    title: "什么是上下文工程？",
    slug: "what-is-context-engineering",
    excerpt:
      "提示词只是入口。真正影响模型表现的，是你决定让它看见什么、按什么顺序看见，以及用什么形态看见。",
    category: "提示词",
    author: "Ryker",
    featured: true,
    coverImage:
      "https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=minimal%20editorial%20pen%20and%20ink%20sketch%20of%20layered%20paper%20documents%20and%20a%20fountain%20pen%2C%20fine%20line%20art%2C%20vintage%20engraving%20style%2C%20warm%20cream%20background&image_size=landscape_4_3",
    content: `“提示词工程”在 ChatGPT 之后变得流行。最早它像一套小技巧：补充角色、改写语气、把要求写得更礼貌。但真正决定 LLM 应用质量的，往往不是最后那几句话。

上下文工程关注的是更大的问题：模型在生成前看到了什么，信息如何被排序，历史如何被压缩，工具返回如何被组织。

## 提示词之外

提示词是一段字符串，上下文是一个系统。检索、记忆、工具、格式、示例和约束都在这个系统里一起工作。

做得好的团队不会把上下文当成附属品。它是产品能力的一部分，也是工程边界的一部分。`,
  },
  {
    title: "如何评估复杂 LLM 提示词",
    slug: "how-to-evaluate-llm-prompts",
    excerpt:
      "开放式生成很难评估，但不能因此只靠体感。先抓住失败样本，再把判断拆成可以复核的维度。",
    category: "提示词",
    author: "Ryker",
    featured: true,
    coverImage:
      "https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=minimal%20editorial%20pen%20and%20ink%20sketch%20of%20a%20balance%20scale%20with%20paper%20cards%2C%20fine%20line%20art%2C%20vintage%20engraving%20style%2C%20warm%20beige%20tones&image_size=landscape_4_3",
    content: `很多团队都会问：我的 LLM 应用到底怎么评估？分类任务还好办，开放式生成就会变得含糊，最后只剩“看起来还行”。

“看起来还行”不是评估，它只是一次情绪判断。复杂提示词需要一套更笨、但更可靠的方法。

## 先从最难的样本开始

不要先收集中间态样本。普通请求通常不会暴露问题，边界样本才会。收集那些让模型容易偷懒、误解、过度发挥或遗漏约束的输入。

然后把判断拆开：事实是否正确，格式是否稳定，语气是否合适，是否遵守边界，是否能在工具失败时优雅降级。评估不是为了得到一个漂亮分数，而是为了知道下一次应该改哪里。`,
  },
  {
    title: "代理优先的软件设计正在出现",
    slug: "agent-first-software-design",
    excerpt:
      "过去我们写清楚每一个分支。现在更重要的是设计环境、约束和反馈，让代理在其中可靠地行动。",
    category: "随笔",
    author: "Ryker",
    featured: false,
    coverImage:
      "https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=minimal%20editorial%20pen%20and%20ink%20sketch%20of%20interconnected%20gears%20and%20nodes%2C%20fine%20line%20art%2C%20vintage%20engraving%20style%2C%20warm%20cream%20paper&image_size=landscape_4_3",
    content: `软件设计正在发生一个微妙的转向。过去，编程意味着把每一个分支写清楚：如果这样，就那样；遇到异常，就进入另一个路径。

代理系统不是这样工作的。工程师不再只是写步骤，而是在设计一个可以让模型行动的环境。

## 从控制流到上下文

你写的东西从“下一步做什么”变成了“什么是边界，什么是目标，什么时候该停下，什么时候该请求更多信息”。

这不是放弃控制，而是换一种控制方式。好的代理优先设计，会把模型的能力放出来，同时让失败路径清晰可见。`,
  },
  {
    title: "别挡模型的路",
    slug: "get-out-of-the-models-way",
    excerpt:
      "当结果不好时，直觉总是加更多护栏、更多格式、更多规则。但对 LLM 来说，这个直觉经常是错的。",
    category: "提示词",
    author: "Ryker",
    featured: false,
    coverImage:
      "https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=minimal%20editorial%20pen%20and%20ink%20sketch%20of%20an%20open%20birdcage%20with%20a%20bird%20flying%20out%2C%20fine%20line%20art%2C%20vintage%20engraving%20style%2C%20warm%20beige&image_size=landscape_4_3",
    content: `当模型表现不好时，很多人的第一反应是加东西：更多规则、更多护栏、更多结构、更多示例。问题是，很多时候这些东西并没有让模型更可靠，只是让提示词更沉重。

越强的模型，越不需要被当成脆弱的 parser。过度规定会把它的推理空间压扁。

## 信任，然后验证

给模型一点空间，再用评估和日志兜底。你需要的是可观察、可回放、可修正的系统，而不是一段越来越长、谁也不敢删的提示词。

很多脚手架并不承重，只是让人看起来安心。`,
  },
  {
    title: "我们办了一场 Vibe Coding Olympics",
    slug: "vibe-coding-olympics",
    excerpt:
      "三轮高压限时的编码比赛，评分标准不是功能堆得多，而是结果是否真的让人觉得顺手、有趣、成立。",
    category: "现场",
    author: "Ryker",
    featured: false,
    coverImage:
      "https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=minimal%20editorial%20pen%20and%20ink%20sketch%20of%20a%20laurel%20wreath%20and%20a%20laptop%2C%20fine%20line%20art%2C%20vintage%20engraving%20style%2C%20warm%20cream%20background&image_size=landscape_4_3",
    content: `上周我们办了一场 Vibe Coding Olympics：三轮、限时、压力很高，但评判标准并不是谁写了最多功能，而是谁交出来的东西最成立。

这件事有意思的地方在于，提示词不再是最难的部分。真正难的是判断什么值得做，以及做成什么样才算有感觉。

## 品味也可以被放到台上

我们按“感觉”评分。听起来很虚，但当作品摆在一起时，差异其实非常清楚：有些东西只是完成了，有些东西是真的有方向。

AI 让实现变快之后，品味反而变成更硬的能力。`,
  },
];

async function main() {
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

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Renders post bodies written in Markdown, styled to match the editorial
// design language (warm paper, serif headings, accent links/quotes).
export default function Markdown({ content }: { content: string }) {
  return (
    <div
      className="prose max-w-none sm:prose-lg
        prose-headings:font-serif prose-headings:font-light prose-headings:tracking-tight prose-headings:text-ink
        prose-h2:mt-12 prose-h2:text-2xl prose-h3:mt-9 prose-h3:text-xl sm:prose-h2:mt-14 sm:prose-h2:text-3xl sm:prose-h3:mt-10 sm:prose-h3:text-2xl
        prose-p:text-base prose-p:leading-[1.8] prose-p:text-ink/90 sm:prose-p:text-[1.0625rem] sm:prose-p:leading-[1.85]
        prose-a:text-accent prose-a:underline-offset-4 hover:prose-a:text-ink
        prose-strong:text-ink prose-em:text-ink
        prose-blockquote:border-l-2 prose-blockquote:border-accent prose-blockquote:font-serif prose-blockquote:text-xl prose-blockquote:font-light prose-blockquote:not-italic prose-blockquote:text-ink sm:prose-blockquote:text-2xl
        prose-code:rounded prose-code:bg-paper-dim prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.85em] prose-code:text-ink prose-code:before:content-[''] prose-code:after:content-['']
        prose-pre:rounded-xl prose-pre:border prose-pre:border-hairline prose-pre:bg-ink prose-pre:text-paper
        prose-img:rounded-xl prose-img:border prose-img:border-hairline
        prose-hr:border-hairline
        prose-li:text-ink/90 prose-li:marker:text-ink-soft"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

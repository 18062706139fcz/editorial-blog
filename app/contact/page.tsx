import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Get in touch — The Margin",
};

export default function ContactPage() {
  return (
    <div className="grid border-x border-hairline md:grid-cols-2">
      {/* Left column */}
      <section className="border-b border-hairline px-8 py-16 md:border-b-0 md:border-r md:py-24">
        <h1 className="font-serif text-5xl font-light leading-[1.02] tracking-tight text-ink sm:text-6xl">
          Let&apos;s get
          <br />
          <span className="italic text-accent">in touch</span>
        </h1>
        <div className="mt-12">
          <p className="font-serif text-lg text-ink">Prefer to write?</p>
          <p className="mt-1 text-ink-soft">
            Reach the editor directly at:
          </p>
          <a
            href="mailto:hello@themargin.blog"
            className="mt-4 inline-block border border-hairline px-4 py-2 font-mono text-[12px] uppercase tracking-label text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            hello@themargin.blog
          </a>
        </div>
        <p className="mt-20 font-mono text-[11px] uppercase tracking-label text-ink-soft">
          Read by curious people like you
        </p>
      </section>

      {/* Right column: form */}
      <section className="px-8 py-16 md:py-24">
        <ContactForm />
      </section>
    </div>
  );
}

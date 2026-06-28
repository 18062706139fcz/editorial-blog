"use client";

/**
 * Cover-image lead visual for the featured spotlight, in the spirit of
 * blog.cosine.ren's article covers: a real image with a soft editorial
 * gradient, a category label and an affordance arrow. Hover gently scales
 * the image, like innei.in's card motion.
 */
export default function FeaturedArt({
  label,
  title,
}: {
  label: string;
  title: string;
}) {
  const prompt = encodeURIComponent(
    `minimal editorial magazine cover illustration about "${title}", warm off-white paper tones, soft beige and terracotta orange palette, abstract calm composition, fine grain, lots of negative space, elegant, muted, no text`,
  );
  const src = `https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=${prompt}&image_size=landscape_4_3`;

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-paper-dim">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        loading="lazy"
      />

      {/* readability gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-ink/10" />

      {/* category label */}
      <span className="absolute left-6 top-6 rounded-full bg-paper/85 px-3 py-1 font-mono text-[10px] uppercase tracking-label text-ink backdrop-blur-sm">
        {label}
      </span>

      {/* affordance arrow */}
      <span className="absolute right-6 top-6 inline-flex h-9 w-9 items-center justify-center rounded-full border border-paper/50 bg-paper/20 text-paper backdrop-blur-sm transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-paper">
        →
      </span>
    </div>
  );
}

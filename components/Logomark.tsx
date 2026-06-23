export default function Logomark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-[9px] bg-ink ${className}`}
    >
      <span className="font-serif text-[1.05em] font-medium leading-none text-paper">
        R
      </span>
      <span className="absolute bottom-[18%] right-[18%] h-[0.14em] w-[0.14em] rounded-full bg-accent" />
    </span>
  );
}

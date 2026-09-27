export function Brand({ href, onClick }: { href: string; onClick?: () => void }) {
  return (
    <a href={href} onClick={onClick} className="font-display flex items-center gap-2.5 text-lg font-bold tracking-tight">
      <span className="bg-subject text-on-subject inline-grid size-8 place-items-center rounded-md font-mono text-[13px] font-bold">
        {'{ }'}
      </span>
      Interview Atlas
    </a>
  );
}

import { IconExternalLink } from "@tabler/icons-react";

export function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      className={className ? `cp-link ${className}` : "cp-link"}
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={(event) => event.stopPropagation()}
    >
      <span>{children}</span>
      <IconExternalLink size={14} stroke={1.5} aria-hidden />
    </a>
  );
}

import type { HTMLAttributes, PropsWithChildren } from 'react';

type Props = PropsWithChildren<HTMLAttributes<HTMLElement>>;

export function Card({ className = '', children, ...props }: Props) {
  return (
    <article
      className={`rounded-[28px] border border-stone-700/80 bg-stone-900/55 shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur-sm ${className}`.trim()}
      {...props}
    >
      {children}
    </article>
  );
}

import type { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className = '', type = 'button', ...props }: Props) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center rounded-full border border-lime-500/15 bg-lime-400 px-5 text-sm font-semibold text-stone-950 transition hover:-translate-y-0.5 hover:bg-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400 disabled:cursor-not-allowed disabled:opacity-65 ${className}`.trim()}
      {...props}
    />
  );
}

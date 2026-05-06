import type { PropsWithChildren, ReactNode } from 'react';

type Props = PropsWithChildren<{
  readonly header?: ReactNode;
}>;

export function MainLayout({ header, children }: Props) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(163,230,53,0.07),transparent_28%),linear-gradient(180deg,#181410_0%,#1f1a15_100%)] text-stone-50">
      {header ? <div>{header}</div> : null}
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10 md:px-8 lg:px-10">
        {children}
      </div>
    </div>
  );
}

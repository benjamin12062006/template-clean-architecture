import type { PropsWithChildren, ReactNode } from 'react';

type Props = PropsWithChildren<{
  readonly open: boolean;
  readonly title?: ReactNode;
  readonly footer?: ReactNode;
}>;

export function Modal({ open, title, footer, children }: Props) {
  if (!open) return null;

  return (
    <div className="app-modal" role="dialog" aria-modal="true">
      <div className="app-modal__backdrop" />
      <div className="app-modal__content">
        {title ? <h2 className="app-modal__title">{title}</h2> : null}
        <div>{children}</div>
        {footer ? <footer className="app-modal__footer">{footer}</footer> : null}
      </div>
    </div>
  );
}

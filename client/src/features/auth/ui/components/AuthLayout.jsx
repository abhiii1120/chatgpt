import React from "react";

/**
 * Shared shell for LoginForm and RegisterForm: full-height
 * background with a narrow centered card, matching ChatGPT's
 * auth screens. Colors come from theme tokens (see
 * styles/theme.css) so this automatically follows light/dark.
 * Pass the heading and form content as children.
 */
export default function AuthLayout({ heading, children, footer }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-surface px-6">
      <div className="flex w-full max-w-100 flex-col items-center">
        <h1 className="mb-8 text-center text-[28px] font-normal text-ink">
          {heading}
        </h1>
        {children}
        {footer && (
          <>
            <div className="my-5 flex w-full items-center gap-3">
              <span className="h-px flex-1 bg-line" />
              <span className="text-sm text-ink-muted">or</span>
              <span className="h-px flex-1 bg-line" />
            </div>
            <p className="mt-1 text-center text-sm text-ink-muted">{footer}</p>
          </>
        )}
      </div>
    </div>
  );
}
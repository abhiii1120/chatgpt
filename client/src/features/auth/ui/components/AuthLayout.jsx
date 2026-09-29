import React from "react";

/* ---------------------------------------------------------------
 * Small components used by AuthLayout below. Kept in this file
 * since they're only used here, but split out from the JSX so
 * the layout markup itself stays readable.
 * ------------------------------------------------------------- */

function BrandMark({ withLabel = false, className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-accent">
          <path
            d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {withLabel && (
        <span className="text-sm font-medium tracking-tight text-ink">Cove</span>
      )}
    </div>
  );
}

function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v2.84h3.86c2.26-2.09 3.56-5.17 3.56-8.66z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-2.84c-1.07.72-2.44 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.45c-.24-.72-.38-1.49-.38-2.45s.14-1.73.38-2.45V6.46H1.29A11.96 11.96 0 0 0 0 12c0 1.92.46 3.74 1.29 5.54l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.46l3.98 3.09c.95-2.85 3.6-4.8 6.73-4.8z" />
    </svg>
  );
}

function GoogleButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-line
        bg-surface px-4 py-2.5 text-[15px] font-medium text-ink transition-colors hover:bg-line/20"
    >
      <GoogleIcon className="h-4.5 w-4.5" />
      Continue with Google
    </button>
  );
}

function OrDivider() {
  return (
    <div className="my-6 flex items-center gap-3">
      <span className="h-px flex-1 bg-line" />
      <span className="text-xs text-ink-muted">or</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

function ChatPreviewMockup() {
  return (
    <div className="relative mt-20 max-w-sm -rotate-1 rounded-2xl border border-surface/10 bg-surface/4 p-4 shadow-2xl shadow-black/40 backdrop-blur-sm">
      <div className="flex items-center gap-2.5 border-b border-surface/10 pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-accent">
          <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
            <path
              d="M12 3v2.2M12 18.8V21M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M3 12h2.2M18.8 12H21M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-surface/90">Cove</p>
          <p className="text-[11px] text-surface/40">Always available</p>
        </div>
      </div>

      <div className="mt-3.5 flex flex-col gap-2.5">
        <div className="ml-auto max-w-[80%] rounded-xl rounded-tr-sm bg-accent/20 px-3 py-2 text-[13px] leading-relaxed text-surface/90">
          Can you help me refactor this auth flow?
        </div>
        <div className="max-w-[80%] rounded-xl rounded-tl-sm bg-surface/6 px-3 py-2 text-[13px] leading-relaxed text-surface/80">
          Sure — share the file and I'll walk through it with you.
        </div>
        <div className="flex items-center gap-1 rounded-xl rounded-tl-sm bg-surface/6 px-3 py-2.5">
          <span className="auth-typing-dot h-1.5 w-1.5 rounded-full bg-surface/50" />
          <span className="auth-typing-dot h-1.5 w-1.5 rounded-full bg-surface/50" style={{ animationDelay: "0.15s" }} />
          <span className="auth-typing-dot h-1.5 w-1.5 rounded-full bg-surface/50" style={{ animationDelay: "0.3s" }} />
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
 * AuthLayout — split-screen shell used by LoginForm/RegisterForm.
 * Left: editorial dark panel with headline + chat preview.
 * Right: the form, a Google sign-in option, and a short blurb
 * about the product. Same prop API as before.
 * ------------------------------------------------------------- */
export default function AuthLayout({ heading, subheading, children, footer }) {
  return (
    <div className="grid min-h-screen w-full bg-surface lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      {/* Left: editorial panel */}
      <div className="relative hidden h-full flex-col overflow-hidden bg-ink px-14 py-16 lg:flex">
        <style>{`
          @keyframes drift {
            0%   { transform: translate(-6%, -4%) scale(1); }
            50%  { transform: translate(4%, 6%) scale(1.08); }
            100% { transform: translate(-6%, -4%) scale(1); }
          }
          .auth-orb {
            animation: drift 22s ease-in-out infinite;
          }
          @keyframes typingDot {
            0%, 60%, 100% { opacity: 0.25; transform: translateY(0); }
            30% { opacity: 1; transform: translateY(-2px); }
          }
          .auth-typing-dot {
            animation: typingDot 1.3s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .auth-orb, .auth-typing-dot { animation: none; }
          }
        `}</style>

        <div className="auth-orb pointer-events-none absolute -left-32 -top-32 h-128 w-lg rounded-full bg-accent/25 blur-3xl" />
        <div
          className="auth-orb pointer-events-none absolute -bottom-40 -right-20 h-112 w-md rounded-full bg-accent/15 blur-3xl"
          style={{ animationDelay: "-11s" }}
        />

        <BrandMark withLabel className="relative text-surface/90" />

        <div className="relative mt-16 max-w-md">
          <p className="font-serif text-[2.65rem] leading-[1.12] text-surface">
            Every good idea starts as a conversation with someone who'll
            listen.
          </p>
          <p className="mt-6 text-[15px] text-surface/50">
            Pick up exactly where you left off, across every device.
          </p>
        </div>

        <ChatPreviewMockup />

        <p className="relative mt-auto pt-10 text-xs text-surface/35">
          © {new Date().getFullYear()} Cove
        </p>
      </div>

      {/* Right: form panel */}
      <div className="relative flex h-full flex-col overflow-hidden px-6 py-12 sm:px-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/6 blur-3xl lg:hidden" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-accent/5 blur-3xl lg:hidden" />

        <div className="relative flex flex-1 items-center justify-center">
          <div className="w-full max-w-95 animate-[fadeUp_0.5s_ease-out]">
            <style>{`
            @keyframes fadeUp {
              from { opacity: 0; transform: translateY(8px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          <BrandMark withLabel className="mb-2 lg:hidden" />

          <h1 className="mt-6 text-[26px] font-medium tracking-tight text-ink lg:mt-0">
            {heading}
          </h1>
          {subheading && (
            <p className="mt-2 text-[15px] text-ink-muted">{subheading}</p>
          )}

          <div className="mt-8">{children}</div>

          <OrDivider />

          <GoogleButton onClick={() => { window.location.href = "/api/v1/auth/google"; }} />

          {footer && (
            <p className="mt-6 text-center text-sm text-ink-muted">{footer}</p>
          )}
          </div>
        </div>

        <p className="relative mx-auto max-w-95 pt-8 text-center text-[13px] leading-relaxed text-ink-muted/60">
          Cove keeps every conversation in one place, so you can ask a
          question, close the tab, and pick the thread back up tomorrow.
        </p>
      </div>
    </div>
  );
}
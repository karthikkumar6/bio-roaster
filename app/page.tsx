"use client";

import { FormEvent, KeyboardEvent, useRef, useState } from "react";
import { MAX_BIO_LENGTH } from "@/lib/validation";

type Provider = "openai" | "claude";

function FlameIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13.1 2.6c.5 3.5-1.2 4.7-2.7 6.2-1.4 1.4-2.7 2.7-2.7 5.3a4.5 4.5 0 0 0 9 0c0-2.4-1.1-4.2-3.6-6.2.2 2.4-1 3.2-2 3.5 1-3.4 1.8-5.3 2-8.8Z"
        fill="currentColor"
      />
      <path d="M5.3 15.2a6.7 6.7 0 0 0 13.4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m12 2 1.8 7.2L21 11l-7.2 1.8L12 20l-1.8-7.2L3 11l7.2-1.8L12 2Z" fill="currentColor" />
      <path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" fill="currentColor" />
    </svg>
  );
}

export default function Home() {
  const [bio, setBio] = useState("");
  const [roast, setRoast] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<Provider>("openai");
  const [apiError, setApiError] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const charCount = Array.from(bio).length;
  const canRoast = bio.trim().length > 0 && charCount <= MAX_BIO_LENGTH && !isLoading;

  async function submitRoast(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canRoast) return;

    setIsLoading(true);
    setApiError("");
    setCopyError("");
    setCopied(false);
    setRoast("");

    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, provider }),
      });
      const result = await response.json() as { roast?: unknown; error?: unknown };
      if (!response.ok) {
        throw new Error(typeof result.error === "string" ? result.error : "The roast could not be generated. Please try again.");
      }
      if (typeof result.roast !== "string" || !result.roast.trim()) {
        throw new Error("The AI returned an empty roast. Please try again.");
      }
      setRoast(result.roast.trim());
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "The roast could not be generated. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  function handleBioChange(value: string) {
    const bounded = Array.from(value).slice(0, MAX_BIO_LENGTH).join("");
    setBio(bounded);
    setRoast("");
    setCopied(false);
    setCopyError("");
    setApiError("");
  }

  function handleProviderChange(value: Provider) {
    setProvider(value);
    setRoast("");
    setApiError("");
    setCopied(false);
    setCopyError("");
  }

  async function copyRoast() {
    try {
      await navigator.clipboard.writeText(roast);
      setCopied(true);
      setCopyError("");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopyError("Clipboard access was blocked. Select the roast to copy it.");
    }
  }

  return (
    <main className="app-shell min-h-screen px-5 pb-12 pt-5 sm:px-8 sm:pt-7">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <header className="site-header mx-auto flex w-full max-w-6xl items-center justify-between">
        <a href="#top" className="brand-lockup" aria-label="Bio Roaster home">
          <span className="brand-mark"><FlameIcon className="h-5 w-5" /></span>
          <span className="brand-name">BIO <span>ROASTER</span></span>
        </a>
        <div className="header-note"><span className="live-dot" /> YOUR BIO CALLED. IT NEEDS HELP.</div>
      </header>

      <section id="top" className="hero mx-auto max-w-6xl pt-16 sm:pt-24">
        <div className="hero-copy text-center">
          <div className="eyebrow"><span className="eyebrow-line" /> YOUR BIO, UNDER FIRE <span className="eyebrow-line" /></div>
          <h1>Let’s roast your<br className="sm:hidden" /> <span className="headline-accent">Instagram bio.</span></h1>
          <p>Paste your bio. Get absolutely cooked with OpenAI or Claude.</p>
        </div>

        <div className="workbench mt-10 grid gap-5 lg:grid-cols-[1fr_0.92fr] lg:gap-6">
          <section className="panel input-panel" aria-labelledby="bio-label">
            <div className="panel-topline">
              <div className="panel-label-wrap">
                <span className="step-number">01</span>
                <div>
                  <p className="panel-kicker">THE MATERIAL</p>
                  <h2 id="bio-label">Your bio</h2>
                </div>
              </div>
              <div className="input-options">
                <label className="provider-picker" htmlFor="roast-provider">
                  <span>ROAST WITH</span>
                  <select
                    id="roast-provider"
                    value={provider}
                    onChange={(event) => handleProviderChange(event.target.value as Provider)}
                    disabled={isLoading}
                  >
                    <option value="openai">OpenAI</option>
                    <option value="claude">Claude</option>
                  </select>
                </label>
                <span className="max-chip">MAX {MAX_BIO_LENGTH}</span>
              </div>
            </div>

            <form ref={formRef} onSubmit={submitRoast} className="roast-form">
              <label className="sr-only" htmlFor="bio-input">Instagram bio</label>
              <textarea
                id="bio-input"
                name="bio"
                value={bio}
                onChange={(event) => handleBioChange(event.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={MAX_BIO_LENGTH * 2}
                placeholder="Add your Instagram bio here..."
                aria-describedby="bio-help bio-count"
                autoComplete="off"
                spellCheck="false"
                disabled={isLoading}
              />

              <div className="textarea-meta">
                <span id="bio-help">No judgment. Okay, a little judgment.</span>
                <span id="bio-count" className={charCount > MAX_BIO_LENGTH - 40 ? "count-near-limit" : ""} aria-live="polite">
                  {charCount}<span className="count-divider">/</span>{MAX_BIO_LENGTH}
                </span>
              </div>

              {apiError && <p className="error-message" role="alert">{apiError}</p>}

              <button className="roast-button" type="submit" disabled={!canRoast}>
                {isLoading ? (
                  <><span className="button-spinner" aria-hidden="true" /> ASKING {provider === "openai" ? "OPENAI" : "CLAUDE"}</>
                ) : (
                  <>Roast My Bio <FlameIcon className="h-[19px] w-[19px]" /></>
                )}
                {!isLoading && <span className="button-arrow" aria-hidden="true">↗</span>}
              </button>
              <div className="form-footnote"><span className="keyboard-key">↵</span> press enter to roast <span className="footnote-separator">·</span> shift + enter for a new line</div>
              <p className="privacy-note">Your bio is sent to the selected AI provider for this roast. Bio Roaster does not save it.</p>
            </form>
          </section>

          <section className={`panel result-panel ${roast ? "has-roast" : ""}`} aria-labelledby="result-heading" aria-live="polite">
            <div className="panel-topline">
              <div className="panel-label-wrap">
                <span className="step-number step-number-result">02</span>
                <div>
                  <p className="panel-kicker">THE VERDICT</p>
                  <h2 id="result-heading">The roast</h2>
                </div>
              </div>
              {roast && <span className="result-badge"><span /> FRESH OFF THE GRILL</span>}
            </div>

            <div className="result-content">
              {isLoading ? (
                <div className="loading-state" role="status">
                  <div className="loading-orbit"><FlameIcon className="h-7 w-7" /></div>
                  <p>Analyzing your bio<span className="loading-dots"><i>.</i><i>.</i><i>.</i></span></p>
                  <span className="loading-subtitle">Finding the weak spot</span>
                </div>
              ) : roast ? (
                <div className="roast-result">
                  <div className="result-quote-mark">“</div>
                  <p className="roast-text">{roast}</p>
                  <div className="result-divider"><span /> <FlameIcon className="h-4 w-4" /> <span /></div>
                  <div className="result-actions">
                    <button type="button" className="copy-button" onClick={copyRoast}>
                      {copied ? <><span className="checkmark">✓</span> Copied</> : <>Copy roast <span aria-hidden="true">⧉</span></>}
                    </button>
                    <button type="button" className="again-button" onClick={() => formRef.current?.requestSubmit()} disabled={isLoading || !bio.trim()}>
                      Roast again <span aria-hidden="true">↻</span>
                    </button>
                  </div>
                  {copyError && <p className="copy-error" role="status">{copyError}</p>}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-art" aria-hidden="true">
                    <div className="empty-ring ring-back" />
                    <div className="empty-ring ring-front" />
                    <div className="empty-icon"><FlameIcon className="h-8 w-8" /></div>
                    <Sparkle className="sparkle sparkle-one" />
                    <Sparkle className="sparkle sparkle-two" />
                    <span className="spark-dot" />
                  </div>
                  <p className="empty-title">Your roast is<br />warming up.</p>
                  <p className="empty-description">Drop your bio in the box.<br />We’ll take it from here.</p>
                  <span className="empty-tag">AWAITING INPUT</span>
                </div>
              )}
            </div>
          </section>
        </div>

        <footer className="page-footer mx-auto flex max-w-6xl items-center justify-between">
          <span>MADE FOR THE MAIN CHARACTER IN YOU</span>
          <span className="footer-right"><span className="footer-flame"><FlameIcon className="h-3.5 w-3.5" /></span> AI ROASTS · NOT SAVED BY THIS APP</span>
        </footer>
      </section>
    </main>
  );
}

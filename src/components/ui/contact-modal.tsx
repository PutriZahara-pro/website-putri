"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useLang } from "@/contexts/LangContext";

interface ContactModalProps {
  onClose: () => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id: string) => void;
      remove: (id: string) => void;
    };
  }
}

const MAX_NAME    = 100;
const MAX_EMAIL   = 254;
const MAX_MESSAGE = 5000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; // same rule as /api/contact

type FieldErrors = { name?: boolean; email?: boolean; message?: boolean };

export function ContactModal({ onClose }: ContactModalProps) {
  const overlayRef  = useRef<HTMLDivElement>(null);
  const dialogRef   = useRef<HTMLDivElement>(null);
  const widgetRef   = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string>("");
  const tokenRef    = useRef<string>("");
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const pollTimerRef  = useRef<number | null>(null);
  const renderTimerRef = useRef<number | null>(null);
  const mountedRef    = useRef(true);
  const { lang }    = useLang();

  const [step,    setStep]    = useState<"form" | "sending" | "done" | "error">("form");
  const [waiting, setWaiting] = useState(false);
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [hp,      setHp]      = useState("");
  const [errors,  setErrors]  = useState<FieldErrors>({});

  // Keep Tab inside the dialog, and give focus back to whatever opened it.
  // Declared before the autofocus effect so it still sees the opener.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !dialogRef.current) return;
      const items = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([tabindex="-1"]), textarea, iframe, [tabindex]:not([tabindex="-1"])',
      );
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, []);

  // Mount + autofocus first field
  useEffect(() => {
    mountedRef.current = true;
    firstFieldRef.current?.focus();
    return () => { mountedRef.current = false; };
  }, []);

  // Escape key closes modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll while modal open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Load Turnstile invisibly in the background while user fills form
  useEffect(() => {
    const existing = document.getElementById("cf-turnstile-script");
    if (!existing) {
      const s = document.createElement("script");
      s.id    = "cf-turnstile-script";
      s.src   = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      s.async = true;
      document.head.appendChild(s);
    }

    const tryRender = () => {
      if (!mountedRef.current) return;
      if (window.turnstile && widgetRef.current && !widgetIdRef.current) {
        widgetIdRef.current = window.turnstile.render(widgetRef.current, {
          sitekey:    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
          theme:      "dark",
          appearance: "interaction-only",
          callback:   (tok: string) => {
            if (!mountedRef.current) return;
            tokenRef.current = tok;
            setWaiting(false);
          },
        });
      } else if (!window.turnstile) {
        renderTimerRef.current = window.setTimeout(tryRender, 300);
      }
    };
    renderTimerRef.current = window.setTimeout(tryRender, 100);

    return () => {
      if (renderTimerRef.current) window.clearTimeout(renderTimerRef.current);
      if (pollTimerRef.current)   window.clearTimeout(pollTimerRef.current);
      if (window.turnstile && widgetIdRef.current) {
        try { window.turnstile.remove(widgetIdRef.current); } catch { /* already removed */ }
      }
    };
  }, []);

  const handleOverlay = useCallback((e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  }, [onClose]);

  const doSubmit = useCallback(async (token: string) => {
    setStep("sending");
    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, email, message, token, _hp: hp }),
      });
      if (!mountedRef.current) return;
      setStep(res.ok ? "done" : "error");
    } catch {
      if (mountedRef.current) setStep("error");
    }
  }, [name, email, message, hp]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    // Tell the visitor what is missing instead of silently ignoring the click
    const next: FieldErrors = {
      name:    !name.trim(),
      email:   !EMAIL_REGEX.test(email.trim()),
      message: !message.trim(),
    };
    if (next.name || next.email || next.message) {
      setErrors(next);
      const firstId = next.name ? "contact-name" : next.email ? "contact-email" : "contact-message";
      document.getElementById(firstId)?.focus();
      return;
    }
    setErrors({});

    if (tokenRef.current) {
      doSubmit(tokenRef.current);
      return;
    }

    setWaiting(true);
    const deadline = Date.now() + 4000;
    const poll = () => {
      if (!mountedRef.current) return;
      if (tokenRef.current) { doSubmit(tokenRef.current); return; }
      if (Date.now() > deadline) { doSubmit(tokenRef.current || ""); return; }
      pollTimerRef.current = window.setTimeout(poll, 150);
    };
    poll();
  }, [name, email, message, doSubmit]);

  const isForm = step === "form";
  const missing = [
    errors.name    && (lang === "fr" ? "votre nom" : "your name"),
    errors.email   && (lang === "fr" ? "un e-mail valide" : "a valid email"),
    errors.message && (lang === "fr" ? "votre message" : "your message"),
  ].filter(Boolean).join(", ");

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlay}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        className="relative w-full max-w-md mx-4"
        style={{ border: "1px solid rgba(255,255,255,0.12)", background: "#080808" }}
      >
        {/* Title bar */}
        <div
          className="flex items-center justify-between px-4 border-b"
          style={{ height: 32, borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
        >
          <span id="contact-modal-title" className="text-[8px] font-mono tracking-[0.35em] uppercase text-white/55">
            contact.txt
          </span>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-[16px] bg-transparent border-none cursor-pointer leading-none"
            aria-label={lang === "fr" ? "Fermer" : "Close"}
          >
            ×
          </button>
        </div>

        <div className="px-8 py-8">
          {isForm && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              {/* Honeypot */}
              <input
                type="text" name="_hp" value={hp} onChange={e => setHp(e.target.value)}
                tabIndex={-1} aria-hidden="true" autoComplete="off"
                style={{ position: "absolute", opacity: 0, pointerEvents: "none", height: 0 }}
              />

              <div className="flex flex-col gap-1">
                <label htmlFor="contact-name" className="text-[8px] font-mono tracking-[0.3em] uppercase text-white/65">
                  {lang === "fr" ? "Nom" : "Name"}
                </label>
                <input
                  ref={firstFieldRef}
                  id="contact-name" name="name"
                  required maxLength={MAX_NAME} autoComplete="name"
                  value={name} onChange={e => setName(e.target.value)}
                  aria-invalid={errors.name || undefined}
                  aria-describedby={errors.name ? "contact-errors" : undefined}
                  className="bg-transparent text-white text-[12px] font-mono px-3 py-2 outline-none focus:border-white/40"
                  style={{ border: "1px solid rgba(255,255,255,0.12)" }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="contact-email" className="text-[8px] font-mono tracking-[0.3em] uppercase text-white/65">
                  Email
                </label>
                <input
                  id="contact-email" name="email"
                  required type="email" maxLength={MAX_EMAIL} autoComplete="email"
                  value={email} onChange={e => setEmail(e.target.value)}
                  aria-invalid={errors.email || undefined}
                  aria-describedby={errors.email ? "contact-errors" : undefined}
                  className="bg-transparent text-white text-[12px] font-mono px-3 py-2 outline-none focus:border-white/40"
                  style={{ border: "1px solid rgba(255,255,255,0.12)" }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="contact-message" className="text-[8px] font-mono tracking-[0.3em] uppercase text-white/65">
                  Message
                </label>
                <textarea
                  id="contact-message" name="message"
                  required rows={4} maxLength={MAX_MESSAGE}
                  value={message} onChange={e => setMessage(e.target.value)}
                  aria-invalid={errors.message || undefined}
                  aria-describedby={errors.message ? "contact-errors" : undefined}
                  className="bg-transparent text-white text-[12px] font-mono px-3 py-2 outline-none resize-none focus:border-white/40"
                  style={{ border: "1px solid rgba(255,255,255,0.12)" }}
                />
                <span className="text-[8px] font-mono text-white/50 text-right" aria-hidden="true">
                  {message.length} / {MAX_MESSAGE}
                </span>
              </div>

              {missing && (
                <p id="contact-errors" role="alert" className="text-[10px] font-mono tracking-[0.1em] text-red-300">
                  {lang === "fr" ? `Merci d'indiquer ${missing}.` : `Please enter ${missing}.`}
                </p>
              )}

              <button
                type="submit"
                disabled={waiting}
                className="text-[9px] font-mono tracking-[0.35em] uppercase text-white/80 hover:text-white py-3 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-wait"
                style={{ border: "1px solid rgba(255,255,255,0.25)", background: "transparent" }}
              >
                {waiting
                  ? (lang === "fr" ? "Vérification…" : "Verifying…")
                  : (lang === "fr" ? "Envoyer →" : "Send →")}
              </button>

              <p className="text-[9px] font-mono leading-[1.6] text-white/55">
                {lang === "fr"
                  ? "Vos nom, e-mail et message servent uniquement à vous répondre. Formulaire protégé contre le spam par Cloudflare. "
                  : "Your name, email and message are only used to reply to you. Spam protection by Cloudflare. "}
                <Link href="/legal#confidentialite" onClick={onClose} className="underline underline-offset-2 text-white/75 hover:text-white">
                  {lang === "fr" ? "Confidentialité" : "Privacy"}
                </Link>
              </p>
            </form>
          )}

          {step === "sending" && (
            <p className="text-white/65 text-[10px] font-mono tracking-[0.25em] uppercase text-center py-4" role="status">
              {lang === "fr" ? "Envoi en cours…" : "Sending…"}
            </p>
          )}

          {step === "done" && (
            <div className="flex flex-col items-center gap-3 py-4" role="status">
              <span className="text-white text-2xl" aria-hidden="true">✓</span>
              <p className="text-white/70 text-[11px] font-mono tracking-[0.2em] uppercase text-center">
                {lang === "fr" ? "Message envoyé — merci !" : "Message sent — thank you!"}
              </p>
            </div>
          )}

          {step === "error" && (
            <div className="flex flex-col items-center gap-3 py-4" role="alert">
              <p className="text-red-400 text-[11px] font-mono tracking-[0.2em] uppercase text-center">
                {lang === "fr" ? "Erreur — réessaie plus tard." : "Error — please try again later."}
              </p>
              <button
                onClick={() => {
                  setStep("form");
                  setWaiting(false);
                  tokenRef.current = "";
                  try {
                    if (window.turnstile && widgetIdRef.current) {
                      window.turnstile.reset(widgetIdRef.current);
                    }
                  } catch { /* widget may have been cleaned up */ }
                }}
                className="text-white/70 text-[9px] font-mono tracking-[0.2em] uppercase hover:text-white bg-transparent border-none cursor-pointer"
              >
                {lang === "fr" ? "Réessayer" : "Retry"}
              </button>
            </div>
          )}
        </div>

        {/* Turnstile — always in DOM so widget survives step changes */}
        <div ref={widgetRef} style={{ padding: "0 32px 8px" }} />
      </div>
    </div>
  );
}

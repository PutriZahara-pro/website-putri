"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useLang } from "@/contexts/LangContext";
import t from "@/lib/translations";

interface ContactModalProps {
  onClose: () => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id: string) => void;
    };
    _cfTurnstileCallback?: (token: string) => void;
  }
}

export function ContactModal({ onClose }: ContactModalProps) {
  const overlayRef  = useRef<HTMLDivElement>(null);
  const widgetRef   = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string>("");
  const tokenRef    = useRef<string>("");
  const { lang }    = useLang();

  const [step,    setStep]    = useState<"form" | "sending" | "done" | "error">("form");
  const [waiting, setWaiting] = useState(false); // waiting for token before submit
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [hp,      setHp]      = useState(""); // honeypot

  // Load Turnstile invisibly in the background while user fills form
  useEffect(() => {
    window._cfTurnstileCallback = (tok: string) => {
      tokenRef.current = tok;
      setWaiting(false);
    };

    const existing = document.getElementById("cf-turnstile-script");
    if (!existing) {
      const s = document.createElement("script");
      s.id    = "cf-turnstile-script";
      s.src   = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      s.async = true;
      document.head.appendChild(s);
    }

    const tryRender = () => {
      if (window.turnstile && widgetRef.current && !widgetIdRef.current) {
        widgetIdRef.current = window.turnstile.render(widgetRef.current, {
          sitekey:     process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
          theme:       "dark",
          appearance:  "interaction-only",
          callback:    "_cfTurnstileCallback",
        });
      } else if (!window.turnstile) {
        setTimeout(tryRender, 300);
      }
    };
    setTimeout(tryRender, 100);

    return () => { delete window._cfTurnstileCallback; };
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
      setStep(res.ok ? "done" : "error");
    } catch {
      setStep("error");
    }
  }, [name, email, message, hp]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    if (tokenRef.current) {
      doSubmit(tokenRef.current);
      return;
    }

    // Token not ready yet — wait up to 4s
    setWaiting(true);
    const deadline = Date.now() + 4000;
    const poll = () => {
      if (tokenRef.current) { doSubmit(tokenRef.current); return; }
      if (Date.now() > deadline) { doSubmit(""); return; } // submit without token, server decides
      setTimeout(poll, 150);
    };
    poll();
  }, [name, email, message, doSubmit]);

  const isForm = step === "form";

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlay}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="relative w-full max-w-md"
        style={{ border: "1px solid rgba(255,255,255,0.12)", background: "#080808" }}
      >
        {/* Title bar */}
        <div
          className="flex items-center justify-between px-4 border-b"
          style={{ height: 32, borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
        >
          <span className="text-[8px] font-mono tracking-[0.35em] uppercase text-white/25">contact.txt</span>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white text-[16px] bg-transparent border-none cursor-pointer leading-none"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <div className="px-8 py-8">

          {/* STEP: form */}
          {isForm && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Honeypot */}
              <input
                type="text" name="_hp" value={hp} onChange={e => setHp(e.target.value)}
                tabIndex={-1} aria-hidden="true"
                style={{ position: "absolute", opacity: 0, pointerEvents: "none", height: 0 }}
              />

              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-mono tracking-[0.3em] uppercase text-white/30">
                  {lang === "fr" ? "Nom" : "Name"}
                </label>
                <input
                  required value={name} onChange={e => setName(e.target.value)}
                  className="bg-transparent text-white text-[12px] font-mono px-3 py-2 outline-none"
                  style={{ border: "1px solid rgba(255,255,255,0.12)" }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-mono tracking-[0.3em] uppercase text-white/30">Email</label>
                <input
                  required type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="bg-transparent text-white text-[12px] font-mono px-3 py-2 outline-none"
                  style={{ border: "1px solid rgba(255,255,255,0.12)" }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-mono tracking-[0.3em] uppercase text-white/30">Message</label>
                <textarea
                  required rows={4} value={message} onChange={e => setMessage(e.target.value)}
                  className="bg-transparent text-white text-[12px] font-mono px-3 py-2 outline-none resize-none"
                  style={{ border: "1px solid rgba(255,255,255,0.12)" }}
                />
              </div>

              {/* Turnstile widget — appearance:interaction-only hides unless challenge needed */}
              <div ref={widgetRef} />

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
            </form>
          )}

          {/* STEP: sending */}
          {step === "sending" && (
            <p className="text-white/45 text-[10px] font-mono tracking-[0.25em] uppercase text-center py-4">
              {lang === "fr" ? "Envoi en cours…" : "Sending…"}
            </p>
          )}

          {/* STEP: done */}
          {step === "done" && (
            <div className="flex flex-col items-center gap-3 py-4">
              <span className="text-white text-2xl">✓</span>
              <p className="text-white/70 text-[11px] font-mono tracking-[0.2em] uppercase text-center">
                {lang === "fr" ? "Message envoyé — merci !" : "Message sent — thank you!"}
              </p>
            </div>
          )}

          {/* STEP: error */}
          {step === "error" && (
            <div className="flex flex-col items-center gap-3 py-4">
              <p className="text-red-400 text-[11px] font-mono tracking-[0.2em] uppercase text-center">
                {lang === "fr" ? "Erreur — réessaie plus tard." : "Error — please try again later."}
              </p>
              <button
                onClick={() => {
                  setStep("form");
                  tokenRef.current = "";
                  if (window.turnstile && widgetIdRef.current) {
                    window.turnstile.reset(widgetIdRef.current);
                    widgetIdRef.current = "";
                  }
                }}
                className="text-white/40 text-[9px] font-mono tracking-[0.2em] uppercase hover:text-white bg-transparent border-none cursor-pointer"
              >
                {lang === "fr" ? "Réessayer" : "Retry"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

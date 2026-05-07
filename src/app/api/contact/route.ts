import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const getResend = () => new Resend(process.env.RESEND_API_KEY);

// Limits
const MAX_NAME    = 100;
const MAX_EMAIL   = 254; // RFC 5321
const MAX_MESSAGE = 5000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// HTML escape — prevents XSS in outgoing email
const esc = (s: string) =>
  s.replace(/&/g, "&amp;")
   .replace(/</g, "&lt;")
   .replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;")
   .replace(/'/g, "&#39;");

// In-memory rate limit (resets on cold start; fine for low traffic)
const rateLimitMap = new Map<string, { count: number; ts: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.ts > 60_000) {
    rateLimitMap.set(ip, { count: 1, ts: now });
    return false;
  }
  if (entry.count >= 3) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid_body" }, { status: 400 });

  const { name, email, message, token, _hp } = body;

  // Honeypot — silently succeed for bots, drop the request
  if (_hp) return NextResponse.json({ ok: true });

  // Type + length + format validation
  if (
    typeof name    !== "string" ||
    typeof email   !== "string" ||
    typeof message !== "string" ||
    typeof token   !== "string"
  ) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  const trimmedName    = name.trim();
  const trimmedEmail   = email.trim();
  const trimmedMessage = message.trim();

  if (
    !trimmedName    || trimmedName.length    > MAX_NAME    ||
    !trimmedEmail   || trimmedEmail.length   > MAX_EMAIL   ||
    !trimmedMessage || trimmedMessage.length > MAX_MESSAGE
  ) {
    return NextResponse.json({ error: "invalid_length" }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  // Turnstile verification — required
  if (!token) {
    return NextResponse.json({ error: "captcha_required" }, { status: 400 });
  }
  const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret:   process.env.TURNSTILE_SECRET,
      response: token,
      remoteip: ip,
    }),
  });
  const cfResult = await verify.json();
  if (!cfResult.success) {
    return NextResponse.json({ error: "captcha_failed" }, { status: 400 });
  }

  // Build HTML — every interpolation is escaped
  const safeName    = esc(trimmedName);
  const safeEmail   = esc(trimmedEmail);
  const safeMessage = esc(trimmedMessage);

  const { error } = await getResend().emails.send({
    from:    "Portfolio Contact <onboarding@resend.dev>",
    to:      process.env.CONTACT_EMAIL!,
    replyTo: trimmedEmail,
    subject: `[Portfolio] Message de ${trimmedName.slice(0, 60)}`,
    html: `
      <div style="font-family:monospace;background:#0a0a0a;color:#e5e5e5;padding:32px;border-radius:4px;">
        <p style="color:#666;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:16px;">
          Nouveau message via portfolio
        </p>
        <p><strong style="color:#fff;">De :</strong> ${safeName} &lt;${safeEmail}&gt;</p>
        <hr style="border:none;border-top:1px solid #222;margin:16px 0;" />
        <p style="line-height:1.8;white-space:pre-wrap;">${safeMessage}</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend error:", { code: error.name, message: error.message });
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

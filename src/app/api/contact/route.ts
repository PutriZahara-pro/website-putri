import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const getResend = () => new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiter (resets on cold start)
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

  // Honeypot — bots fill this hidden field
  if (_hp) return NextResponse.json({ ok: true }); // silently succeed

  // Basic validation
  if (!name || !email || !message || !token) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  // Verify Turnstile token
  const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET,
      response: token,
      remoteip: ip,
    }),
  });
  const cfResult = await verify.json();
  if (!cfResult.success) {
    return NextResponse.json({ error: "captcha_failed" }, { status: 400 });
  }

  // Send email via Resend
  const { error } = await getResend().emails.send({
    from: "Portfolio Contact <onboarding@resend.dev>",
    to: process.env.CONTACT_EMAIL!,
    replyTo: email,
    subject: `[Portfolio] Message de ${name}`,
    html: `
      <div style="font-family:monospace;background:#0a0a0a;color:#e5e5e5;padding:32px;border-radius:4px;">
        <p style="color:#666;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:16px;">
          Nouveau message via portfolio
        </p>
        <p><strong style="color:#fff;">De :</strong> ${name} &lt;${email}&gt;</p>
        <hr style="border:none;border-top:1px solid #222;margin:16px 0;" />
        <p style="line-height:1.8;white-space:pre-wrap;">${message.replace(/</g, "&lt;")}</p>
        <hr style="border:none;border-top:1px solid #222;margin:16px 0;" />
        <p style="color:#444;font-size:10px;">Envoyé depuis putrizahara.com · IP: ${ip}</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

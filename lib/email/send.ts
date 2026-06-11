import "server-only";

import { EMAIL_FROM, getResendClient } from "./client";
import { welcomeEmailHtml, welcomeEmailText } from "./templates";

type SendResult = { ok: boolean; error?: string };

export async function sendWelcomeEmail({
  to,
  contactName,
  companyName,
  planName,
}: {
  to: string;
  contactName: string;
  companyName: string;
  planName?: string;
}): Promise<SendResult> {
  const resend = getResendClient();

  if (!resend) {
    // Email not configured — skip silently in dev, log in prod
    if (process.env.NODE_ENV === "production") {
      console.warn("[email] RESEND_API_KEY not set — welcome email skipped.");
    }

    return { ok: true };
  }

  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: `Bienvenido a AutonomIA, ${contactName.split(" ")[0]}`,
      html: welcomeEmailHtml({ contactName, companyName, planName }),
      text: welcomeEmailText({ contactName, companyName, planName }),
    });

    if (error) {
      console.error("[email] sendWelcomeEmail error:", error);

      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Email send failed.";

    console.error("[email] sendWelcomeEmail exception:", message);

    return { ok: false, error: message };
  }
}

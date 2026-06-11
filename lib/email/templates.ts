export function welcomeEmailHtml({
  contactName,
  companyName,
  planName = "Gratuito",
}: {
  contactName: string;
  companyName: string;
  planName?: string;
}) {
  const firstName = contactName.split(" ")[0] ?? contactName;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenido a AutonomIA</title>
</head>
<body style="margin:0;padding:0;background:#050816;font-family:system-ui,-apple-system,sans-serif;color:#f1f5f9;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#050816;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:600px;background:#0f1729;border-radius:24px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e3a8a,#4c1d95);padding:40px 40px 32px;text-align:center;">
              <p style="margin:0;font-size:28px;font-weight:900;color:#fff;letter-spacing:-0.5px;">AutonomIA</p>
              <p style="margin:8px 0 0;font-size:13px;font-weight:600;color:rgba(255,255,255,0.6);letter-spacing:2px;text-transform:uppercase;">Plataforma IA para negocios locales</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 8px;font-size:24px;font-weight:900;color:#f1f5f9;">¡Hola, ${firstName}! 👋</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#94a3b8;">
                Tu cuenta de <strong style="color:#f1f5f9;">${companyName}</strong> está lista. Ya puedes acceder a tu panel y empezar a usar AutonomIA.
              </p>

              <table width="100%" style="background:rgba(255,255,255,0.04);border-radius:16px;border:1px solid rgba(255,255,255,0.08);margin-bottom:24px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="margin:0 0 16px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#7c3aed;">Tu plan</p>
                    <p style="margin:0;font-size:22px;font-weight:900;color:#f1f5f9;">${planName}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#f1f5f9;">Para empezar te recomendamos:</p>
              <table width="100%" style="margin-bottom:32px;">
                <tr><td style="padding:8px 0;font-size:14px;color:#94a3b8;">✦&nbsp; Completa el perfil de tu empresa</td></tr>
                <tr><td style="padding:8px 0;font-size:14px;color:#94a3b8;">✦&nbsp; Configura el tono y objetivo IA</td></tr>
                <tr><td style="padding:8px 0;font-size:14px;color:#94a3b8;">✦&nbsp; Crea tu primera publicación con SocialIA</td></tr>
              </table>

              <table width="100%">
                <tr>
                  <td align="center">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://autonomia.app"}/dashboard"
                       style="display:inline-block;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;font-weight:700;font-size:15px;text-decoration:none;padding:16px 40px;border-radius:16px;box-shadow:0 0 32px rgba(124,58,237,0.35);">
                      Entrar al dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <p style="margin:0;font-size:12px;color:#475569;">
                Recibiste este email porque te registraste en AutonomIA.<br/>
                Si tienes dudas, responde a este correo o escríbenos.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function welcomeEmailText({
  contactName,
  companyName,
  planName = "Gratuito",
}: {
  contactName: string;
  companyName: string;
  planName?: string;
}) {
  const firstName = contactName.split(" ")[0] ?? contactName;

  return `Hola, ${firstName}!

Tu cuenta de ${companyName} en AutonomIA está lista con el plan ${planName}.

Para empezar:
- Completa el perfil de tu empresa
- Configura el tono y objetivo IA
- Crea tu primera publicación con SocialIA

Entra en: ${process.env.NEXT_PUBLIC_APP_URL ?? "https://autonomia.app"}/dashboard

Si tienes dudas, responde a este correo.

— El equipo de AutonomIA`;
}

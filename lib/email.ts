export async function sendAdminEmail({ subject, html }: { subject: string; html: string }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set -- skipping admin notification email.");
    return;
  }

  const toEmail = process.env.ADMIN_EMAIL || "liamhdp.alt@gmail.com";
  // Must use onboarding@resend.dev unless you own and verified a custom domain in Resend
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Resend API Failed:", errorData);
    throw new Error(`Resend API Error: ${errorData.message || response.statusText}`);
  }
}
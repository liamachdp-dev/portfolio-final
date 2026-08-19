export async function sendAdminEmail({ subject, html }: { subject: string; html: string }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set -- skipping admin notification email.");
    return;
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: process.env.ADMIN_EMAIL,
      subject,
      html,
    }),
  });
}
export async function sendAdminEmail({
  subject,
  html,
}: {
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is missing from environment variables."
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "onboarding@resend.dev",
      to: ["liamhdp.alt@gmail.com"],
      subject,
      html,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("Resend API Delivery Failed:", data);
    throw new Error(
      data.message || `Resend request failed with status ${response.status}`
    );
  }

  return data;
}
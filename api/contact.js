export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { name, email, message } = body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields: name, email, or message." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO_EMAIL = process.env.CONTACT_EMAIL || "mahiagarwal985@gmail.com";

    if (!RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY in environment variables.");
      return res.status(500).json({
        error: "Server configuration error. Please ensure RESEND_API_KEY is configured in Vercel.",
      });
    }

    // Call Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [TO_EMAIL],
        reply_to: email,
        subject: `New Portfolio Message from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #18181b; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 8px; padding: 24px;">
            <h2 style="color: #9333ea; margin-top: 0;">New Message from Portfolio Website</h2>
            <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 16px 0;" />
            <p><strong>Sender Name:</strong> ${name}</p>
            <p><strong>Sender Email:</strong> <a href="mailto:${email}" style="color: #9333ea;">${email}</a></p>
            <p><strong>Message:</strong></p>
            <div style="background-color: #f4f4f5; padding: 16px; border-radius: 6px; white-space: pre-wrap; font-size: 14px;">${message}</div>
            <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 20px 0 12px;" />
            <p style="font-size: 12px; color: #71717a; margin-bottom: 0;">You can directly hit "Reply" to reply to ${name} (${email}).</p>
          </div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", data);
      return res.status(response.status).json({ error: data.message || "Failed to send email via Resend." });
    }

    return res.status(200).json({ success: true, message: "Email sent successfully!", id: data.id });
  } catch (error) {
    console.error("Serverless function error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

// Contact form mailer. Posts the form payload to the hosted mail service
// configured via NEXT_PUBLIC_MAILER_API (e.g. https://organic-mail.onrender.com/users).
const MAILER_API = process.env.NEXT_PUBLIC_MAILER_API;

/**
 * Send a contact-form submission to the mailer API.
 * @param {{name:string, phone:string, email:string, message:string, product?:string}} payload
 * @returns {Promise<object>} parsed JSON response (or {} if the body isn't JSON)
 * @throws if the network call fails or the API returns a non-2xx status
 */
export async function sendContact(payload) {
  if (!MAILER_API) throw new Error("NEXT_PUBLIC_MAILER_API is not configured");

  const res = await fetch(MAILER_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  // The API replies { success: boolean, message: string }.
  // Treat a non-2xx status OR success:false as a failure, surfacing its message.
  if (!res.ok || data?.success === false) {
    throw new Error(data?.message || `Mailer responded with ${res.status}`);
  }

  return data; // e.g. { success: true, message: "Email sent successfully" }
}

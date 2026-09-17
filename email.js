const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";

export async function sendOrderEmail(order) {
  const res = await fetch(
    `${SUPABASE_URL}/functions/v1/send-order-email`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    }
  );

  if (!res.ok) {
    throw new Error("Email failed.");
  }

  return await res.json();
}
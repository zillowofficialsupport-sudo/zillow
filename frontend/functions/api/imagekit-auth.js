export async function onRequestGet({ request, env }) {
  if (!env.IMAGEKIT_PRIVATE_KEY || !env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    return Response.json({ error: "ImageKit is not configured" }, { status: 503 });
  }

  const authorization = request.headers.get("Authorization") || "";
  const accessToken = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";
  if (!accessToken) {
    return Response.json({ error: "Authentication required" }, { status: 401 });
  }

  const authResponse = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: env.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!authResponse.ok) {
    return Response.json({ error: "Invalid session" }, { status: 401 });
  }

  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 30 * 60;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(env.IMAGEKIT_PRIVATE_KEY),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  const signatureBytes = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${token}${expire}`)
  );
  const signature = [...new Uint8Array(signatureBytes)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return Response.json({ token, expire, signature }, {
    headers: { "Cache-Control": "no-store" },
  });
}

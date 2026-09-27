import { createClient } from "@supabase/supabase-js";
import { createHmac, randomUUID } from "node:crypto";

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  IMAGEKIT_PUBLIC_KEY,
  IMAGEKIT_PRIVATE_KEY,
} = process.env;

const missing = [
  ["SUPABASE_URL", SUPABASE_URL],
  ["SUPABASE_SERVICE_ROLE_KEY", SUPABASE_SERVICE_ROLE_KEY],
  ["IMAGEKIT_PUBLIC_KEY", IMAGEKIT_PUBLIC_KEY],
  ["IMAGEKIT_PRIVATE_KEY", IMAGEKIT_PRIVATE_KEY],
].filter(([, value]) => !value).map(([name]) => name);

if (missing.length) {
  throw new Error(`Missing migration environment variables: ${missing.join(", ")}`);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: photos, error: selectError } = await supabase
  .from("listing_photos")
  .select("image_url")
  .like("image_url", "https://villow-seeds.s3.amazonaws.com/%");

if (selectError) throw selectError;

const legacyUrls = [...new Set((photos || []).map(({ image_url }) => image_url))];
let migratedCount = 0;

for (const imageUrl of legacyUrls) {
  const sourceResponse = await fetch(imageUrl);
  if (!sourceResponse.ok) {
    throw new Error(`Could not download legacy photo (${sourceResponse.status}): ${imageUrl}`);
  }

  const source = new URL(imageUrl);
  const fileName = decodeURIComponent(source.pathname.split("/").pop());
  const token = randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 30 * 60;
  const signature = createHmac("sha1", IMAGEKIT_PRIVATE_KEY)
    .update(`${token}${expire}`)
    .digest("hex");
  const body = new FormData();
  body.append("file", new Blob([await sourceResponse.arrayBuffer()]), fileName);
  body.append("fileName", fileName);
  body.append("folder", "/villow/listings/legacy");
  body.append("publicKey", IMAGEKIT_PUBLIC_KEY);
  body.append("token", token);
  body.append("expire", String(expire));
  body.append("signature", signature);

  const uploadResponse = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    body,
  });
  const uploaded = await uploadResponse.json();
  if (!uploadResponse.ok) {
    throw new Error(`ImageKit upload failed for ${fileName}: ${uploaded.message || uploadResponse.status}`);
  }

  const { data: updatedRows, error: updateError } = await supabase
    .from("listing_photos")
    .update({ image_url: uploaded.url, file_id: uploaded.fileId })
    .eq("image_url", imageUrl)
    .select("id");

  if (updateError) throw updateError;
  migratedCount += updatedRows?.length || 0;
  console.log(`Migrated ${fileName}: ${updatedRows?.length || 0} photo records`);
}

console.log(`Done. Updated ${migratedCount} photo records from ${legacyUrls.length} unique source images.`);

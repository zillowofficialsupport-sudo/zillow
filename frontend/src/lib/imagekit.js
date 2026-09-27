import { supabase } from "./supabaseClient";

const IMAGEKIT_PUBLIC_KEY = process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY || "";
const IMAGEKIT_URL_ENDPOINT = process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT || "";

export function buildImageKitUrl(path, transforms = {}) {
  if (!path) return "";
  if (!IMAGEKIT_URL_ENDPOINT) return path;

  const endpoint = IMAGEKIT_URL_ENDPOINT.replace(/\/$/, "");
  const sourcePath = path.startsWith(endpoint)
    ? path.slice(endpoint.length)
    : path.startsWith("http")
      ? null
      : path;
  if (!sourcePath) return path;

  const transformations = Object.entries({
    w: transforms.width,
    h: transforms.height,
    q: transforms.quality,
    c: transforms.crop,
    fo: transforms.fit,
  })
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}-${value}`)
    .join(",");

  const normalizedPath = sourcePath.startsWith("/") ? sourcePath : `/${sourcePath}`;
  return `${endpoint}${transformations ? `/tr:${transformations}` : ""}${normalizedPath}`;
}

export function isImageKitConfigured() {
  return Boolean(IMAGEKIT_PUBLIC_KEY && IMAGEKIT_URL_ENDPOINT);
}

export async function uploadImageKitFile(file, folder) {
  if (!isImageKitConfigured()) {
    throw new Error("ImageKit is not configured");
  }
  if (!supabase) {
    throw new Error("Supabase is not configured");
  }
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const accessToken = data?.session?.access_token;
  if (!accessToken) throw new Error("Sign in before uploading photos.");

  const authResponse = await fetch("/api/imagekit-auth", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!authResponse.ok) {
    throw new Error("Could not authorize ImageKit upload");
  }

  const auth = await authResponse.json();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);
  formData.append("folder", folder);
  formData.append("publicKey", IMAGEKIT_PUBLIC_KEY);
  formData.append("token", auth.token);
  formData.append("expire", String(auth.expire));
  formData.append("signature", auth.signature);

  const uploadResponse = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    body: formData,
  });
  const result = await uploadResponse.json();
  if (!uploadResponse.ok) {
    throw new Error(result.message || "ImageKit upload failed");
  }

  return {
    image_url: result.url,
    file_id: result.fileId,
    is_primary: false,
  };
}

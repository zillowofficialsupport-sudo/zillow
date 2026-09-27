import { supabase, hasSupabaseConfig } from "./supabaseClient";
import { buildImageKitUrl, uploadImageKitFile } from "./imagekit";

export function normalizeListing(raw) {
  if (!raw) return null;

    const photos = raw.listing_photos || raw.photos || [];
    const photoUrls = raw.photo_urls || photos
      .map((photo) => typeof photo === "string" ? photo : photo.image_url)
      .filter(Boolean)
      .map((url) => buildImageKitUrl(url, { width: 1200, quality: 80 }));

  return {
    ...raw,
    id: raw.id,
    price: Number(raw.price ?? 0),
    bedroom: Number(raw.bedroom ?? 0),
    bathroom: Number(raw.bathroom ?? 0),
    sqft: Number(raw.sqft ?? 0),
    zipcode: raw.zipcode ?? "",
    address: raw.address ?? "",
    city: raw.city ?? "",
    state: raw.state ?? "",
    listing_type: raw.listing_type ?? "Sale",
    listingType: raw.listing_type ?? "Sale",
    buildingType: raw.building_type ?? "",
    estPayment: raw.est_payment ?? "",
    priceSqft: raw.price_sqft ?? 0,
    overview: raw.overview ?? "",
    key_words: raw.key_words ?? "",
    keyWords: raw.key_words ?? "",
    builtIn: raw.built_in ?? "",
    ownerId: raw.owner_id ?? null,
    createdAt: raw.created_at ?? raw.createdAt ?? null,
    updatedAt: raw.updated_at ?? raw.updatedAt ?? null,
    lat: raw.lat ?? null,
    lng: raw.lng ?? null,
    favorite: Boolean(raw.favorite),
    photos,
    photoUrls,
  };
}

function requireSupabase() {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error("Supabase is not configured. Add the project URL and anon key.");
  }
  return supabase;
}

async function uploadListingPhotos(listingId, files = []) {
  if (!files.length) return [];

  const uploads = await Promise.all(
    files.map((file) => uploadImageKitFile(file, `/listings/${listingId}`))
  );
  const photoRows = uploads.map((photo, index) => ({
    ...photo,
    listing_id: listingId,
    is_primary: index === 0,
  }));
  const { error } = await supabase.from("listing_photos").insert(photoRows);
  if (error) throw error;
  return photoRows;
}

export async function getSupabaseListings() {
  const client = requireSupabase();
  const { data, error } = await client
    .from("listings")
    .select(`
      *,
      listing_photos(image_url, is_primary)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeListing);
}

export async function getSupabaseListingById(listingId) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("listings")
    .select(`
      *,
      listing_photos(image_url, is_primary)
    `)
    .eq("id", listingId)
    .single();

  if (error) throw error;
  return normalizeListing(data);
}

export async function getSupabaseListingsByUserId(userId) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("listings")
    .select("*, listing_photos(image_url, file_id, is_primary)")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeListing);
}

export async function searchSupabaseListings(queryParams) {
  const client = requireSupabase();
  let query = client
    .from("listings")
    .select("*, listing_photos(image_url, file_id, is_primary)")
    .eq("status", "active");

  const searchTerm = queryParams.term;
  const searchValue = queryParams[searchTerm];
  if (searchTerm && searchValue) {
    const decodedValue = decodeURIComponent(String(searchValue));
    const column = searchTerm === "zipcode" ? "zipcode" : searchTerm;
    if (["city", "state", "zipcode"].includes(column)) {
      query = query.ilike(column, `%${decodedValue.split(",")[0].trim()}%`);
    } else if (column === "address") {
      query = query.ilike("address", `%${decodedValue}%`);
    }
  }

  if (queryParams.listing_type) query = query.eq("listing_type", queryParams.listing_type);
  if (queryParams.min_price) query = query.gte("price", Number(queryParams.min_price));
  if (queryParams.max_price) query = query.lte("price", Number(queryParams.max_price));
  if (queryParams.bedroom) query = query.gte("bedroom", Number(queryParams.bedroom));
  if (queryParams.bathroom) query = query.gte("bathroom", Number(queryParams.bathroom));

  const exclusions = Array.isArray(queryParams.excludes)
    ? queryParams.excludes
    : typeof queryParams.excludes === "string"
      ? queryParams.excludes.split(",")
      : [];
  exclusions.filter(Boolean).forEach((buildingType) => {
    query = query.neq("building_type", buildingType);
  });

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizeListing);
}

export async function createSupabaseListing(payload) {
  const client = requireSupabase();
  const { data: authData, error: authError } = await client.auth.getUser();
  if (authError) throw authError;
  if (!authData.user) throw new Error("You must be signed in to create a listing.");

  const { data, error } = await client
    .from("listings")
    .insert([
      {
        owner_id: authData.user.id,
        title: payload.title || "",
        address: payload.address,
        city: payload.city,
        state: payload.state,
        zipcode: payload.zipcode,
        listing_type: payload.listing_type,
        building_type: payload.building_type,
        est_payment: payload.est_payment || "",
        price: Number(payload.price || 0),
        price_sqft: Number(payload.price_sqft || 0),
        bedroom: Number(payload.bedroom || 0),
        bathroom: Number(payload.bathroom || 0),
        sqft: Number(payload.sqft || 0),
        built_in: Number(payload.built_in || 0),
        heating: Boolean(payload.heating),
        ac: Boolean(payload.ac),
        garage: Boolean(payload.garage),
        overview: payload.overview || "",
        key_words: payload.key_words || "",
        lat: payload.lat ?? null,
        lng: payload.lng ?? null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  let photos;
  try {
    photos = await uploadListingPhotos(data.id, payload.photos);
  } catch (uploadError) {
    await client.from("listings").delete().eq("id", data.id);
    throw uploadError;
  }
  return normalizeListing({ ...data, listing_photos: photos });
}

export async function updateSupabaseListing(listingId, payload) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("listings")
    .update({
      title: payload.title || "",
      address: payload.address,
      city: payload.city,
      state: payload.state,
      zipcode: String(payload.zipcode || ""),
      listing_type: payload.listing_type,
      building_type: payload.building_type,
      est_payment: payload.est_payment || "",
      price: Number(payload.price || 0),
      price_sqft: Number(payload.price_sqft || 0),
      bedroom: Number(payload.bedroom || 0),
      bathroom: Number(payload.bathroom || 0),
      sqft: Number(payload.sqft || 0),
      built_in: Number(payload.built_in || 0),
      heating: Boolean(payload.heating),
      ac: Boolean(payload.ac),
      garage: Boolean(payload.garage),
      overview: payload.overview || "",
      key_words: payload.key_words || "",
      lat: payload.lat ?? null,
      lng: payload.lng ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", listingId)
    .select()
    .single();

  if (error) throw error;
  const photos = await uploadListingPhotos(listingId, payload.photos);
  // Re-fetch so edits without new uploads retain the existing gallery and
  // edits with uploads return the complete listing shape to Redux.
  return getSupabaseListingById(data.id);
}

export async function getSupabaseFavorites(userId) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("favorites")
    .select("listing_id")
    .eq("user_id", userId);

  if (error) throw error;
  return data || [];
}

export async function deleteSupabaseListings(listingIds) {
  if (!listingIds.length) return;
  const client = requireSupabase();
  const { error } = await client.from("listings").delete().in("id", listingIds);
  if (error) throw error;
}

export async function setSupabaseFavorite(userId, listingId, isFavorite) {
  const client = requireSupabase();
  if (isFavorite) {
    const { error } = await client
      .from("favorites")
      .upsert(
        { user_id: userId, listing_id: listingId },
        { onConflict: "user_id,listing_id", ignoreDuplicates: true }
      );
    if (error) throw error;
    return;
  }

  const { error } = await client
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("listing_id", listingId);
  if (error) throw error;
}

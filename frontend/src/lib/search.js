import { supabase, hasSupabaseConfig } from "./supabaseClient";

export async function getSupabaseSuggestions(value, term) {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error("Supabase is not configured. Add the project URL and anon key.");
  }

  const column = term === "zipcode" ? "zipcode" : term;
  if (!["address", "city", "state", "zipcode"].includes(column)) return [];

  const { data, error } = await supabase
    .from("listings")
    .select("address, city, state, zipcode")
    .ilike(column, `%${value}%`)
    .limit(30);

  if (error) throw error;
  const suggestionValues = (data || []).map((listing) => {
    if (term === "city" || term === "state") return `${listing.city}, ${listing.state}`;
    return String(listing[column] || "");
  });
  return [...new Set(suggestionValues)].filter(Boolean).slice(0, 5);
}

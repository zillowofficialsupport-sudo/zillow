import { cleanLocalStorageSearchCredentials } from "./utils";
import { createSelector } from "reselect";
import {
  createSupabaseListing,
  deleteSupabaseListings,
  getSupabaseFavorites,
  getSupabaseListingById,
  getSupabaseListingsByUserId,
  getSupabaseListings,
  searchSupabaseListings,
  setSupabaseFavorite,
  updateSupabaseListing,
} from "../lib/listings";

const listingSelector = (state) => state.listings;

const RECEIVE_LISTINGS = "api/listings/RECEIVE_LISTINGS";
const RECEIVE_LISTING = "api/listings/RECEIVE_LISTING";
const REMOVE_LISTINGS = "api/listings/REMOVE_LISTINGS";
const RECEIVE_FAVORITES = "api/listings/RECEIVE_FAVORITES";
const REMOVE_FAVORITES = "api/listings/REMOVE_FAVORITES";
const CLEAR_LISTINGS = "api/listings/CLEAR_LISTINGS";

const receiveListings = (listings) => ({
  type: RECEIVE_LISTINGS,
  listings,
});

const receiveListing = (listing) => ({
  type: RECEIVE_LISTING,
  listing,
});

const receiveFavorites = (favorites) => ({
  type: RECEIVE_FAVORITES,
  favorites,
});

const removeFavorites = (listingId) => ({
  type: REMOVE_FAVORITES,
  listingId,
});

const clearListings = () => ({
  type: CLEAR_LISTINGS,
});

const removeListings = (listingIds) => ({
  type: REMOVE_LISTINGS,
  listingIds,
});

const indexListings = (listings) =>
  listings.reduce((indexed, listing) => ({ ...indexed, [listing.id]: listing }), {});

export const getListings = createSelector([listingSelector], (listings) => {
  if (listings) {
    return Object.values(listings);
  }

  return [];
});

export const getListing = (id) => (state) => {
  if (state && state.listings) {
    return state.listings[id];
  }

  return null;
};

export const getFavorites = createSelector([listingSelector], (listings) => {
  if (listings) {
    return Object.values(listings).filter((listing) => listing.favorite);
  }

  return [];
});

export const fetchListings = () => async (dispatch) => {
  const listings = await getSupabaseListings();
  dispatch(receiveListings(listings));
};

export const fetchListing = (id) => async (dispatch) => {
  const listing = await getSupabaseListingById(id);
  if (listing) dispatch(receiveListing(listing));
};

export const fetchListingByUserId = (userId) => async (dispatch) => {
  const listings = await getSupabaseListingsByUserId(userId);
  dispatch(receiveListings(listings));
};

export const createListing = (listing) => async (dispatch) => {
  const created = await createSupabaseListing(listing);
  dispatch(receiveListing(created));
};

export const updateListing = (listing, listingId) => async (dispatch) => {
  const updated = await updateSupabaseListing(listingId, listing);
  dispatch(receiveListing(updated));
};

export const deleteListing = (listingIds) => async (dispatch) => {
  await deleteSupabaseListings(listingIds);
  dispatch(removeListings(listingIds));
};

export const fetchUserFavorites = (userId) => async (dispatch) => {
  const favorites = await getSupabaseFavorites(userId);
  if (!favorites.length) {
    dispatch(receiveFavorites([]));
    return;
  }

  const ids = favorites.map((favorite) => favorite.listing_id);
  const listings = await getSupabaseListings();
  dispatch(receiveFavorites(listings
    .filter((listing) => ids.includes(listing.id))
    .map((listing) => ({ ...listing, favorite: true }))));
};

export const addFavorite = (userId, listingId) => async (dispatch) => {
  await setSupabaseFavorite(userId, listingId, true);
  dispatch(receiveListing({ id: listingId, favorite: true }));
};

export const removeFavorite = (userId, listingId) => async (dispatch) => {
  await setSupabaseFavorite(userId, listingId, false);
  dispatch(removeFavorites(listingId));
};

export const fetchSearchListings =
  (extraParams = {}, suggestion = null) =>
  async (dispatch) => {
    const baseParams = cleanLocalStorageSearchCredentials();
    const queryParams = typeof extraParams === "string"
      ? { ...baseParams, ...(suggestion ? { [extraParams]: suggestion } : {}), term: extraParams }
      : { ...baseParams, ...extraParams };
    const listings = await searchSupabaseListings(queryParams);
    dispatch(receiveListings(listings));
  };

export const clearAllListings = () => async (dispatch) => {
  dispatch(clearListings());
};

const listingsReducer = (state = {}, action) => {
  const newState = { ...state };

  switch (action.type) {
    case RECEIVE_LISTINGS:
      return { ...newState, ...indexListings(action.listings) };
    case RECEIVE_LISTING:
      newState[action.listing.id] = action.listing;
      return newState;
    case RECEIVE_FAVORITES:
      return { ...newState, ...indexListings(action.favorites) };
    case REMOVE_FAVORITES:
      newState[action.listingId] && (newState[action.listingId]["favorite"] = false);
      return newState;
    case REMOVE_LISTINGS:
      action.listingIds.forEach((listingId) => delete newState[listingId]);
      return newState;
    case CLEAR_LISTINGS:
      return {};
    default:
      return state;
  }
};

export default listingsReducer;

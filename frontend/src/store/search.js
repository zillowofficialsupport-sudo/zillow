import { createSelector } from "reselect";
import { getSupabaseSuggestions } from "../lib/search";

const RECEIVE_SUGGESTIONS = "api/search/RECEIVE_SUGGESTIONS";
const CLEAN_SUGGESTIONS = "CLEAN_SUGGESTIONS";

const searchSelector = (state) => state?.search;

export const getSuggestions = createSelector([searchSelector], search => {
	if (search) {
		return Object.values(search);
	}

	return null;
});

const receiveSuggestions = (suggestions) => ({
	type: RECEIVE_SUGGESTIONS,
	suggestions,
});

const cleanSuggestions = () => ({
	type: CLEAN_SUGGESTIONS,
});

export const searchSuggestions =
	(searchString, term = null) =>
	async (dispatch) => {
		const suggestions = await getSupabaseSuggestions(searchString, term);
		dispatch(receiveSuggestions(suggestions));
	};

export const cleanSearchSuggestions = () => async (dispatch) => {
	dispatch(cleanSuggestions());
};

const searchSuggestionsReducer = (state = {}, action) => {
	switch (action.type) {
		case RECEIVE_SUGGESTIONS:
			return { ...action.suggestions };
		case CLEAN_SUGGESTIONS:
			return {};
		default:
			return state;
	}
};

export default searchSuggestionsReducer;

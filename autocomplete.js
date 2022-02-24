const {
  performApiRequest, constructAuthorizationHeader, mapSettingsAndParams,
  filterAutocompleteOptions, mapAutocompleteOptions,
} = require("./helpers");

const INVALID_ARRAY_PATH_MESSAGE = "Autocomplete function is not configured correctly. API Response was received in an unexpected format.";
const PATH_UNDEFINED_MESSAGE = "Autocomplete function is not configured correctly. Option \"path\" is required.";

const AUTOCOMPLETE_OPTIONS_LIMIT = 5;

function createAutocompleteFunction({ path, resultArrayPath, requestParams }) {
  if (!path) {
    throw new Error(PATH_UNDEFINED_MESSAGE);
  }
  return async (query, pluginSettings, actionParams) => {
    const { settings, params } = mapSettingsAndParams(pluginSettings, actionParams);
    const result = await performApiRequest({
      path,
      method: "GET",
      params: {
        query,
        limit: AUTOCOMPLETE_OPTIONS_LIMIT,
        ...(requestParams || {}),
      },
      headers: constructAuthorizationHeader(params.TOKEN || settings.TOKEN),
    });
    const items = result[resultArrayPath || path];
    if (!items) {
      throw new Error(INVALID_ARRAY_PATH_MESSAGE);
    }
    const options = mapAutocompleteOptions(items);
    return filterAutocompleteOptions(options, query);
  };
}

module.exports = {
  getAllServices: createAutocompleteFunction({ path: "services", requestParams: { sort_by: "name" } }),
  getUserList: createAutocompleteFunction({ path: "users" }),
  getPriorities: createAutocompleteFunction({ path: "priorities" }),
  getEscalationPolicies: createAutocompleteFunction({ path: "escalation_policies", requestParams: { sort_by: "name" } }),
};

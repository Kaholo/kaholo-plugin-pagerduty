const {
  performApiRequest, constructAuthorizationHeader, mapSettingsAndParams,
  filterAutocompleteOptions, mapAutocompleteOptions,
} = require("./helpers");

const AUTOCOMPLETE_OPTIONS_LIMIT = 5;

function createAutocompleteFunction({ path, resultArrayPath, requestParams }) {
  return async (query, pluginSettings, actionParams) => {
    const { settings, params } = mapSettingsAndParams(pluginSettings, actionParams);
    const result = await performApiRequest({
      path,
      method: "GET",
      params: {
        query,
        limit: AUTOCOMPLETE_OPTIONS_LIMIT,
        ...requestParams,
      },
      headers: constructAuthorizationHeader(params.TOKEN || settings.TOKEN),
    });
    const options = mapAutocompleteOptions(result[resultArrayPath || path]);
    return filterAutocompleteOptions(options, query);
  };
}

module.exports = {
  getAllServices: createAutocompleteFunction({ path: "services", requestParams: { sort_by: "name" } }),
  getUserList: createAutocompleteFunction({ path: "users" }),
  getPriorities: createAutocompleteFunction({ path: "priorities" }),
  getEscalationPolicies: createAutocompleteFunction({ path: "escalation_policies", requestParams: { sort_by: "name" } }),
};

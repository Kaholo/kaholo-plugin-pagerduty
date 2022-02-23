const {
  performApiRequest, constructAuthorizationHeader, mapSettingsAndParams,
  filterAutocompleteOptions, mapAutocompleteOptions,
} = require("./helpers");

const AUTOCOMPLETE_OPTIONS_LIMIT = 5;

/**
 * This method will return to the plugin all the
 * existing services to attach to the created incident.
 */
async function getAllServices(query, pluginSettings) {
  const { settings, params } = mapSettingsAndParams(pluginSettings);
  const result = await performApiRequest({
    path: "services",
    method: "GET",
    params: {
      query,
      sort_by: "name",
      limit: AUTOCOMPLETE_OPTIONS_LIMIT,
    },
    headers: constructAuthorizationHeader(params.token || settings.TOKEN),
  });
  const options = mapAutocompleteOptions(result.services);
  return filterAutocompleteOptions(options, query);
}

/**
 * Autocomplete function for fetching all available priorities
 */
async function getPriorities(query, pluginSettings, actionParams) {
  const { settings, params } = mapSettingsAndParams(pluginSettings, actionParams);
  const result = await performApiRequest({
    path: "priorities",
    method: "GET",
    params: {
      query,
      limit: AUTOCOMPLETE_OPTIONS_LIMIT,
    },
    headers: constructAuthorizationHeader(params.token || settings.TOKEN),
  });
  const options = mapAutocompleteOptions(result.priorities);
  return filterAutocompleteOptions(options, query);
}

/**
 * Autocomplete function for fetching escalation policies
 */
async function getEscalationPolicies(query, pluginSettings, actionParams) {
  const { settings, params } = mapSettingsAndParams(pluginSettings, actionParams);
  const result = await performApiRequest({
    path: "escalation_policies",
    method: "GET",
    params: {
      query,
      sort_by: "name",
      limit: AUTOCOMPLETE_OPTIONS_LIMIT,
    },
    headers: constructAuthorizationHeader(params.token || settings.TOKEN),
  });
  const options = mapAutocompleteOptions(result.escalation_policies);
  return filterAutocompleteOptions(options, query);
}

/**
 * This method will return to the plugin all the existing users to assign to the new incident
 */
async function getUserList(query, pluginSettings) {
  const { settings, params } = mapSettingsAndParams(pluginSettings);
  const result = await performApiRequest({
    path: "users",
    method: "GET",
    params: {
      query,
      limit: AUTOCOMPLETE_OPTIONS_LIMIT,
    },
    headers: constructAuthorizationHeader(params.token || settings.TOKEN),
  });
  const options = mapAutocompleteOptions(result.users);
  return filterAutocompleteOptions(options, query);
}

module.exports = {
  getAllServices,
  getUserList,
  getPriorities,
  getEscalationPolicies,
};

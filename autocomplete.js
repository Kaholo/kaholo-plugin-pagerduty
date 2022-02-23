const {
  performApiRequest, constructAuthorizationHeader, mapSettingsAndParams,
  filterAutocompleteOptions, mapAutocompleteOptions,
} = require("./helpers");

/**
 * This method will return to the plugin all the
 * existing services to attach to the created incident.
 */
async function getAllServices(query, pluginSettings) {
  const { settings } = mapSettingsAndParams(pluginSettings);
  const result = await performApiRequest({
    path: "services",
    method: "GET",
    params: {
      query,
      sort_by: "name",
    },
    headers: constructAuthorizationHeader(settings.TOKEN),
  });
  const options = mapAutocompleteOptions(result.services);
  return filterAutocompleteOptions(options, query);
}

/**
 * This method will return to the plugin all the existing users to assign to the new incident
 */
async function getUserList(query, pluginSettings) {
  const { settings } = mapSettingsAndParams(pluginSettings);
  const result = await performApiRequest({
    path: "users",
    method: "GET",
    params: {
      query,
    },
    headers: constructAuthorizationHeader(settings.TOKEN),
  });
  const options = mapAutocompleteOptions(result.users);
  return filterAutocompleteOptions(options, query);
}

module.exports = {
  getAllServices,
  getUserList,
};

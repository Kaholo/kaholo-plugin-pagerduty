const axios = require("axios").default;

const REQUEST_FAILED_MESSSAGE = (serverMessage) => `Failed to send request to the PagerDuty API. Make sure you have required permissions and valid token.${serverMessage ? ` Server response:\n${serverMessage}` : ""}`;

const API_BASE_URL = "https://api.pagerduty.com";

/**
 * Parses the PagerDuty API error into string
 * @param {Object} responseData
 */
function parsePagerDutyErrorMessage(responseData = {}) {
  const { message, errors } = responseData.error;
  let errorResponse = `${message}\n`;
  if (errors) {
    errorResponse += errors.join("\n");
  }
  if (!message) {
    errorResponse = JSON.stringify(responseData);
  }
  return errorResponse;
}

/**
 * Constructs the Authorization header with token
 * @param {string} token
 * @returns {{ Authorization: string }}
 */
const constructAuthorizationHeader = (token) => (token ? { Authorization: `Token token=${token}` } : {});

/**
 * Constructs the From header with email
 * @param {string} email
 * @returns {{ From: string }}
 */
const constructEmailHeader = (email) => ({ From: email || "" });

/**
 * Sends the request to the PagerDuty API endpoint
 * @param {{
 *  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
 *  body?: Object
 *  path?: string
 *  params?: Object
 *  headers?: Object
 * }} options
 * @returns {Object}
 */
async function performApiRequest({
  method, data, path, params, headers,
}) {
  try {
    const response = await axios.request({
      baseURL: API_BASE_URL,
      url: path,
      method,
      params,
      data,
      headers: {
        Accept: "application/vnd.pagerduty+json;version=2",
        "Content-Type": "application/json",
        ...headers,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = parsePagerDutyErrorMessage(error.response.data);
    throw new Error(REQUEST_FAILED_MESSSAGE(errorMessage));
  }
}

/**
 * Maps the settings and params for autocomplete functions
 * @param {{ name: string, value: any }[]} arraySttngs
 * @param {{ name: string, value: any }[]} arrayParams
 * @returns {{ settings: Record<string, any>, params: Record<string, any> }}
 */
function mapSettingsAndParams(arraySttngs, arrayParams) {
  const sttngs = Object.fromEntries((arraySttngs || []).map(({ name, value }) => [name, value]));
  const params = Object.fromEntries((arrayParams || []).map(({ name, value }) => [name, value]));
  return { settings: sttngs, params };
}

/**
 * Filters out the autocomplete results by given query
 * @param {{ id: string, value: string }} autocompleteOptions
 * @param {string} query
 */
function filterAutocompleteOptions(autocompleteOptions, query) {
  if (!query) {
    return autocompleteOptions;
  }
  return autocompleteOptions.filter((option) => option.value.includes(query));
}

/**
 * Maps the API results into the autocomplete options
 * @param {{ id: string, name: string }[]} pagerdutyResults
 * @returns {{ id: string, value: string }[]}
 */
function mapAutocompleteOptions(pagerdutyResults) {
  return pagerdutyResults.map((result) => ({ id: result.id, value: result.name }));
}

module.exports = {
  performApiRequest,
  constructAuthorizationHeader,
  constructEmailHeader,
  mapSettingsAndParams,
  filterAutocompleteOptions,
  mapAutocompleteOptions,
};

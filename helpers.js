const axios = require("axios").default;
const _ = require("lodash");

const UNAUTHORIZED_MESSAGE = "Server returned HTTP 401 \"Unauthorized\". Make sure your token is correct.";
const REQUEST_FAILED_MESSSAGE = "Failed to send request to the PagerDuty API. Make sure you have required permissions and valid token.";

const API_BASE_URL = "https://api.pagerduty.com";

/**
 * Parses the PagerDuty API error into string
 * @param {Object} responseData
 */
function parsePagerDutyErrorMessage(responseData) {
  const { message, errors } = (responseData || {}).error || {};
  let errorResponse = `${message}\n`;
  if (errors) {
    errorResponse += errors.join("\n");
  }
  if (!message) {
    errorResponse = JSON.stringify(responseData);
  }
  if (responseData === "") {
    errorResponse = responseData;
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
    let errorMessage = REQUEST_FAILED_MESSSAGE;
    const serverResponse = parsePagerDutyErrorMessage(error.response.data);
    if (error.response.status === 401) {
      errorMessage = UNAUTHORIZED_MESSAGE;
    }
    if (serverResponse) {
      errorMessage += ` Server response: \n${serverResponse}`;
    }
    throw new Error(errorMessage);
  }
}

/**
 * Removes keys from object if the value is undefined or null
 * @param {Object} o
 */
function tidyObject(o) {
  const canStay = (value) => !(
    _.isNil(value) || (
      (_.isObject(value) || _.isString(value)) && _.isEmpty(value)
    )
  );
  if (_.isArray(o)) {
    return o.map((el) => tidyObject(el)).filter(canStay);
  }
  if (_.isPlainObject(o)) {
    return Object.fromEntries(Object.entries(o)
      .map(([key, value]) => [key, tidyObject(value)])
      .filter(([, value]) => canStay(value)));
  }
  return o;
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
  tidyObject,
};

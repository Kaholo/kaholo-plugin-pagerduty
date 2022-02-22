const fetch = require("node-fetch");

/**
 * This method will return to the plugin all the
 * existing services to attach to the created incident.
 */
async function getAllServices(query, pluginSettings) {
  const url = `https://api.pagerduty.com/services?query=${query}&sort_by=name`;
  const request = {
    method: "GET",
    headers: {
      Authorization: `Token token=${pluginSettings[0].value}`,
      Accept: "application/vnd.pagerduty+json;version=2",
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(url, request);
  if (!response.ok) {
    throw response;
  }
  const result = await response.json();
  const options = result.services.map((service) => ({ id: service.id, value: service.name }));
  if (!query) {
    return options;
  }
  const filteredList = options.filter((val) => val.value.includes(query));
  return filteredList;
}

/**
 * This method will return to the plugin all the existing users to assign to the new incidet
 */
async function getUserList(query, pluginSettings) {
  const url = `https://api.pagerduty.com/users?query=${query}`;
  const request = {
    method: "GET",
    headers: {
      Authorization: `Token token=${pluginSettings[0].value}`,
      Accept: "application/vnd.pagerduty+json;version=2",
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(url, request);
  if (!response.ok) {
    throw response;
  }
  const result = await response.json();
  const options = result.users.map((user) => ({ id: user.id, value: user.name }));
  if (!query) {
    return options;
  }
  const filteredList = options.filter((val) => val.value.includes(query));
  return filteredList;
}
module.exports = {
  getAllServices,
  getUserList,
};

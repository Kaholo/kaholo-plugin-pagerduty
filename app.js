const autocomplete = require("./autocomplete");
const {
  performApiRequest, constructAuthorizationHeader, constructEmailHeader,
} = require("./helpers");

/**
 * Creates a new Incident
 * Based on Docs here: https://developer.pagerduty.com/api-reference/reference/REST/openapiv3.json/paths/~1incidents/post
 */
async function createNewIncident({ params }, settings) {
  const {
    SERVICE_ID, ASSIGNEE, TITLE, EMAIL,
  } = params;
  const data = {
    incident: {
      type: "incident",
      title: TITLE,
      service: {
        id: SERVICE_ID.id,
        type: "service_reference",
      },
    },
  };
  if (ASSIGNEE) {
    data.incident.assignments = [{
      assignee: {
        id: ASSIGNEE.id,
        type: "user_reference",
      },
    }];
  }
  const result = await performApiRequest({
    method: "POST",
    path: "incidents",
    data,
    headers: {
      ...constructAuthorizationHeader(settings.TOKEN),
      ...constructEmailHeader(EMAIL),
    },
  });
  return result;
}

/**
 * Send a change events to PD Events API.
 * Based on the docs in this path: https://developer.pagerduty.com/api-reference/reference/events-v2/openapiv3.json/paths/~1change~1enqueue/post
 */
async function createChangeEvent({ params }, settings) {
  const {
    SUMMARY, ROUTING_KEY, SOURCE, CUSTOM_DETAILS,
  } = params;

  const data = {
    payload: {
      summary: SUMMARY,
      timestamp: new Date(),
    },
    routing_key: ROUTING_KEY,
  };
  if (SOURCE) {
    data.payload.source = SOURCE;
  }
  if (CUSTOM_DETAILS) {
    data.payload.CUSTOM_DETAILS = CUSTOM_DETAILS;
  }

  return performApiRequest({
    method: "POST",
    path: "https://events.pagerduty.com/v2/change/enqueue",
    data,
    headers: constructAuthorizationHeader(settings.TOKEN),
  });
}

module.exports = {
  CREATE_INCIDET: createNewIncident,
  CREATE_CHANGE_EVENT: createChangeEvent,
  ...autocomplete,
};

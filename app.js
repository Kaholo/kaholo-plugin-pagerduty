const autocomplete = require("./autocomplete");
const {
  performApiRequest, constructAuthorizationHeader, constructEmailHeader, tidyObject,
} = require("./helpers");
const parsers = require("./parsers");

/**
 * Creates a new Incident
 * Based on Docs here: https://developer.pagerduty.com/api-reference/reference/REST/openapiv3.json/paths/~1incidents/post
 */
async function createNewIncident({ params }, settings) {
  const SERVICE_ID = parsers.autocomplete(params.SERVICE_ID);
  const ASSIGNEE = parsers.autocomplete(params.ASSIGNEE);
  const TITLE = parsers.string(params.TITLE);
  const EMAIL = parsers.string(params.EMAIL);
  const TOKEN = parsers.string(params.TOKEN);
  const DETAILS = parsers.string(params.DETAILS);
  const INCIDENT_KEY = parsers.string(params.INCIDENT_KEY);
  const URGENCY = parsers.string(params.URGENCY);
  const PRIORITY = parsers.autocomplete(params.PRIORITY);
  const ESCALATION_POLICY = parsers.autocomplete(params.ESCALATION_POLICY);
  const CONFERENCE_NUMBER = parsers.string(params.CONFERENCE_NUMBER);
  const CONFERENCE_URL = parsers.string(params.CONFERENCE_URL);

  const data = {
    incident: {
      type: "incident",
      title: TITLE,
      service: {
        id: SERVICE_ID,
        type: "service_reference",
      },
      assignments: ASSIGNEE && [{
        assignee: {
          id: ASSIGNEE,
          type: "user_reference",
        },
      }],
      body: DETAILS && {
        type: "incident_body",
        details: DETAILS,
      },
      incident_key: INCIDENT_KEY,
      urgency: URGENCY,
      priority: PRIORITY && {
        type: "priority_reference",
        id: PRIORITY,
      },
      escalation_policy: ESCALATION_POLICY && {
        type: "escalation_policy_reference",
        id: ESCALATION_POLICY,
      },
      conference_bridge: {
        conference_number: CONFERENCE_NUMBER,
        conference_url: CONFERENCE_URL,
      },
    },
  };
  const result = await performApiRequest({
    method: "POST",
    path: "incidents",
    data: tidyObject(data),
    headers: {
      ...constructAuthorizationHeader(TOKEN || settings.TOKEN),
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
  const SUMMARY = parsers.string(params.SUMMARY);
  const ROUTING_KEY = parsers.string(params.ROUTING_KEY);
  const SOURCE = parsers.string(params.SOURCE);
  const CUSTOM_DETAILS = parsers.string(params.CUSTOM_DETAILS);

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

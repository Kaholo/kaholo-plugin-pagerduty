const autocomplete = require("./autocomplete");
const {
  performApiRequest, constructAuthorizationHeader, constructEmailHeader, tidyObject,
} = require("./helpers");

/**
 * Creates a new Incident
 * Based on Docs here: https://developer.pagerduty.com/api-reference/reference/REST/openapiv3.json/paths/~1incidents/post
 */
async function createNewIncident({ params }, settings) {
  const {
    SERVICE_ID, ASSIGNEE, TITLE, EMAIL, TOKEN, DETAILS, INCIDENT_KEY,
    URGENCY, PRIORITY, ESCALATION_POLICY, CONFERENCE_NUMBER, CONFERENCE_URL,
  } = params;
  const data = {
    incident: {
      type: "incident",
      title: TITLE,
      service: {
        id: SERVICE_ID.id,
        type: "service_reference",
      },
      assignments: ASSIGNEE && [{
        assignee: {
          id: ASSIGNEE.id,
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
        id: PRIORITY.id,
      },
      escalation_policy: ESCALATION_POLICY && {
        type: "escalation_policy_reference",
        id: ESCALATION_POLICY.id,
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

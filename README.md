# kaholo-plugin-pagerduty
PagerDuty plugin for Kaholo.

## Settings:
1. Token (Vault) **Required** - A unique token provided by PagerDuty for login. You can see more on generating this token [here](https://support.pagerduty.com/docs/generating-api-keys).

## Methods:

### Method: Create Incident
Creates a new incident in the specified service.

#### Parameters:
1. Email (String) **Required** - User email for login.
2. Service (Auto Complete) **Required** - The name of the service to create the incident in.
3. Title (String) **Required** - Incident title.
4. Assignee (Auto Complete) **Optional** - A user which the incident will direct too.

### Method: Create Change Event
Creates a new change event and route it to the service specified at the route.

#### Parameters:
1. Summery (String) **Required** - A brief text summary of the event.
2. Routing Key (String) **Required** - This is the 32 character Integration Key for an Integration on a Service. You can [create an Events API v2 integration on any PagerDuty service](https://support.pagerduty.com/docs/services-and-integrations#section-events-api-v2) in order to get a routing key that will route an event to that service.
3. Source (String) **Optional** - The unique name of the location where the Change Event occurred.
4. Custom Details (Object) **Optional** - Additional details about the event. Needs to be passed as an object from code.

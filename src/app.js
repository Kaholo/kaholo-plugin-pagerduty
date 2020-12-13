const fetch = require('node-fetch');
const {getAllServices, getUserList} = require('./autocomplete');

///////////////////// METHODS ///////////////////// 
async function createNewIncident(action,settings) {
    const method = "POST";
    const url = "https://api.pagerduty.com/incidents";
    const serviceId = action.params.SERVICE_ID.id;
    const userId = action.params.ASSIGNEE.id;
    const title = action.params.TITLE;
    const email = action.params.EMAIL;
    let body = {
        "incident": {
            "type": "incident",
            "title": `${title}`,
            "service": {
                "id": `${serviceId}`,
                "type": "service_reference"
            }
        }
    }
    if (typeof (userId) != 'undefined') {
        const a = {
            "id": `${userId}`,
            "type": "user_reference"
        }
        body.assignments = [a];
    }
    body = JSON.stringify(body);
    return await genericRestAPI(action,settings, method, url, body, email);
}

async function createChangeEvent (action, settings) {
    const method = "POST";
    const url = "https://api.pagerduty.com/change_events";
    return await genericRestAPI(action,settings, method, url);
}

///////////////////// HELPERS ///////////////////// 
async function genericRestAPI(action, settings, method, url, body, email) {
    /**
     * Send Default API Request
     */
    let request = {
        method: `${method}`,
        headers: {
            'Authorization': `Token token=${settings.TOKEN}`,
            'Accept': 'application/vnd.pagerduty+json;version=2',
            'Content-Type': 'application/json',
        },
        body: body
    };

    if (typeof(email) !== 'undefined') {
        request.headers.From = `${action.params.EMAIL}`
    }
    
    response = await fetch(url, request);
    if (!response.ok) {
        throw response
    }
    return response.json();
}

module.exports = {
    CREATE_INCIDET : createNewIncident,
    CREATE_CHANGE_EVENT: createChangeEvent,
    // autocomplete
    getAllServices,
    getUserList
};
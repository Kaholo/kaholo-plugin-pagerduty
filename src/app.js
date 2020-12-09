const fetch = require('node-fetch');
const {getAllServices} = require('./autocomplete');

///////////////////// METHODS ///////////////////// 
async function createNewIncident(action,settings) {
    const method = "POST";
    const url = "https://api.pagerduty.com/incidents";
    const serviceId = action.params.SERVICE_ID.id;
    const title = action.params.TITLE
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
    body = JSON.stringify(body);
    return await genericRestAPI(action,settings, method, url, body);
}

///////////////////// HELPERS ///////////////////// 
async function genericRestAPI(action, settings, method, url, body) {
    /**
     * Send Default API Request
     */
    const request = {
        method: `${method}`,
        headers: {
            'Authorization': `Token token=${settings.TOKEN}`,
            'Accept': 'application/vnd.pagerduty+json;version=2',
            'Content-Type': 'application/json',
            'From': `${action.params.EMAIL}`
        },
        body: body
    };
    response = await fetch(url, request);
    if (!response.ok) {
        throw response
    }
    return response.json();
}

module.exports = {
    CREATE_INCIDET : createNewIncident,
    getAllServices
}
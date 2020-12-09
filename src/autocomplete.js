const fetch = require('node-fetch');
async function getAllServices(query, pluginSettings) {
    const url = "https://api.pagerduty.com/services?limit=25?total=true&time_zone=UTC&sort_by=name";
    const request = {
        method: 'GET',
        headers: {
            'Authorization': `Token token=${pluginSettings[0].value}`,
            'Accept': 'application/vnd.pagerduty+json;version=2',
            'Content-Type': 'application/json',
        }   
    }
    const response = await fetch(url, request);
    if (!response.ok) {
        throw response
    }
    const result = await response.json();
    let options = result.services.map((service) => ({ id: service.id, value: service.name}));
    if (!query) {
        return options;
    }
    return options.filter(option => option.value.includes(query));
}
module.exports = {
    getAllServices
}
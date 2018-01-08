export const request = {
    get(url, queryObj = {}) {
        return fetch(buildUrl(url, queryObj))
            .then(checkStatus)
            .then(res => res.json());
    },
    
    post(url, data) {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(checkStatus)
            .then(res => res.json());
    }
};

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        let error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

function buildUrl(url, queryObj){
    let queryStr = '';
    for(let key in queryObj) {
        let value = queryObj[key];
        queryStr += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
    }
    if (queryStr.length > 0) {
        queryStr = queryStr.substring(0, queryStr.length-1);  // chop off last '&'
        url = url + '?' + queryStr;
    }
    return url;
}

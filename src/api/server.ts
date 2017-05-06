const index_html = '/index.html'; 
export const BASE_URL = 'http://localhost:8081';
// export const BASE_URL = 'https://whispering-brook-33382.herokuapp.com'
export const API_URL = BASE_URL + '/api/';
// export const LOOKUP_URL = BASE_URL + '/api/lookup/'; // + '/api/lookup/?' + getTimestamp();

console.log('BASE_URL: ', BASE_URL);

function getBaseURL() {
    const href = document.location.href.toLowerCase();
    const p = href.indexOf(index_html);
    const url = href.substring(0, p);
    return url;
}

const headers: any = {
    'Accept': 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
    // 'OPTIONS': '' // Does not work with CORS
};

function getTimestamp() {
    return 't=' + new Date().getTime();
}

export function postLogin(path, data) {
    return fetch(BASE_URL + path, {
        method: 'post',
        body: data
    }).then(response => response.json());
}

// export function postLookup(data) {
//     return fetch(LOOKUP_URL, {
//         method: 'post',
//         headers: headers,
//         body: JSON.stringify(data)
//     });
// }

export function post(path, data) {
    var url = API_URL + path + '/'
    const method = 'post'; // (data.id > 0) ? 'put' : 'post';
    return fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(data)
    }).then(response =>
        response.json());
}

export function remove(path, id) {
    var url = API_URL + path + '/' + id
    return fetch(url, {
        method: 'delete',
        headers: headers,
    }).then(response =>
        response.json());
}

export function getList(path, p?) {
    var url = API_URL + path + "/?" + getTimestamp();
    if (p) url += "&page=" + p.page + "&size=" + p.size + "&sortby=" + p.colName + "&direction=" + p.direction;
    return fetch(url, {
        method: 'get',
        headers: headers,
    }).then(response => response.json());
}

export function runQuery(path, name, parameters) {   
    var url = API_URL + path + "/query/?name=" + name;
    var data = parameters ? JSON.stringify(parameters) : null;
    return fetch(url, {
        method: 'post',
        headers: headers,
        body: data,
    }).then(response => response.json());
}

export function getById(path, id) {
    var url = API_URL + path + '/' + id + "/?" + getTimestamp();
    return fetch(url, {
        method: 'get',
        headers: headers,
    }).then(response => response.json());
}

export function getNextNum(path, field) {
    var url = API_URL + path + "/nextnum?" + getTimestamp() + "&field=" + field;
    return fetch(url, {
        method: 'get',
        headers: headers,
    }).then(response =>
        response.json());
}

export const doFetch = (url: string): Promise<any> => {
    return fetch(url)
        .then(response => {
            if (response.status >= 400) {
                throw new Error('Bad response from server');
            }
            return response.json();
        });
};

import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response'
import { authenticationService } from '../services/authentication.service';


export const requestService = {
    getAll,
    getById,
    createRequest
};

function getAll(statusId) {
    let url = statusId ? `api/requests/getall?statusId=${statusId}` : `api/requests/getall`;
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(url, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`api/requests/${id}`, requestOptions).then(handleResponse);
}

function createRequest(subject, description, category) {
    const currentUser = authenticationService.currentUserValue;

    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subject, description, categoryId: category })
    };
    return fetch(`api/requests`, requestOptions).then(handleResponse).catch(err => { return { error: err }});
}
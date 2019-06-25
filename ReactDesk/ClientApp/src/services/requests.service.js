import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response'
import { authenticationService } from '../services/authentication.service';


export const requestService = {
    getAll,
    getById,
    createRequest,
    mergeRequests,
    deleteRequests
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

function createRequest(subject, description, category, attachments) {
    const currentUser = authenticationService.currentUserValue;

    let formData = new FormData()
    formData.append('subject', subject)
    formData.append('description', description)
    formData.append('categoryId', category)

    if (attachments) {
        for (const file of attachments) {
            formData.append('attachments', file, file.name)
        }
    }

    const reqOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${currentUser.token}`,
        },
        body: formData
    };

    return fetch(`api/requests`, reqOptions).then(handleResponse).catch(err => { return { error: err } });
}

//const requestOptions = {
//    method: 'POST',
//    headers: {
//        Authorization: `Bearer ${currentUser.token}`,
//        'Content-Type': 'application/json'
//    },
//    body: JSON.stringify({ subject, description, categoryId: category, attachments })
//};
//return fetch(`api/requests`, requestOptions).then(handleResponse).catch(err => { return { error: err }});


function mergeRequests(ids) {
    const currentUser = authenticationService.currentUserValue;

    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ids)
    };
    return fetch(`api/requests/merge`, requestOptions).then(handleResponse).catch(err => { return { error: err } });
}

function deleteRequests(ids) {
    const currentUser = authenticationService.currentUserValue;

    const requestOptions = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ids)
    };
    return fetch(`api/requests/`, requestOptions).then(handleResponse).catch(err => { return { error: err } });
}
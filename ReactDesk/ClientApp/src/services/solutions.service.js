import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response'
import { authenticationService } from '../services/authentication.service';


export const solutionService = {
    getAll,
    getById,
    createSolution
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`api/solutions/getall`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`api/solutions/${id}`, requestOptions).then(handleResponse);
}

function createSolution(title, content, attachments) {
    const currentUser = authenticationService.currentUserValue;

    let formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)

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
    //const requestOptions = {
    //    method: 'POST',
    //    headers: {
    //        Authorization: `Bearer ${currentUser.token}`,
    //        'Content-Type': 'application/json'
    //    },
    //    body: JSON.stringify({ title, content})
    //};
    return fetch(`api/solutions`, reqOptions).then(handleResponse).catch(err => { return { error: err } });
}
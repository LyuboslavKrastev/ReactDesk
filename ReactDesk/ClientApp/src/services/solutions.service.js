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

function createSolution(title, content) {
    const currentUser = authenticationService.currentUserValue;

    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content})
    };
    return fetch(`api/solutions`, requestOptions).then(handleResponse).catch(err => { return { error: err } });
}
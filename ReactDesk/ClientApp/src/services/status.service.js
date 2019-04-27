import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response'


export const statusService = {
    getAll,
    getById,
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`api/statuses/getall`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`api/statuses/${id}`, requestOptions).then(handleResponse);
}
import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response'

export const userService = {
    getAll,
    getById
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`api/users/getall`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`api/users/${id}`, requestOptions).then(handleResponse);
}
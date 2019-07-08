import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response'

export const userService = {
    getAll,
    getById,
    getAllTechnicians
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`api/users/getall`, requestOptions).then(handleResponse);
}

function getAllTechnicians() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`api/users/getalltechnicians`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`api/users/${id}`, requestOptions).then(handleResponse);
}
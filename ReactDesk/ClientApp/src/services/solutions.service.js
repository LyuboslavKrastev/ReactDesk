import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response'


export const solutionService = {
    getAll,
    getById,
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`api/solutions/getall`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`api/solutions/${id}`, requestOptions).then(handleResponse);
}
import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response'


export const categoriesService = {
    getAll,
    getById,
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`api/categories/getall`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`api/categories/${id}`, requestOptions).then(handleResponse);
}
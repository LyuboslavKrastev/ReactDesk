import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response'
import { authenticationService } from '../services/authentication.service';

export const userService = {
    getAll,
    getById,
    getAllTechnicians,
    setRole,
    ban,
    unban,
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

function setRole(userId, roleName) {
    const currentUser = authenticationService.currentUserValue;
    const requestOptions = {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, roleName })
    };

    return fetch(`api/roles`, requestOptions).then(handleResponse).catch(err => { return { error: err } });
}

function ban(userId) {
    const currentUser = authenticationService.currentUserValue;
    const requestOptions = {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userId)
    };

    return fetch(`api/users/ban`, requestOptions).then(handleResponse).catch(err => { return { error: err } });
}

function unban(userId) {
    const currentUser = authenticationService.currentUserValue;
    const requestOptions = {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userId)
    };

    return fetch(`api/users/unban`, requestOptions).then(handleResponse).catch(err => { return { error: err } });
}
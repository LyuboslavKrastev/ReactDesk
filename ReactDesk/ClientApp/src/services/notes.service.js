import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response'
import { authenticationService } from '../services/authentication.service';


export const notesService = {
    getAll,
    createNote
};

function getAll(requestId) {
    let url = `api/notes/getall?requestId=${requestId}` 
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(url, requestOptions).then(handleResponse);
}


function createNote(ids, description) {
    const currentUser = authenticationService.currentUserValue;

    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({ ids, description })
    };

    return fetch(`api/notes`, requestOptions).then(handleResponse).catch(err => { return { error: err }});
}
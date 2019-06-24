import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response'
import { authenticationService } from '../services/authentication.service';


export const notesService = {
    createNote
};



function createNote(ids, description) {
    const currentUser = authenticationService.currentUserValue;
    debugger;

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
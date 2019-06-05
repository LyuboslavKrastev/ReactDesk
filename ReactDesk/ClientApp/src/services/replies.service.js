import { handleResponse } from '../helpers/handle-response'
import { authenticationService } from '../services/authentication.service';


export const repliesService = {
    createReply
};


function createReply(requestId, description) {
    debugger;
    const currentUser = authenticationService.currentUserValue;

    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({ requestId, description })
    };

    return fetch(`api/replies`, requestOptions).then(handleResponse).catch(err => { return { error: err }});
}
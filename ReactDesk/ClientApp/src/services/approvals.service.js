import { handleResponse } from '../helpers/handle-response'
import { authenticationService } from '../services/authentication.service';

export const approvalsService = {
    createApproval
};

function createApproval(requestId, approverId, subject, description) {
    const currentUser = authenticationService.currentUserValue;

    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({ requestId, approverId, subject, description })
    };

    return fetch(`api/approvals`, requestOptions).then(handleResponse).catch(err => { return { error: err }});
}
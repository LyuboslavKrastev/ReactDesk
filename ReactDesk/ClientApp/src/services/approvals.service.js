import { handleResponse } from '../helpers/handle-response'
import { authenticationService } from '../services/authentication.service';
import { authHeader } from '../helpers/auth-header';

export const approvalsService = {
    getApprovalsCount,
    createApproval,
    update
};

function getApprovalsCount(isApprover, status) {
    debugger;
    const requestOptions = { method: 'GET', headers: authHeader() };
    let endPoint = `api/approvals/getCount?isApprover=${isApprover}`;
    if (status && status.length > 0) {
        endPoint += `&status=${status}`
    }
    return fetch(endPoint, requestOptions).then(handleResponse).catch(err => { return { error: err } });
}

function createApproval(requestId, approverId, subject, description) {
    debugger;
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

function update(id, isApproved) {
    debugger;
    const currentUser = authenticationService.currentUserValue;

    const requestOptions = {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({ id, isApproved })
    };

    return fetch(`api/approvals`, requestOptions).then(handleResponse).catch(err => { return { error: err } });
}
import { handleResponse } from '../helpers/handle-response'
import { authenticationService } from '../services/authentication.service';
import { authHeader } from '../helpers/auth-header';

export const reportsService = {
    getMyRequests
};

function getMyRequests() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`api/reports/getmyrequests`, requestOptions).then(handleResponse);
}
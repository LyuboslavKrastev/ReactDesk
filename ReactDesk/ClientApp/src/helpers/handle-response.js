import { authenticationService } from '../services/authentication.service';

export function handleResponse(response) {
    if (response.status >= 500) {
        return Promise.reject('error');;
    }
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if ([401, 403].indexOf(response.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                authenticationService.logout();

                setTimeout(() => window.location.href = "/", 6000)
            }
            const error = (data && data.message) || response.statusText;

            return Promise.reject(error);
        }

        return data;
    });
}
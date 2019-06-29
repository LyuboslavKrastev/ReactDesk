import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response'
import { authenticationService } from '../services/authentication.service';


export const requestService = {
    getAll,
    getById,
    createRequest,
    mergeRequests,
    deleteRequests,
    getFile
};

function getAll(statusId) {
    let url = statusId ? `api/requests/getall?statusId=${statusId}` : `api/requests/getall`;
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(url, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`api/requests/${id}`, requestOptions).then(handleResponse);
}

function getFile(fileName, filePath, attachmentId) {
   //Solution used for file downloading: https://medium.com/yellowcode/download-api-files-with-react-fetch-393e4dae0d9e
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`api/requests/download?fileName=${fileName}&filePath=${filePath}&attachmentId=${attachmentId}`, requestOptions)
            // 1. Convert the data into 'blob'
        .then((response) => response.blob())
        .then((blob) => {      
            // 2. Create blob link to download
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${fileName}`);
            // 3. Append to html page
            document.body.appendChild(link);
            // 4. Force download
            link.click();
            // 5. Clean up and remove the link
            link.parentNode.removeChild(link);
        })
        .catch((error) => {
            console.log(error)
        }); 
}

function createRequest(subject, description, category, attachments) {
    const currentUser = authenticationService.currentUserValue;

    let formData = new FormData()
    formData.append('subject', subject)
    formData.append('description', description)
    formData.append('categoryId', category)

    if (attachments) {
        for (const file of attachments) {
            formData.append('attachments', file, file.name)
        }
    }

    const reqOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${currentUser.token}`,
        },
        body: formData
    };

    return fetch(`api/requests`, reqOptions).then(handleResponse).catch(err => { return { error: err } });
}

//const requestOptions = {
//    method: 'POST',
//    headers: {
//        Authorization: `Bearer ${currentUser.token}`,
//        'Content-Type': 'application/json'
//    },
//    body: JSON.stringify({ subject, description, categoryId: category, attachments })
//};
//return fetch(`api/requests`, requestOptions).then(handleResponse).catch(err => { return { error: err }});


function mergeRequests(ids) {
    const currentUser = authenticationService.currentUserValue;

    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ids)
    };
    return fetch(`api/requests/merge`, requestOptions).then(handleResponse).catch(err => { return { error: err } });
}

function deleteRequests(ids) {
    const currentUser = authenticationService.currentUserValue;

    const requestOptions = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ids)
    };
    return fetch(`api/requests/`, requestOptions).then(handleResponse).catch(err => { return { error: err } });
}
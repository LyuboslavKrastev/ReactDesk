import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response'
import { authenticationService } from '../services/authentication.service';

export const solutionService = {
    getAll,
    getById,
    createSolution,
    getFile
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`api/solutions/getall`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`api/solutions/${id}`, requestOptions).then(handleResponse);
}

function createSolution(title, content, attachments) {
    const currentUser = authenticationService.currentUserValue;

    let formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)

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

    return fetch(`api/solutions`, reqOptions).then(handleResponse).catch(err => { return { error: err } });
}

//NOTE: Broke the DRY principle - this function is basically the same as getFile in solutions.service. I may come back to fix this at a later time.
function getFile(fileName, filePath, attachmentId) {
    //Solution used for file downloading: https://medium.com/yellowcode/download-api-files-with-react-fetch-393e4dae0d9e
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`api/solutions/download?fileName=${fileName}&filePath=${filePath}&attachmentId=${attachmentId}`, requestOptions)
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

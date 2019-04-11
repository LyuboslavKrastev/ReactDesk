// Creates request object to kinvey
function makeRequest(method, url, data) {
    let dataJSON = JSON.stringify(data)

    return fetch(url, {
        method : method,
        headers: {
            "Content-type": "application/json"
        },
        body: dataJSON
    }).then(rawData => {    
        if(rawData.status === 204){
          return rawData
        }
        return rawData.json()
    })
    .then(res =>  {
      if(!res.error){
         
      } else {
         
      }
      return res
    })
}

// Function to return GET promise
function get(url) {
  return makeRequest("GET", url);
}



// Function to return POST promise
function post(url, data) {
    return makeRequest("POST", url, data)
}

// Function to return PUT promise
function update(url, data) {
    return makeRequest("PUT", url, data);
}

// Function to return DELETE promise
function remove(url) {
  return makeRequest("DELETE", url);
}

export default {
  get,
  post,
  update,
  remove
};

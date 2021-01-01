const axios = require('axios');

const createRequest = (input, callback) => {
  const url = process.env.URL || 'http://87.231.93.31:3000';
  //const token = 'a8hRLi3ZgquLGmyw9inZkz5TKtVd8MS9';
  const timeout = process.env.TIMEOUT || 3000;

  const jobRunID = input.id;
  const token = input.data.token;
  
  try {
    axios({ method: 'get', url: url, timeout: timeout, headers: { 'api-token': token } })
      .then(
        response => {
          if (response.status === 200) {
            let data = { jobRunID: jobRunID, data: { id: response.data.id, result: { id: response.data.id } }, statusCode: response.status };
            console.log(jobRunID, response.data.id);
            callback(response.status, data);
          } else {
            callback(response.status, { jobRunID, status: "errored", error: response.data, data: {} });
          }
        }
      )
      .catch(error => {
        if (error.code === 'ECONNABORTED') {
          callback(500, { jobRunID, status: "errored", error: 'timeout', data: {} });
        } else {
          callback(500, { jobRunID, status: "errored", error: error, data: {} });
        }
      });
  } catch (error) {
    callback(500, { jobRunID, status: "errored", error: error, data: {} });
  }
}

module.exports.createRequest = createRequest

/*
const createRequest_OLD = (input, callback) => {
  const jobRunID = input.id;
  request()
    .then(
      response => {
        let data = { jobRunID: jobRunID, data: { id: response.data.id, result: { id: response.data.id } }, statusCode: response.status };
        console.log(input);
        console.log(data);
        console.log('*****************************************************************************');
        callback(response.status, data);
      }
    )
    .catch(error => {
      callback(500, { jobRunID, status: "errored", error: error, data: {} });
    });
}
*/


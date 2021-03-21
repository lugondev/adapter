const axios = require('axios');

const createRequest = (input, callback) => {
    const url = process.env.URL || 'https://stock.pixelstox.io/hose';
    const timeout = process.env.TIMEOUT || 5000;
    console.log({url})
    const jobRunID = input.id;
    try {
        axios.get(url, {timeout: Number(timeout)})
            .then(
                response => {
                    if (response.status === 200) {
                        let data = {jobRunID: jobRunID, data: response.data};
                        console.log(jobRunID, response.data.id);
                        callback(response.status, data);
                    } else {
                        callback(response.status, {jobRunID, status: "errored", error: response.data, data: {}});
                    }
                }
            )
            .catch(error => {
                if (error.code === 'ECONNABORTED') {
                    callback(500, {jobRunID, status: "errored", error: 'timeout', data: {}});
                } else {
                    callback(500, {jobRunID, status: "errored", error: error, data: {}});
                }
            });
    } catch (error) {
        callback(500, {jobRunID, status: "errored", error: error, data: {}});
    }
}

module.exports.createRequest = createRequest

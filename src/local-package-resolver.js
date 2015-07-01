var fs = require('fs');

module.exports = (endpoint) =>
  new Promise((resolve, reject) => {
    fs.readFile(endpoint, (err, content) => {
      if (err) {
        return reject(err);
      }
      resolve(JSON.parse(content));
    });
  });

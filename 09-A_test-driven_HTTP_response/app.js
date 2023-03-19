const http = require('node:http')

const createApp = http.createServer((req, res) => {
    console.log('request received');

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");

    res.end("<html><body><h1>Welcome to the World Wide Web!</h1></body></html>");
});

// createApp.listen(3000, () => {
//     console.log("Server running at http://localhost:3000/")
// })

module.exports = createApp;

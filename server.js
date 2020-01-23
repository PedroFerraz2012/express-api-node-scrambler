//imports http package
const http = require('http');
// import app file
const app = require('./app');
// signing a port
const port = process.env.PORT || 3000;
// passing app to Express to handle
const server = http.createServer(app);

server.listen(port);
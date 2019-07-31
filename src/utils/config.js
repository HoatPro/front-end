// const dotenv = require('dotenv');
// dotenv.config();
const node_env = process.env.NODE_ENV;
let config = {};
// const hostname = window.location.hostname;
// const protocol = window.location.protocol;

config.apiKey = process.env.REACT_APP_API_KEY;

config.production = {
	// originBackend: 'http://localhost:4000',
    originBackend: 'https://ast.fpt.net/netd-api/',
    originFrontend: 'https://ast.fpt.net/netdasboard/',
    previewUrl: '/netdasboard',
    originRoot: 'https://ast.fpt.net',
};

config.development = {
    originBackend: 'http://localhost:3001',
    originFrontend: 'http://localhost:3000',
    previewUrl: '',
    originRoot: 'https://localhost:4000',
	//originBackend: `http://172.27.131.173:4000`
};

config.environment = 'localhost';

if (~['development'].indexOf(node_env)) {
	config.environment = 'development';
}
if (~['production'].indexOf(node_env)) {
	config.environment = 'production';
}
// console.log(config);
module.exports = config;

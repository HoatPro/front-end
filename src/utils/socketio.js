import  io from 'socket.io-client';
import config from  '../utils/config';
const env = config.environment;
const originBackend = config[env].originBackend;

export default function () {
    return io(originBackend);
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePort = (val) => {
  return () => {
    typeof val === "string" ? parseInt(val) : val;
  };
};

exports.onError = (server) => {
  return (error) => {
    let port = server.address().port;
    if (error.syscall !== "listen") throw error;
    let bind = typeof port === "string" ? `pipe ${port}` : `port ${port}`;
    switch (error.code) {
      case "EACCES":
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  };
};
exports.onListening = (server) => {
  return () => {
    let addr = server.address();
    let bind =
      typeof addr === "string"
        ? `pipe ${addr}`
        : `http://${addr.address}:${addr.port}`;
    console.log(`Listening at ${bind}...`);
  };
};

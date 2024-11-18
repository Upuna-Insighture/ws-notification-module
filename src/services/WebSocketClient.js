import { io } from 'socket.io-client';

class WebSocketClient {
  constructor(url, token) {
    this.socket = io(url, { auth: { token } });
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  on(event, callback) {
    this.socket.on(event, callback);
  }

  off(event, callback) {
    this.socket.off(event, callback);
  }
}

export default WebSocketClient;
// websocketClient.ts

type WebSocketMessage<T = any> = {
  role: string;         // target role for this message
  type: string;         // message type (e.g., "notification", "update")
  payload: T;           // actual message data
};

type Subscriber<T = any> = (msg: WebSocketMessage<T>) => void;

class RoleBasedWebSocketClient {
  private ws: WebSocket | null = null;
  private subscribers: Subscriber[] = [];
  private userRole: string;

  constructor(userRole: string, private url: string) {
    this.userRole = userRole;
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      // Optional: send initial handshake with role
      this.send({ type: 'handshake', role: this.userRole, payload: {} });
    };

    this.ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        // Only notify subscribers if message matches the user's role
        if (data.role === this.userRole || data.role === 'all') {
          this.subscribers.forEach((fn) => fn(data));
        }
      } catch (error) {
        console.error('WebSocket message parse error:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected, reconnecting in 3s...');
      setTimeout(() => this.connect(), 3000);
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      this.ws?.close();
    };
  }

  send(message: WebSocketMessage<any>) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  }

  subscribe(fn: Subscriber) {
    this.subscribers.push(fn);
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== fn);
    };
  }
}

export default RoleBasedWebSocketClient;
export type { WebSocketMessage };

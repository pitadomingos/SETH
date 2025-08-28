
type MessageHandler = (data: any) => void;
type OpenHandler = () => void;
type CloseHandler = (event: CloseEvent) => void;
type ErrorHandler = (event: Event) => void;

export class WebSocketClient {
  private socket!: WebSocket;
  private url: string;
  private reconnectInterval: number;
  private shouldReconnect: boolean;
  private messageQueue: string[] = [];
  private maxQueueSize: number;

  public onMessage: MessageHandler = () => {};
  public onOpen: OpenHandler = () => {};
  public onClose: CloseHandler = () => {};
  public onError: ErrorHandler = () => {};

  constructor(url: string, reconnectInterval = 5000, maxQueueSize = 100) {
    this.url = url;
    this.reconnectInterval = reconnectInterval;
    this.shouldReconnect = true;
    this.maxQueueSize = maxQueueSize;

    this.connect();
  }

  private connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log(`Connected to ${this.url}`);
      this.onOpen();
      this.flushQueue(); // send all queued messages
    };

    this.socket.onmessage = (event: MessageEvent) => {
      this.onMessage(event.data);
    };

    this.socket.onclose = (event: CloseEvent) => {
      console.log('Connection closed');
      this.onClose(event);
      if (this.shouldReconnect) {
        console.log(`Reconnecting in ${this.reconnectInterval / 1000}s...`);
        setTimeout(() => this.connect(), this.reconnectInterval);
      }
    };

    this.socket.onerror = (event: Event) => {
      console.error('WebSocket error:', event);
      this.onError(event);
    };
  }

  sendMessage(message: string) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      if (this.messageQueue.length >= this.maxQueueSize) {
        console.warn('Message queue full, dropping oldest message');
        this.messageQueue.shift(); // remove oldest
      }
      console.warn('WebSocket not open. Queuing message.');
      this.messageQueue.push(message);
    }
  }

  private flushQueue() {
    while (this.messageQueue.length > 0 && this.socket.readyState === WebSocket.OPEN) {
      const msg = this.messageQueue.shift()!;
      this.socket.send(msg);
    }
  }

  close() {
    this.shouldReconnect = false;
    this.socket.close();
  }
}

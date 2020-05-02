import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from './message';

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {
  constructor() {}

  public connect(url: string): ChatConnection {
    const ws = new WebSocket(url);
    const obs = new Subject<Message>();
    ws.onmessage = (event) => {
        obs.next(JSON.parse(event.data));
    };
    ws.onerror = (err) => {
        obs.error(err);
    };
    ws.onclose = (ev) => {
        obs.error(ev);
        obs.complete();
    };
    return {
        receive: obs,
        send: (data: Message) => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify(data));
            } else {
                console.log('cant send', ws);
            }
          },
        ws
    };
  }
}

export interface ChatConnection {
    receive: Subject<Message>;
    send: (data: Message) => void;
    ws: WebSocket;
}

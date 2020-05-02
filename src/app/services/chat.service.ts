import { Injectable } from '@angular/core';
import { WebsocketService, ChatConnection } from './websocket.service';
import { Message, ChatMessage } from './message';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ConfigService } from './config.service';
@Injectable({
    providedIn: 'root'
})
export class ChatService {
    public name: string;
    public registered = false;
    public sysMsg: string;
    public connection: ChatConnection;
    public messages: ChatMessage[] = [];
    constructor(
        private socket: WebsocketService,
        private router: Router,
        private config: ConfigService
        ) {
    }
    public async checkName(name: string) {
        return new Promise<boolean>((resolve, reject) => {
            this.connection.receive.pipe(first()).subscribe((data: Message) => {
                if (data.type === 'validation') {
                    resolve(data.success);
                }
            });
            this.connection.send({
                type: 'validation',
                message: name
            });
        });
    }

    public async enter(name: string) {
        return new Promise<boolean>((resolve, reject) => {
            this.connection.receive.pipe(first()).subscribe((data: Message) => {
                if (data.type === 'register') {
                    if (data.success) {
                        this.name = name;
                        this.registered = true;
                        this.messages = data.message as ChatMessage[];
                        resolve(true);
                    } else {
                        reject();
                    }
                }
            });
            this.connection.send({
                type: 'register',
                message: name
            });
        });
    }

    public connect(): void {
        this.name = '';
        this.registered = false;
        this.sysMsg = '';
        this.connection = this.socket.connect(this.config.serverUrl);
        this.connection.receive.subscribe((data: Message) => {
            if (data.type === 'message') {
                this.messages.push(data.message as ChatMessage);
            }
        }, (err) => {
            this.goHome();
            if (err.code === 1001) {
                this.sysMsg = 'Disconnected due inactivity!';
            } else {
                this.sysMsg = 'Unable to handle connection';
            }
        });
        this.connection.ws.onopen = () => {
            this.goHome();
        };
    }

    private goHome() {
        this.name = '';
        this.registered = false;
        if (this.router.url !== '/') {
            this.router.navigate(['/']);
        }
    }
}


import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { Router } from '@angular/router';
@Component({
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.styles.scss'],
})
export class ChatComponent implements OnInit {

    public messageForm: FormGroup;

    public get message() { return this.messageForm.get('message'); }

    constructor(
        public service: ChatService,
        private router: Router,
    ) {}

    public ngOnInit(): void {
        if (!this.service.registered) {
            this.router.navigate(['/']);
            return;
        }
        this.messageForm = new FormGroup({
            message: new FormControl('')
        });
    }

    public onSubmit() {
        if (this.message.value.trim().length) {
            this.service.connection.send({
                type: 'message',
                message: this.message.value.trim()
            });
            this.message.setValue('');
        }
    }
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { ChatService } from '../services/chat.service';
import { WebsocketService } from '../services/websocket.service';
import { Router } from '@angular/router';
import { from } from 'rxjs/internal/observable/from';
import { map, first } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public isProcessing = false;
  public loginForm: FormGroup;
  public get name() { return this.loginForm.get('name'); }

  constructor(
    private service: ChatService,
    private router: Router,
  ) { }

  ngOnInit() {
    if (this.service.registered) {
      this.router.navigate(['/room']);
      return;
    }
    this.loginForm = new FormGroup({
      name: new FormControl('', [Validators.required], this.validateName.bind(this))
    });
  }

  public onSubmit() {
    this.isProcessing = true;
    this.loginForm.updateValueAndValidity();
    if (this.loginForm.invalid) {
      this.isProcessing = false;
      return;
    }
    this.service.enter(this.name.value).then((success) => {
      if (success) {
        this.router.navigate(['/room']);
        return;
      }
      this.isProcessing = false;
    }).catch(() => {
      this.isProcessing = false;
    });
  }

  private async validateName(control: AbstractControl) {
    const isValid = await this.service.checkName(control.value);
    return isValid ? null : { taken: true };
  }

}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  serverUrl: string;
  reconnectInterval: number;
  constructor() { }
}

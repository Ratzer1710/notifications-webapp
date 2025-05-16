import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notification } from '../model/notification';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  url: string = "http://localhost:8081/notifications";

  constructor(private http: HttpClient) { }

  sendNotification(notification: Notification): Observable<unknown> {
    return this.http.post(this.url, notification)
  }
}

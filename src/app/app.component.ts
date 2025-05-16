import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationFormComponent } from "./components/notification-form/notification-form.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NotificationFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'notifications-webapp';
}

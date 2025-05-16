import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NotificationsService } from '../../services/notifications.service';
import { Notification } from '../../model/notification';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonModule} from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NgxMatTimepickerModule } from '@alexfriesen/ngx-mat-timepicker';

@Component({
  selector: 'app-notification-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    NgxMatTimepickerModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './notification-form.component.html',
  styleUrl: './notification-form.component.scss',
})
export class NotificationFormComponent {
  channelOptions = ['MAIL', 'PC', 'MOBILE'];
  selectedChannels: string[] = [];
  hasSelectedChannels: boolean = false;
  readonly dialog = inject(MatDialog);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    body: ['', [Validators.required, Validators.maxLength(250)]],
    channels: this.fb.array([], this.minSelectedCheckboxes(1)),
    date: [new Date().toISOString(), Validators.required],
    time: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private notificationsService: NotificationsService
  ) {}

  onCheckboxChange(event: MatCheckboxChange) {
    const channels = this.form.controls.channels as FormArray;

    if (event.checked) {
      channels.push(this.fb.control(event.source.value));
    } else {
      const index = channels.controls.findIndex(
        (ctrl) => ctrl.value === event.source.value
      );
      if (index !== -1) {
        channels.removeAt(index);
      }
    }

    this.hasSelectedChannels = channels.length > 0;
  }

  convertTo24Hour(time12h: string): string {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  minSelectedCheckboxes(min = 1): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      return formArray.length >= min ? null : { required: true };
    };
  }

  getChannelIcon(channel: string): string {
    switch (channel) {
      case 'MAIL':
        return 'mail';
      case 'PC':
        return 'computer';
      case 'MOBILE':
        return 'smartphone';
      default:
        return 'help_outline';
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    if (
      !this.form.value.title ||
      !this.form.value.body ||
      !this.form.value.channels ||
      !this.form.value.date ||
      !this.form.value.time
    )
      return;

    let { date, time } = this.form.value;
    time = this.convertTo24Hour(time);
    const [hours, minutes] = time.split(':');
    const datetime = new Date(date);
    datetime.setHours(+hours);
    datetime.setMinutes(+minutes);

    const notification: Notification = {
      title: this.form.value.title,
      body: this.form.value.body,
      channels: this.form.value.channels,
      datetime: datetime.toISOString(),
    };

    this.notificationsService.sendNotification(notification)
      .subscribe({
        next: () => {
          this.dialog.open(DialogElementsExampleDialog);
          this.form = this.fb.group({
            title: ['', [Validators.required, Validators.maxLength(100)]],
            body: ['', [Validators.required, Validators.maxLength(250)]],
            channels: this.fb.array([], this.minSelectedCheckboxes(1)),
            date: [new Date().toISOString(), Validators.required],
            time: ['', Validators.required]
          });
        },
        error: err => alert('Error: ' + JSON.stringify(err))
      });
  }
}

@Component({
  selector: 'dialog-elements-example-dialog',
  templateUrl: 'dialog-elements-example-dialog.html',
  standalone: true,
  imports: [MatDialogTitle, MatDialogActions, MatDialogClose, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogElementsExampleDialog {}
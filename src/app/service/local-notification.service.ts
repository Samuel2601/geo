import { Injectable } from '@angular/core';
import { ActionPerformed, LocalNotificationSchema, LocalNotifications } from '@capacitor/local-notifications';
import { ApiService } from './api.service';
import { MessagesService } from './messages.service';
import { Router } from '@angular/router';
import { SecurityService } from './security.service';

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationService {
  private static code: number = 0;

  constructor(private router: Router,
    private apiService: ApiService,
    private messagesService: MessagesService) { }

  async scheduleNotification(notification: any) {
    await LocalNotifications.schedule(
      {
        notifications: [
          {
            id: ++LocalNotificationService.code,
            title: notification.title,
            body: notification.body,
            schedule: { at: new Date(Date.now() + 1000) },
            extra: notification.data,
          }
        ]
      }
    )
  }

  async addListeners() {
    await LocalNotifications.addListener(
      'localNotificationReceived',
      (notification: LocalNotificationSchema) => {
        this.handleNotificationReceived(notification);
      }
    )

    await LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (action: ActionPerformed) => {
        this.handleNotificationActionPerformed(action.notification.extra);
      }
    )
  }

  handleNotificationReceived(notification: LocalNotificationSchema) {
    const data = notification.extra;
    if (data) {
      if (data.token) {
        LocalNotifications.getDeliveredNotifications().then(
          (n) => {
            n.notifications.forEach(
              async (e) => {
                if (notification.title === e.title) {
                  await LocalNotifications.removeDeliveredNotifications({ notifications: [e] });
                  this.messagesService.dismissLoading();
                  this.apiService.loadStoredToken(SecurityService.decryptAes(data.token, false));
                  if (data.path) {
                    this.router.navigateByUrl(data.path);
                    this.apiService.backgroundActionRunning = false;
                  } else {
                    this.router.navigate(["/tabs"]);
                  }
                  return;
                }
              }
            )
          }
        );
      }
    }
  }

  handleNotificationActionPerformed(data: any) {
    if (data) {
      if (data.path) {
        this.router.navigateByUrl(data.path);
        return;
      }
    }
  }
}

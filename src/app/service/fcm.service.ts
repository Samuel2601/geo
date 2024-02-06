import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Token, PushNotifications, ActionPerformed, PushNotificationSchema } from '@capacitor/push-notifications';
import { MessagesService } from './messages.service';
import { ApiService } from './api.service';
import { LocalNotificationService } from './local-notification.service';
import { SecurityService } from './security.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  private static intentos: number = 1;

  constructor(private router: Router,
    private apiService: ApiService,
    private messagesService: MessagesService,
    private localService: LocalNotificationService,
    private storageService: StorageService) { }

  initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush();
    }
  }

  private registerPush() {
    const message = "Se deben permitir las notificaciones para usar el aplicativo. En caso de negar el permiso 2 veces, luego deberá realizarlo manualmente";
    const title = "Permitir notificaciones";
    const buttons = [
      {
        text: 'Salir',
        cssClass: 'text-color-danger',
        handler: async () => {
          this.logoutAsync();
        }
      },
      {
        text: 'Permitir',
        handler: async () => {
          this.registerPush();
        }
      }
    ];
    const errorButtons = [
      {
        text: 'Salir',
        handler: async () => {
          this.logoutAsync();
        }
      }
    ]
    PushNotifications.checkPermissions().then(
      async status => {
        if (status.receive !== 'granted') {
          PushNotifications.requestPermissions().then(
            async (permission) => {
              if (permission.receive === 'granted') {
                await PushNotifications.register();
                this.addListeners();
              } else {
                if (FcmService.intentos < 2) {
                  this.messagesService.presentAlert(message, title, buttons)
                  FcmService.intentos++
                }
                else {
                  this.messagesService.presentAlert("Permiso negado 2 veces, debe concederlo en la configuración de su dispositivo", "Permiso de notificaciones", errorButtons)
                }
              }
            }
          ).catch(
            () => {
              this.messagesService.presentAlert("Ocurrió un error al conceder el permiso", "Permiso de notificaciones", errorButtons)
            }
          );
        } else {
          await PushNotifications.register();
          this.addListeners();
        }
      })
  }

  async addListeners() {
    await PushNotifications.addListener(
      'registration',
      (token: Token) => {
        this.apiService.SecurePostNotificationToken(
          {
            token: token.value
          }
        ).subscribe(
          {
            next: (res: any) => {
              const { message } = res;
              console.log(message);
            },
            error: (error) => {
              console.log(error.message);
            }
          }
        );
      }
    );

    await PushNotifications.addListener(
      'registrationError',
      () => {
        this.messagesService.presentToast("Error al configurar las notificaciones", "danger");
      }
    );

    await PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        if (Capacitor.getPlatform() === 'android') {
          PushNotifications.getDeliveredNotifications().then(
            (n) => {
              n.notifications.forEach(
                async (e) => {
                  if (notification.title === e.title) {
                    await PushNotifications.removeDeliveredNotifications({ notifications: [e] });
                    await this.localService.scheduleNotification(notification);
                    return;
                  }
                }
              )
            }
          );
        } else {
          this.handleNotificationReceived(notification);
        }
      }
    );

    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (action: ActionPerformed) => {
        this.handleNotificationActionPerformed(action.notification.data);
      }
    );

    await this.localService.addListeners();
  }

  handleNotificationReceived(notification: PushNotificationSchema) {
    const data = notification.data;
    if (data) {
      if (data.token) {
        PushNotifications.getDeliveredNotifications().then(
          (n) => {
            n.notifications.forEach(
              async (e) => {
                if (notification.title === e.title) {
                  await PushNotifications.removeDeliveredNotifications({ notifications: [e] });
                  this.messagesService.dismissLoading();
                  this.apiService.loadStoredToken(SecurityService.decryptAes(data.token, false));
                  if (data.path) {
                    this.router.navigateByUrl(data.path);
                  } else {
                    this.router.navigate(["/tabs"]);
                  }
                  return;
                }
              }
            )
          });
      }
    }
  }

  async handleNotificationActionPerformed(data: any) {
    if (data) {
      if (data.path) {
        if (this.apiService.getUser() == null) {
          this.apiService.backgroundActionRunning = true;
          await this.messagesService.presentLoading();
          const encToken = await this.storageService.get(StorageService.TOKEN);
          this.apiService.SecurePostResumeSession({
            encToken,
            path: data.path
          }).subscribe(
            {
              next: (res) => {
                console.log(res.message);
              },
              error: (err) => {
                this.messagesService.dismissLoading();
                this.apiService.errorSubscription(err);
              }
            }
          );
        } else {
          this.router.navigateByUrl(data.path);
          return;
        }
      }
    }
  }

  private async logoutAsync() {
    await this.messagesService.presentLoading();
    this.apiService.SecurePostLogout().subscribe({
      next: async (res) => {
        this.apiService.cleanUserData();
        await this.storageService.remove(StorageService.TOKEN);
        await this.messagesService.dismissLoading();
        SecurityService.refreshAES();
        this.apiService.cleanAuthHeader();
        this.router.navigateByUrl('/');
        this.messagesService.presentToast(res.message);
      },
      error: async (err) => {
        await this.messagesService.dismissLoading();
        this.apiService.errorSubscription(err);
      }
    });
  }

  async unregister() {
    if (Capacitor.getPlatform() !== 'web') {
      await PushNotifications.unregister()
      await PushNotifications.removeAllListeners()
    }
  }
}

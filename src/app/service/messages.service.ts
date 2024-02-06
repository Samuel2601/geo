import { Injectable } from '@angular/core';
import { AlertController, AlertInput, LoadingController, ToastController } from '@ionic/angular';
import { enterAlertAnimation, enterLoading, leaveAlertAnimation, leaveLoading } from '../component/animations/animations';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private loading: HTMLIonLoadingElement|any;

  constructor(private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController) { }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      translucent: true,
      spinner: 'crescent',
      enterAnimation: enterLoading,
      leaveAnimation: leaveLoading
    });
    await this.loading.present();
  }

  async dismissLoading() {
    await this.loading.dismiss();
  }

  async presentAlert(message: string, header: string, buttons: any[], inputs: AlertInput[]): Promise<any>;
  async presentAlert(message: string, header: string, buttons: any[]): Promise<any>;
  async presentAlert(message: string, header: string): Promise<any>;
  async presentAlert(message: string): Promise<any>;
  async presentAlert(message: string, header?: string, buttons?: any[], inputs?: AlertInput[]): Promise<any> {
    const alert = await this.alertController.create({
      message: message,
      header: header,
      buttons: buttons || ['OK'],
      inputs: inputs,
      enterAnimation: enterAlertAnimation,
      leaveAnimation: leaveAlertAnimation
    });
    return await alert.present();
  }

  async presentToast(message: string, color: string, duration: number, position: 'top' | 'middle' | 'bottom'): Promise<void>;
  async presentToast(message: string, color: string, duration: number): Promise<void>;
  async presentToast(message: string, color: string): Promise<void>;
  async presentToast(message: string): Promise<void>;
  async presentToast(message: string, color?: string, duration?: number, position?: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: message,
      duration: (duration || 1) * 1000,
      position: position || 'top',
      cssClass: 'ion-text-center',
      color: color ? color : 'secondary'
    });
    await toast.present();
  }
}

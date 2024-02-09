import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { InicioPage } from '../component/pages/inicio/inicio.page';  // Asegúrate de importar correctamente
import { RegistroPage } from '../component/pages/registro/registro.page';


@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private modalController: ModalController) {}

  async abrirModalInicio() {  
    const modal = await this.modalController.create({
      component: InicioPage,
      componentProps: {
        mostrarEnModal: true
      },
      cssClass: 'modal-fullscreen'
    });
    return await modal.present();
  }
  async cerrarModal() {
    const modal = await this.modalController.getTop(); // Obtener la instancia del modal abierto
    if (modal) {
      await modal.dismiss(); // Cerrar el modal
    }
  }
  async abrirModalRegistro() {  
    const modal = await this.modalController.create({
      component: RegistroPage,
      componentProps: {
        mostrarEnModal: true
      },
      cssClass: 'modal-fullscreen'
    });
    return await modal.present();
  }
}

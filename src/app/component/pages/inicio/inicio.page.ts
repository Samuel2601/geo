import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertInput } from '@ionic/angular';
import { ApiService } from 'src/app/service/api.service';
import { FcmService } from 'src/app/service/fcm.service';
import { MessagesService } from 'src/app/service/messages.service';
import { SecurityService } from 'src/app/service/security.service';
import { StorageService } from 'src/app/service/storage.service';
import { ModalService } from 'src/app/service/modal.service'; 
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  @Input() mostrarEnModal: boolean=false;
  private SECS_RESUME_SESSION: number = 10;
  public loginForm: FormGroup|any;

  constructor(private router: Router,
    public formBuilder: FormBuilder,
    private apiService: ApiService,
    private messagesService: MessagesService,
    private storageService: StorageService,
    private fcmService: FcmService,
    private modalService: ModalService) { }

  async ngOnInit() {
    this.loginForm = this.formBuilder.group({
      correo: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
          Validators.maxLength(50)
        ],
      ],
      pass: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30)
      ]],
    });
  }
  abrirregistro(): void {
    this.modalService.cerrarModal();
    this.modalService.abrirModalRegistro();
  }

  async ionViewWillEnter() {
    const encToken = await this.storageService.get(StorageService.TOKEN);
    if (encToken && !this.apiService.backgroundActionRunning) {
      await this.messagesService.presentLoading();
      this.apiService.SecurePostResumeSession({ encToken }).subscribe(
        {
          next: (res) => {
            console.log(res.message);
            setTimeout(() => {
              if (this.apiService.getUser() == null) {
                this.messagesService.dismissLoading();
                this.messagesService.presentAlert("Vuelve a iniciar sesión", "Error al restaurar la sesión");
              }
            }, this.SECS_RESUME_SESSION * 1000);
          },
          error: (err) => {
            this.messagesService.dismissLoading();
            this.apiService.errorSubscription(err);
          }
        }
      );
    } else if (encToken && this.apiService.getUser() != null) {
      this.router.navigate(["/home"]);
    }
  }

  get formControls() {
    return this.loginForm.controls;
  }

  async postLogin() {
    if (this.loginForm.valid) {
      await this.messagesService.presentLoading();
      const user = {
        correo: this.loginForm.get("correo")?.value,
        pass: this.loginForm.get("pass")?.value,
      };
      this.apiService.SecurePostLogin(user).subscribe({
        next: (res: any) => {
          console.log(res);
          const { message, data } = res;
          this.messagesService.dismissLoading();
          this.loginForm.reset();
          this.apiService.loadStoredToken(SecurityService.decryptAes(data, false));
          this.messagesService.presentToast(message);
          this.fcmService.initPush();
          this.router.navigate(["/home"]);
        },
        error: (error) => {
          this.messagesService.dismissLoading();
          this.messagesService.presentAlert(error.message);
        }
      });
    } else {
      this.messagesService.presentAlert("Complete los datos");
    }
  }

  async resetPassword() {
    if (this.loginForm.get("correo")?.value) {
      if (this.formControls['correo']?.invalid) {
        this.messagesService.presentToast("Ingresa un correo válido", "danger");
      } else {
        const resetInput: AlertInput[] = [{
          type: 'text',
          placeholder: 'Cédula',
          name: 'cedula'
        }];
        const buttons = [
          {
            text: 'Cancelar',
            cssClass: 'text-color-danger',
            role: 'cancel'
          },
          {
            text: 'Restablecer',
            handler: async (data: any) => {
              const cedula: string = data.cedula;
              if (cedula.length != 10) {
                this.messagesService.presentToast("Cédula inválida", "danger");
                return false;
              }
              try {
                Number.parseInt(cedula);
                this.postReset(cedula);
                return true;
              } catch (error) {
                this.messagesService.presentToast("Cédula inválida", "danger");
                return false;
              }
            }
          }
        ];
        this.messagesService.presentAlert(
          'Ingresa la cédula asociada al correo registrado',
          "Cédula asociada",
          buttons,
          resetInput
        );
      }
    } else {
      this.messagesService.presentToast("Ingresa el correo", "danger");
    }
  }

  async postReset(cedula: string) {
    await this.messagesService.presentLoading();
    this.apiService.SecureResetPass({
      correo: this.loginForm.get("correo")?.value,
      cedula
    }).subscribe(
      {
        next: (res) => {
          this.messagesService.dismissLoading();
          this.messagesService.presentAlert(res.message);
          this.loginForm.reset();
        },
        error: (error) => {
          this.messagesService.dismissLoading();
          this.apiService.errorSubscription(error);
        }
      }
    );
  }
}

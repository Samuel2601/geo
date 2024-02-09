import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { ApiService } from 'src/app/service/api.service';
import { MessagesService } from 'src/app/service/messages.service';
import { SecurityService } from 'src/app/service/security.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  @Input() mostrarEnModal: boolean=false;
  public registroForm: FormGroup|any;

  constructor(private router: Router,
    public formBuilder: FormBuilder,
    private apiService: ApiService,
    private messagesService: MessagesService,
    private storageService: StorageService,
    private platform: Platform) { }

  async ngOnInit() {
    this.registroForm = this.formBuilder.group({
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      correo: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
          Validators.maxLength(50)
        ],
      ],
      celular: ['', [Validators.required, Validators.pattern('^09[0-9]{8}$')]],
      pass: ['', [
        Validators.required,
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\[\\]\{\}#¿?!@$%^&*-_.,:;()/|]).{8,30}$'),
        Validators.minLength(8),
        Validators.maxLength(30)
      ]],
    });
  }

  async ionViewWillEnter() {
    if (await this.storageService.get(StorageService.TOKEN)) {
      this.router.navigate(["/home"]);
    }
  }

  get formControls() {
    return this.registroForm.controls;
  }
  

  async buscarCed() {
    if (!this.formControls['cedula']?.invalid) {
      this.registroForm.get('nombre')?.setValue('');
      this.registroForm.get('nombre')?.disable();
      await this.messagesService.presentLoading();
      this.apiService.SecureGetCedula({ cedula: this.registroForm.get("cedula")?.value }).subscribe({
        next: async (res: any) => {
          const { message, data } = res;
          const response = SecurityService.decryptAes(data);
          await this.messagesService.dismissLoading();
          console.log(response);
          this.messagesService.presentToast(message);
          this.registroForm.get('nombre')?.disable();
          this.registroForm.get("nombre")?.setValue(response.nombres);
        },
        error: async (error) => {
          console.log(error);
          await this.messagesService.dismissLoading();
          this.messagesService.presentAlert(error.message);
          if (error.status !== 0 && error.status !== 400 && error.status !== 401 && error.status !== 403 && error.status !== 503) {
            this.registroForm.get('nombre')?.setValue('');
            this.registroForm.get('nombre')?.enable();
          }
        }
      });
    }
  }

  async postRegistrar() {
    if (this.registroForm.valid) {
      await this.messagesService.presentLoading();
      let data = {
        user: {
          cedula: this.registroForm.get("cedula")?.value,
          nombre: this.registroForm.get("nombre")?.value,
          correo: this.registroForm.get("correo")?.value,
          celular: this.registroForm.get("celular")?.value,
          pass: this.registroForm.get("pass")?.value,
        }
      };
      this.apiService.SecurePostRegistrar(data).subscribe({
        next: (res: any) => {
          this.messagesService.dismissLoading();
          this.messagesService.presentToast(res.message);
          this.registroForm.reset();
          this.router.navigate(['/inicio']);
        },
        error: (error) => {
          this.messagesService.dismissLoading();
          this.messagesService.presentAlert(error.message);
        }
      });
    } else {
      this.messagesService.presentAlert("Complete el formulario");
    }
  }
  verificarTipoDispositivo():boolean {
    if (this.platform.is('desktop')) {
      return true;
    } else {
      return false;
    }
  }  
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { MessagesService } from 'src/app/service/messages.service';
import { SecurityService } from 'src/app/service/security.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.page.html',
  styleUrls: ['./solicitud.page.scss'],
})
export class SolicitudPage implements OnInit {

  public id_categoria: any;
  public id_subcategoria: any;
  private subcategorias: any[] = [];
  public solicitudForm: FormGroup|any;
  private files: File[] = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    public formBuilder: FormBuilder,
    private apiService: ApiService,
    private storageService: StorageService,
    private messagesService: MessagesService) { }

  ngOnInit() {
    this.id_subcategoria = this.route.snapshot.paramMap.get('id');
    this.solicitudForm = this.formBuilder.group({
      tipo: ['1', [Validators.required]],
      direccion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
    });
    this.getSubcategorias();
  }

  async getSubcategorias() {
    const res = await this.storageService.get(StorageService.SUBCATEGORIAS);
    if (res) {
      this.subcategorias = JSON.parse(res);
      this.id_categoria = this.subcategorias.find(s => s.id == this.id_subcategoria).id_categoria;
    } else {
      this.apiService.GetSubcategorias().subscribe(
        {
          next: (res) => {
            const { data } = res;
            this.subcategorias = data;
            this.storageService.set(StorageService.SUBCATEGORIAS, JSON.stringify(this.subcategorias));
            this.id_categoria = this.subcategorias.find(s => s.id == this.id_subcategoria).id_categoria;
          },
          error: (error) => {
            this.messagesService.presentAlert(error.message);
          }
        }
      )
    }
  }

  get formControls() {
    return this.solicitudForm.controls;
  }

  setLocation() {
    this.router.navigate(['/ubicacion']);
  }

  onFilesChange(fileChangeEvent: any) {
    this.files = [];
    Object.keys(fileChangeEvent.target.files).forEach(key => {
      const element = fileChangeEvent.target.files[key];
      this.files.push(element);
    });
  }

  async postSolicitud() {
    if (this.solicitudForm.valid) {
      await this.messagesService.presentLoading();
      const formData = new FormData();
      let data = {
        tipo: this.solicitudForm.get("tipo")?.value,
        id_subcategoria: this.id_subcategoria,
        direccion: this.solicitudForm.get("direccion")?.value,
        descripcion: this.solicitudForm.get("descripcion")?.value,
      };
      formData.append('data', SecurityService.encryptRsa(ApiService.stringifyWithAccent({ aes: SecurityService.getAES(), data })).data);
      this.files.forEach((f, i) => {
        formData.append(`file${i}`, f, f.name);
      });
      this.apiService.PostSolicitud(formData).subscribe({
        next: async (res: any) => {
          this.apiService.reloadSolicitudes = true;
          this.apiService.handleResponse(res);
          await this.messagesService.dismissLoading();
          this.messagesService.presentToast(res.message);
          this.solicitudForm.reset();
          this.solicitudForm.get("tipo")?.setValue("1");
          this.router.navigateByUrl('/tabs/tab1');
        },
        error: async (error) => {
          await this.messagesService.dismissLoading();
          this.apiService.errorSubscription(error);
        }
      });
    } else {
      await this.messagesService.presentAlert("Complete el formulario");
    }
  }
}

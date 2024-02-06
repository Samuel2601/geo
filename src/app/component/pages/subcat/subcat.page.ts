import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-subcat',
  templateUrl: './subcat.page.html',
  styleUrls: ['./subcat.page.scss'],
})
export class SubcatPage implements OnInit {

  private INTRO_TIME: number = 250;
  private subcategorias: any[] = [];
  subcats: any[] = [];
  public id_categoria: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private storageService: StorageService) { }

  async ngOnInit() {
    this.id_categoria = this.route.snapshot.paramMap.get('id');
    await this.getSubcategorias();    
  }

  async getSubcategorias() {
    const res = await this.storageService.get(StorageService.SUBCATEGORIAS);
    if (res) {
      this.subcategorias = JSON.parse(res);
      this.filterSubcats();
    } else {
      this.apiService.GetSubcategorias().subscribe(
        {
          next: (res) => {
            this.subcategorias = this.apiService.handleResponse(res).subcategorias;
            this.storageService.set(StorageService.SUBCATEGORIAS, JSON.stringify(this.subcategorias));
            this.filterSubcats();
          },
          error: (error) => {
            this.apiService.errorSubscription(error);
          }
        }
      )
    }
  }

  filterSubcats() {
    this.subcats = [];
    const subcategorias = this.subcategorias.filter(s => s.id_categoria == this.id_categoria);
    for (let [index, c] of subcategorias.entries()) {
      setTimeout(() => {
        this.subcats.push(c);
      }, this.INTRO_TIME * (index + 1));
    }
  }

  crearSolicitud(value: any) {
    this.router.navigate(['/solicitud/' + value])
  };
}

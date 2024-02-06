import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/service/api.service'; 
import { MessagesService } from 'src/app/service/messages.service';

@Component({
  selector: 'app-detalle-solicitud',
  templateUrl: './detalle-solicitud.page.html',
  styleUrls: ['./detalle-solicitud.page.scss'],
})
export class DetalleSolicitudPage implements OnInit {

  private id: number|any;
  solicitud: any;

  constructor(private route: ActivatedRoute,
    private apiService: ApiService,
    private messagesService: MessagesService) { }

  async ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    await this.messagesService.presentLoading();
    this.solicitud = this.apiService.GetSolicitud(this.id).subscribe({
      next: async (res) => {
        this.solicitud = this.apiService.handleResponse(res).solicitud;
        await this.messagesService.dismissLoading();
      },
      error: async (error) => {
        await this.messagesService.dismissLoading();
        this.apiService.errorSubscription(error);
      }
    });
  }

}

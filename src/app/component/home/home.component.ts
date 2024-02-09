import { Component, AfterViewInit, OnInit } from '@angular/core';
import { LatLng, geoJSON, Map, tileLayer, control, layerGroup } from 'leaflet';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import { SecurityService } from 'src/app/service/security.service';
import { FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';
import { StorageService } from 'src/app/service/storage.service';
import { MessagesService } from 'src/app/service/messages.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router,
    public formBuilder: FormBuilder,
    private apiService: ApiService,
    private messagesService: MessagesService,
    private storageService: StorageService,
    private platform: Platform) { }
 ngOnInit(): void {
   
 }
 llamar_lista(){

  this.apiService.GetUsers().subscribe({
    next: async (res: any) => {
      const lista = this.apiService.handleResponse(res).lista;
      console.log(lista);
    },
    error: async (error: any) => {
      console.log(error);
      await this.messagesService.dismissLoading();
    }
  });
}
}

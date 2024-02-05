import { Component, AfterViewInit, OnInit } from '@angular/core';
import { LatLng, geoJSON, Map, tileLayer, control, layerGroup } from 'leaflet';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
 ngOnInit(): void {
   
 }
}

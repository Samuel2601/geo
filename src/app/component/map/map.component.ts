import { Component, AfterViewInit, OnInit } from '@angular/core';
import { LatLng, geoJSON, Map, tileLayer, control, layerGroup } from 'leaflet';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnInit{
  private mapInitialized = false;
  ngOnInit(): void {
    console.log('Contenedor presente:', document.getElementById('mapid'));
    this.ngAfterViewInit();
  }

  geoJsonData: GeoJSON.Feature = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-79.65537285409525,0.9768760316928443 ],
          [-79.65556865534106,0.9775867136853513],
          [-79.65618824558464,0.977423122749466],
          [-79.65612119036348,0.9767312134570653],
          [-79.65571081240992,0.9767902134797914]
        ]
      ]
    },
    properties: {
      name: 'Mi Zona',
      color: 'green'
    }
  };

  zonaLayer: any;
  map: Map | undefined;

  constructor(public location: Location, private router: Router) {
    // No inicialices el mapa aquí, hazlo en ngAfterViewInit
  }

  ngAfterViewInit(): void {
    // Crea el mapa y establece la vista
    this.map = new Map('mapid').setView([0.977035, -79.655415], 13);

    // Capas base
    const streetLayer = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    });

    const satelliteLayer = tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '© Esri'
    });
    const nexrad = tileLayer.wms("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
        layers: 'nexrad-n0r-900913',
        format: 'image/png',
        transparent: true,
        attribution: "Weather data © 2012 IEM Nexrad"
    });

    // Capa superpuesta (por ejemplo, tu zona)
    const geoJsonData:GeoJSON.Feature = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-79.65537285409525,0.9768760316928443 ],
          [-79.65556865534106,0.9775867136853513],
          [-79.65618824558464,0.977423122749466],
          [-79.65612119036348,0.9767312134570653],
          [-79.65571081240992,0.9767902134797914]
          ]
        ]
      },
      properties: {
        name: 'Mi Zona',
        color: 'green'
      }
    };

    const zonaLayer = geoJSON(geoJsonData, {
      style: {
        fillColor: 'green',
        weight: 2,
        color: 'white',
        fillOpacity: 0.5
      }
    });
    const overlayGroup = layerGroup([streetLayer, nexrad]);
    // Agrega capas al control de capas
    const baseLayers = {
      'Mapa de Calles': streetLayer,
      'Imágenes Satelitales': satelliteLayer
    };

    const overlays = {
      'Mi Zona': zonaLayer,
      'NEXRAD Overlay': nexrad,
      'Imágenes Satelitales': satelliteLayer
    };
    // Agrega el control de capas al mapa
    control.layers(baseLayers, overlays).addTo(this.map);

    // Establece la capa de calle como predeterminada
    streetLayer.addTo(this.map);
  }

  ngOnDestroy(): void {
    // Desconecta el observador de cambios cuando el componente se destruye
    this.mapInitialized = false;
  }

  options = {
    layers: [
      tileLayer.wms(
        "http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
          layers: 'nexrad-n0r-900913',
          format: 'image/png',
          transparent: true,
          attribution: "Weather data © 2012 IEM Nexrad"
      }
      ),
    ],
    zoom: 15,
    center: new LatLng(0.977035, -79.655415)
  };

  layers = [];

}

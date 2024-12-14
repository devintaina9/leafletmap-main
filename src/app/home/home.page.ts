import { Component } from '@angular/core';
import * as leaflet from 'leaflet';
// import * as leaflet from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-control-geocoder';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { circle } from 'leaflet';
import { ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';

declare var L: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  // distance:number=0;
  map!: leaflet.Map;
//  map!: leaflet.Map;
  locationLayerGroup = new L.LayerGroup();
  gpsLoadingEl!: HTMLIonLoadingElement;
  randomMessage: string = '';
  distance: number = 0;

  @ViewChild(IonModal)
  modal!: IonModal; // Pastikan ini dideklarasikan dengan benar

  message!: string;
  dropdownOpen = false;
  constructor(private loadingController: LoadingController, private alertController: AlertController, private modalCtrl: ModalController, private router: Router) { }

  ngOnInit() {}

  ionViewDidEnter() {
    // Membuat peta dengan koordinat awal
    // this.map = L.map('mapId').setView([-7.740888969687221, 110.49237787019925], 10);
 this.map = L.map('mapId').setView([-7.740888969687221, 110.49237787019925], 10); // Default to DIY
    // Opsi basemap
    const openStreetMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    });

    const cartoDBPositron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd'
    });

    const cartoDBDarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd'
    });

    const esriWorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    const esriTopo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles © Esri — Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
    });

    const openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
    });

    const thunderforestOutdoors = L.tileLayer('https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=your-api-key', {
      attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>',
      subdomains: 'abc'
    });

    // Menambahkan basemap OpenStreetMap sebagai default
    openStreetMap.addTo(this.map);

    // Layer Control untuk memilih basemap
    const baseMaps = {
      "OpenStreetMap": openStreetMap,
      "CartoDB Positron": cartoDBPositron,
      "CartoDB Dark Matter": cartoDBDarkMatter,
      "Esri World Imagery": esriWorldImagery,
      "Esri Topographic": esriTopo,
      "OpenTopoMap": openTopoMap,
      "Thunderforest Outdoors": thunderforestOutdoors
    };

    // leaflet.control.layers(baseMaps).addTo(this.map);

    // Standard Leaflet marker icon
    const simpleMarkerIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      shadowSize: [41, 41],
      shadowAnchor: [13, 41]
    });

    // Markers with popups
    const markerLocations: { coords: [number, number]; title: string; image: string; description: string }[] = [
      {
        coords: [-7.740888969687221, 110.49237787019925],
        title: 'Candi Prambanan',
        image: 'https://kitakabari.com/wp-content/uploads/2022/01/Candi-Prambanan-Sleman-e1641614754771-2048x1376.jpg',
        description: 'Candi Prambanan adalah candi Hindu terbesar di Indonesia12. Candi ini memiliki tinggi 47 meter dan lebar 34 meter, yang lebih tinggi dari candi sejenisnya2. Letaknya berada di antara 2 wilayah, yaitu Yogyakarta dan Jawa Tengah1. Kompleks Candi Prambanan terdiri dari sekitar 250 candi dan memiliki tiga zona yang berbeda: luar, tengah, dan bagian dalam2. Candi ini terletak di Dusun Karangasem, Desa Bokoharjo, Kecamatan Prambanan, Sleman, Daerah Istimewa Yogyakarta, Jawa Tengah.'
      },
      {
        coords: [-7.637981198840965, 110.59853130814577],
        title: 'Umbul Jolotundo',
        image: 'https://www.nativeindonesia.com/foto/2023/05/umbul-jolotundo.jpg',
        description: 'Umbul Jolotundo terletak di Jalan Klaten - Jatinom No.7, Dusun I, Gedaren, Kec. Jatinom, Kabupaten Klaten, Jawa Tengah12345. Tempat ini berjarak sekitar 10 km dari pusat kota Klaten dan dapat ditempuh dalam waktu 20-30 menit.'
      },
      {
        coords: [-7.745154842026572, 110.62531048526418],
        title: 'Rowo Jombor Klaten',
        image: 'https://media-cdn.tripadvisor.com/media/photo-s/16/1a/6a/da/suasana-rowo-jombor-dipagi.jpg',
        description: 'Rowo Jombor adalah waduk yang terletak di Desa Wisata Krakitan, Kecamatan Bayat, sekitar delapan kilometer ke arah tenggara dari pusat Kota Klaten, Jawa Tengah, Indonesia12345. Waduk ini digunakan untuk mengairi lahan pertanian di sekitarnya dan juga sebagai obyek pariwisata. Rowo Jombor memiliki luas 198 hektare dengan kedalaman hingga 4,5 meter2.'
      },
      {
        coords: [-7.608376104007904, 110.63526684445645],
        title: 'Umbul Ponggok',
        image: 'https://blog.tripcetera.com/id/wp-content/uploads/2020/08/image-5.png',
        description: 'Umbul Ponggok terletak di Desa Ponggok, Jalan Delanggu, Kecamatan Polanharjo, Klaten, Jawa Tengah. Umbul ini termasuk salah satu sumber mata air tertua di daerah Klaten, sudah ada sejak awal abad 19. Umbul Ponggok memiliki kolam luas yang dapat dinikmati oleh pengunjung. Biaya masuk adalah Rp10.000 untuk hari biasa dan Rp15.000 di hari Sabtu, Minggu, dan libur nasional.'
      },
      {
        coords: [-7.759442609872704, 110.66479259580875],
        title: 'Bukit Cinta Watu Prahu',
        image: 'https://static.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p2/230/2024/03/11/cinta-645772700.png',
        description: 'Bukit Cinta Watu Prahu terletak di Desa Gunung Gajah, Kecamatan Bayat, Kabupaten Klaten, Jawa Tengah. Awalnya perbukitan biasa, Bukit Cinta Watu Prahu diubah menjadi tempat rekreasi yang instagramable. Pengunjung dapat menikmati pemandangan alam maupun wahana air.'
      }
    ];

    // Loop through each location and add a marker with a popup
    markerLocations.forEach(location => {
      const marker = L.marker(location.coords, { icon: simpleMarkerIcon }).addTo(this.map);
      marker.bindPopup(`
        <b>${location.title}</b><br>
        ${location.description}<br>
        <img src="${location.image}" alt="${location.title}" width="200px"/>
      `);
    });

    leaflet.control.layers(baseMaps).addTo(this.map);

    function naiveRound(num: number, decimalPlaces = 0) {
      var p = Math.pow(10, decimalPlaces);
      return Math.round(num * p) / p;
  }

    // Add routing control using Leaflet Routing Machine
        const routingControl = (leaflet as any).Routing.control({
          waypoints: [
            leaflet.latLng(-7.740888969687221, 110.49237787019925), // Starting point (UGM)
            leaflet.latLng(-7.637981198840965, 110.59853130814577),  // Destination point (UNY)
          ],
          routeWhileDragging: false,
          geocoder: L.Control.Geocoder.nominatim()  // Optional: Adds a geocoder for location search
        }).addTo(this.map);
        routingControl.on('routesfound', (e : any) => {
          var routes = e.routes;
          var summary = routes[0].summary;
          // alert distance and time in km and minutes
          //alert('Total distance is ' + summary.totalDistance / 1000 + ' km and total time is ' + Math.round(summary.totalTime % 3600 / 60) + ' minutes');
          this.distance = naiveRound(summary.totalDistance / 1000, 1);
          // let inputdistance = document.getElementById("ion-input-0");
          // if (inputdistance!== null){
          //    (inputdistance as HTMLInputElement).value =  "'" + summary.totalDistance / 1000 + "'";
            // inputdistance.innerHTML =
            // "Value = " + "'" + summary.totalDistance / 1000 + "'";
          // }
    
        });
      }
        // Geolocation function
          public async locate() {
            this.locationLayerGroup.clearLayers();
            if (!navigator.geolocation) {
              console.error('Geolocation is not supported by your browser');
              return;
            }
            await this.presentLoading();
            navigator.geolocation.getCurrentPosition(
              (position) => this.onLocationSuccess(position),
              (error) => this.onLocateError(error),
              { enableHighAccuracy: true }
            );
          }
        
          private onLocationSuccess(position: GeolocationPosition) {
            const { accuracy, latitude, longitude } = position.coords;
            const latlng: [number, number] = [latitude, longitude];  // Perbaikan tuple
            this.hideLoading();
            this.map.setView(latlng, 18);
            const accuracyValue = accuracy > 1000 ? accuracy / 1000 : accuracy;
            const accuracyUnit = accuracy > 1000 ? 'km' : 'm';
            this.placeLocationMarker(latlng, `Accuracy is ${accuracyValue} ${accuracyUnit}`);
            const locationCircle = circle(latlng, accuracy);
            this.locationLayerGroup.addLayer(locationCircle);
          }
        
          private async onLocateError(error: GeolocationPositionError) {
            this.hideLoading();
            const alert = await this.alertController.create({
              header: 'GPS error',
              message: error.message,
              buttons: ['OK']
            });
            await alert.present();
          }
        
          private async presentLoading() {
            this.gpsLoadingEl = await this.loadingController.create({
              message: 'Locating device ...',
            });
            await this.gpsLoadingEl.present();
          }
        
          private hideLoading() {
            this.gpsLoadingEl.dismiss();
          }
        
          private placeLocationMarker(latlng: [number, number], message: string) {
            // const marker = new L.Marker(latlng,{icon:customIcon}).bindPopup(message).addTo(this.map);
            const locationCircle = L.circle(latlng, { radius: 50 }).addTo(this.map);
            // this.locationLayerGroup.addLayer(marker);
            this.locationLayerGroup.addLayer(locationCircle);
          }

          toggleDropdown() {
            this.dropdownOpen = !this.dropdownOpen;
          }
  }



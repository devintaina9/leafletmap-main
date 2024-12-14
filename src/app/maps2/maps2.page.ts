import { Component, OnInit } from '@angular/core';
import * as leaflet from 'leaflet';
import 'leaflet-routing-machine';  // Plugin routing
import 'leaflet-control-geocoder';  // Plugin geocoder
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { circle } from 'leaflet';
import { ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Router } from '@angular/router';

declare var L: any;
export type VehicleType = 'gasoline' | 'diesel' | 'motor';

const customIcon = new leaflet.Icon({
  iconUrl: '../../assets/icon/location1.gif',
  // shadowUrl: '../../assets/icon/marker-icon-2x.png',
  iconSize: [40, 45],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

leaflet.Marker.prototype.options.icon = customIcon;

@Component({
  selector: 'app-maps2',
  templateUrl: './maps2.page.html',
  styleUrls: ['./maps2.page.scss'],
})



export class Maps2Page implements OnInit {
  map!: leaflet.Map;
  locationLayerGroup = new leaflet.LayerGroup();
  gpsLoadingEl!: HTMLIonLoadingElement;
  randomMessage: string = '';
  distance: number = 0;
  vehicleType!: VehicleType;
  emissionResult: number | null = null;
  @ViewChild(IonModal)
  modal!: IonModal; // Pastikan ini dideklarasikan dengan benar

  message!: string;
  dropdownOpen = false;

  constructor(private loadingController: LoadingController, private alertController: AlertController, private modalCtrl: ModalController, private router: Router) { }


  ngOnInit() {
  }


  ionViewDidEnter() {
    // Initialize the map
    this.map = leaflet.map('map').setView([-7.798316342921687, 110.35699080287542], 10); // Default to DIY

    // Base map layer - OpenStreetMap
    // const openStreetMap = leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    // });

    // Base map layer - Google Maps (Satellit view)
    // const googleSat = leaflet.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    //   subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    //   attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>',
    // });

    // Base map layer - Esri WorldStreetMap
    // const esriWorldStreetMap = leaflet.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    //   attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ',
    // });

    // Menambahkan base map default (OpenStreetMap)
    // openStreetMap.addTo(this.map);

    // Menambahkan Layer Control
  //   const baseMaps = {
  //     'OpenStreetMap': openStreetMap,
  //     'satellite view': googleSat,
  //     'Esri WorldStreetMap': esriWorldStreetMap,
  //   };
  //   leaflet.control.layers(baseMaps).addTo(this.map);

    function naiveRound(num: number, decimalPlaces = 0) {
      var p = Math.pow(10, decimalPlaces);
      return Math.round(num * p) / p;
  }
    // Add routing control using Leaflet Routing Machine
    const routingControl = (leaflet as any).Routing.control({
      waypoints: [
        leaflet.latLng(-7.767601279498855, 110.37863925231875), // Starting point (UGM)
        leaflet.latLng(-7.773494996707823, 110.3862296369753),  // Destination point (UNY)
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
    const marker = new L.Marker(latlng,{icon:customIcon}).bindPopup(message).addTo(this.map);
    const locationCircle = leaflet.circle(latlng, { radius: 50 }).addTo(this.map);
    this.locationLayerGroup.addLayer(marker);
    this.locationLayerGroup.addLayer(locationCircle);
  }
  //kalkulator emisi co2

  // Data konsumsi bahan bakar dan faktor emisi
  // fuelConsumption: Record<VehicleType, number> = {
  //   gasoline: 2.394e-6,
  //   diesel: 2.052e-6,
  //   motor: 1.197e-6
  // };

  // emissionFactors: Record<VehicleType, number> = {
  //   gasoline: 69300,
  //   diesel: 74100,
  //   motor: 69300
  // };


  // cancel() {
  //   this.modal.dismiss(null, 'cancel');
  // }

  // onWillDismiss(event: Event) {
  //   const ev = event as CustomEvent<OverlayEventDetail<string>>;
  //   if (ev.detail.role === 'confirm') {
  //     this.message = `Hello, ${ev.detail.data}!`;
  //   }
  // }

  // calculateEmissions() {
  //   if (this.distance && this.vehicleType) {
  //     const fuelConsumptionRate = this.fuelConsumption[this.vehicleType];
  //     const emissionFactor = this.emissionFactors[this.vehicleType];
  //     this.emissionResult = this.distance * fuelConsumptionRate * emissionFactor; // Calculate emissions

  //     // Generate a random message for user encouragement
  //     const randomMessages = [
  //       "Ayo Pilih Kendaraan Ramah Lingkungan! Jika kamu sedang mempertimbangkan kendaraan baru, pertimbangkanlah kendaraan listrik atau hybrid untuk mengurangi dampak emisi",
  //       "Rutin Servis Kendaraanmu! Mari kita jadwalkan perawatan berkala untuk memastikan kendaraan kita berfungsi efisien dan meminimalkan emisi",
  //       "Cobalah untuk tidak mengemudi dengan kecepatan tinggi. Berkendara dengan stabil dapat membantu mengurangi konsumsi bahan bakar",
  //       "Saat berhenti lebih dari satu menit, mari kita matikan mesin untuk menghemat bahan bakar dan mengurangi emisi",
  //       "Gunakan Transportasi Umum Bersama! Yuk, kita coba menggunakan transportasi umum atau berbagi tumpangan",
  //       "Ayo bawa barang yang diperlukan saja agar kendaraan kita lebih ringan dan efisien dalam menggunakan bahan bakar",
  //       "Dengan merencanakan perjalanan dengan baik, kita bisa menghindari kemacetan dan mengurangi waktu berkendara",
  //       "Hindari Aksesoris yang Boros Energi! Mari kita matikan perangkat elektronik yang tidak diperlukan saat berkendara, agar kendaraan kita lebih hemat energi",
  //       "Dukung Sumber Energi Terbarukan! Jika ada kesempatan, ayo isi bahan bakar dari sumber yang ramah lingkungan dan terbarukan",
  //       "Mari kita ajak teman dan keluarga untuk ikut berpartisipasi dalam menjaga lingkungan dan mengurangi emisi karbon",
  //     ];
  //     this.randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
  //   }
  // }
  // resetCalculator() {
  //   this.distance = 0;           // Reset jarak
  //   this.vehicleType = 'gasoline' // Reset jenis kendaraan
  //   this.emissionResult = null;  // Reset hasil emisi
  //   this.randomMessage = '';      // Reset pesan himbauan
  // }

  // openMap() {
  //   this.router.navigate(['/map-analyst']); // Adjust if the route is different
  // }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

}
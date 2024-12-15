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
        coords: [-7.744163005018623, 110.49253672812597],
        title: 'Candi Sewu',
        image: 'https://www.indoneo.com/wp-content/uploads/2017/03/prambanan-temple-compund.jpg',
        description: 'Candi Sewu terletak di kompleks Candi Prambanan, tepatnya di Kabupaten Klaten, Jawa Tengah. Candi Buddha terbesar kedua di Indonesia ini dapat dikunjungi setiap hari mulai pukul 06.00 hingga 17.00 WIB. Tiket masuk ke kompleks Candi Prambanan, termasuk akses ke Candi Sewu, dikenakan biaya sekitar Rp50.000 untuk dewasa domestik, sementara tarif khusus berlaku bagi wisatawan anak-anak dan mancanegara. Candi ini menawarkan keindahan arsitektur kuno dan suasana historis yang memikat.'
      },
      {
        coords: [-7.755575440641052, 110.50092558815113],
        title: 'Taman Candi Bocah',
        image: 'https://i.ytimg.com/vi/aHwobDAcZkU/maxresdefault.jpg',
        description: 'Taman Candi Bocah terletak di Prambanan, Klaten, Jawa Tengah, dan merupakan destinasi wisata yang cocok untuk keluarga. Taman ini menawarkan pemandangan indah dengan latar belakang Candi Prambanan yang megah, serta berbagai fasilitas untuk anak-anak. Pengunjung dapat menikmati berbagai wahana permainan sambil belajar tentang sejarah dan budaya. Taman ini buka setiap hari mulai pukul 08.00 hingga 17.00 WIB. Tiket masuknya sekitar Rp 20.000 per orang, dengan biaya tambahan untuk wahana tertentu. Lokasinya mudah dijangkau, berada di sekitar kompleks Candi Prambanan.'
      },
      {
        coords: [-7.74949447893441, 110.49379805613542],
        title: 'Museum Candi Prambanan',
        image: 'https://www.indoneo.com/wp-content/uploads/2017/03/prambanan-temple-compund.jpg',
        description: 'Candi Sewu terletak di kompleks Candi Prambanan, tepatnya di Kabupaten Klaten, Jawa Tengah. Candi Buddha terbesar kedua di Indonesia ini dapat dikunjungi setiap hari mulai pukul 06.00 hingga 17.00 WIB. Tiket masuk ke kompleks Candi Prambanan, termasuk akses ke Candi Sewu, dikenakan biaya sekitar Rp50.000 untuk dewasa domestik, sementara tarif khusus berlaku bagi wisatawan anak-anak dan mancanegara. Candi ini menawarkan keindahan arsitektur kuno dan suasana historis yang memikat.'
      },
      {
        coords: [-7.605851964461368, 110.64512413802551],
        title: 'Umbul Sigedang',
        image: 'https://cdn-2.tstatic.net/tribunnewswiki/foto/bank/images/Umbul-Sigedang-4.jpg',
        description: 'Umbul Sigedang adalah destinasi wisata mata air alami yang terletak di Desa Dukuh, Kecamatan Banyudono, Kabupaten Boyolali, Jawa Tengah. Tempat ini menawarkan suasana segar dengan air jernih yang berasal langsung dari sumber alami. Umbul ini buka setiap hari mulai pukul 06.00 hingga 18.00 WIB. Tiket masuknya cukup terjangkau, biasanya sekitar Rp10.000 per orang, menjadikannya pilihan favorit untuk rekreasi keluarga atau sekadar bersantai.'
      },
      {
        coords: [-7.574173356111453, 110.4668851948398],
        title: 'Deles Indah',
        image: 'https://poskita.co/wp-content/uploads/2018/11/23-2a.jpg',
        description: 'Deles Indah terletak di Desa Sidorejo, Kecamatan Kemalang, Klaten, Jawa Tengah. Berada di lereng Gunung Merapi, tempat ini menawarkan udara sejuk dan pemandangan alam yang memukau, seperti panorama Gunung Merapi dan hamparan perbukitan hijau. Beberapa spot menarik yang dapat dikunjungi di kawasan ini antara lain Goa Jepang, Makam Kyai Mlayopati, dan Bukit Pring Cendani. Deles Indah cocok untuk jalan-jalan santai, piknik keluarga, atau sekadar menikmati suasana alam yang tenang. Harga tiket masuknya sangat terjangkau, yaitu Rp5.000 pada hari biasa dan Rp7.500 saat akhir pekan atau libur nasional. Tempat ini buka setiap hari mulai pukul 08.00 hingga 17.00 WIB, menjadikannya destinasi ideal untuk rekreasi.'
      },
      {
        coords: [-7.7612166674661545, 110.49623580592606],
        title: 'Candi Sojiwan',
        image: 'https://redaksi.inibaru.id/nuploads/62/Candi%20Sojiwan.jpg',
        description: 'Candi Sojiwan terletak di Desa Kebon Dalem Kidul, Kecamatan Prambanan, Klaten, Jawa Tengah. Candi ini merupakan candi peninggalan abad ke-9 yang bercorak Buddha dan dikenal dengan relief yang menggambarkan cerita fabel. Dikelilingi taman hijau yang asri, Candi Sojiwan cocok untuk wisata sejarah dan bersantai. Tiker masuk 25.000, dan tempat ini buka setiap hari.'
      },
      {
        coords: [-7.6137951597618985, 110.63586267073266],
        title: 'Umbul Ponggok Klaten',
        image: 'https://www.hargatiket.net/wp-content/uploads/2018/07/Harga-Tiket-Masuk-Umbul-Ponggok-Klaten.jpg',
        description: 'Umbul Ponggok terletak di Desa Ponggok, Kecamatan Polanharjo, Kabupaten Klaten, Jawa Tengah. Umbul ini merupakan salah satu destinasi wisata air populer yang menawarkan pengalaman unik bagi pengunjung. Dengan kolam alami yang luas dan jernih, Umbul Ponggok menjadi tempat favorit untuk snorkeling dan fotografi bawah air. Pengunjung dapat menyewa perlengkapan snorkeling dan menikmati keindahan dasar kolam yang dihiasi pasir, bebatuan, serta berbagai properti unik untuk berfoto. Biaya masuk adalah Rp10.000 pada hari biasa dan Rp15.000 saat akhir pekan atau libur nasional, menjadikannya pilihan wisata yang terjangkau dan menyenangkan.'
      },
      {
        coords: [-7.743959547228257, 110.49609152182974],
        title: 'Candi Gana',
        image: 'https://photodharma.net/Recent/Malang.jpg',
        description: 'Candi Gana terletak di Desa Bugisan, Kecamatan Prambanan, Klaten, Jawa Tengah. Candi Hindu ini dibangun pada abad ke-9 dan memiliki arsitektur yang sederhana namun tetap menarik. Meskipun sebagian besar bangunannya sudah rusak, reruntuhan yang ada masih mencerminkan kemegahan candi pada masa lalu. Candi Gana menjadi salah satu destinasi yang menarik bagi pengunjung yang ingin mempelajari sejarah dan budaya Jawa Kuno. Dengan harga tiket masuk yang terjangkau, yaitu Rp5.000, Candi Gana buka setiap hari mulai pukul 08.00 hingga 17.00 WIB, menjadikannya pilihan tepat untuk wisata sejarah.'
      },
      {
        coords: [-7.58307278740983, 110.46191217949854],
        title: 'Kali Talang',
        image: 'https://img.inews.co.id/media/600/files/inews_new/2019/05/31/merapi2.jpg',
        description: 'Kali Talang terletak di Kabupaten Klaten, Jawa Tengah, dan menawarkan pemandangan sungai yang indah serta suasana alam yang tenang. Tempat ini sering dikunjungi untuk berfoto, bersantai, atau menikmati aktivitas seperti memancing. Dengan akses yang mudah dari pusat kota, Kali Talang menjadi pilihan tepat untuk relaksasi. Tiket masuknya gratis, namun ada biaya untuk parkir atau aktivitas tertentu. Kali Talang buka setiap hari dari pukul 08.00 hingga 17.00 WIB.'
      },
      {
        coords: [-7.682874898347335, 110.65733076544325],
        title: 'Sendang Tirto Sinongko',
        image: 'https://www.taraletsanywhere.com/wp-content/uploads/2023/10/malbog-sulfur-spring-by-mimaropaventures.jpg',
        description: 'Sendang Tirto Sinongko terletak di Desa Kranggan, Kecamatan Polanharjo, Klaten, Jawa Tengah. Tempat ini dikenal dengan mata air alami yang jernih dan dipercaya memiliki khasiat bagi kesehatan. Sendang Tirto Sinongko sering dikunjungi oleh warga setempat dan wisatawan untuk berendam atau sekadar menikmati keindahan alam sekitar. Tiket masuknya sangat terjangkau, yaitu Rp5.000 per orang. Tempat ini buka setiap hari dari pukul 08.00 hingga 17.00 WIB, menjadikannya sebagai destinasi wisata alam yang cocok untuk relaksasi dan wisata keluarga.'
      },
      {
        coords: [-7.702311598184126, 110.55803765015365],
        title: 'Pluneng Water Park',
        image: 'https://renangloka.com/wp-content/uploads/2022/09/pluneng-water-park.jpeg',
        description: 'Pluneng Water Park terletak di Desa Pluneng, Kecamatan Kebonarum, Klaten, Jawa Tengah. Tempat wisata ini menawarkan wahana air yang menyenangkan dengan kolam renang dari sumber mata air alami yang jernih dan segar. Pluneng Water Park cocok untuk rekreasi keluarga, terutama anak-anak yang ingin bermain air dengan aman. Tiket masuknya cukup terjangkau, yaitu Rp10.000 pada hari biasa dan Rp15.000 saat akhir pekan atau hari libur. Tempat ini buka setiap hari dari pukul 08.00 hingga 17.00 WIB, menjadikannya pilihan tepat untuk menghabiskan waktu santai bersama keluarga.'
      },
      {
        coords: [-7.705518778273898, 110.60179149484134],
        title: 'Alun-alun Klaten',
        image: 'https://dishub.klaten.go.id/compro/uploads/images/image_650x433_63f81547c1a9b.jpg',
        description: 'Alun-Alun Klaten terletak di pusat Kota Klaten, Jawa Tengah, dan merupakan ruang terbuka hijau yang menjadi ikon kota. Tempat ini sering digunakan sebagai lokasi untuk bersantai, berolahraga, atau menikmati kuliner dari pedagang kaki lima di sekitarnya. Alun-Alun Klaten cocok untuk rekreasi keluarga atau sekadar menikmati suasana kota yang nyaman. Tidak ada biaya masuk untuk menikmati kawasan ini, sehingga pengunjung dapat datang kapan saja. Alun-Alun Klaten buka setiap hari selama 24 jam, menjadikannya tempat yang selalu ramai dikunjungi, terutama di sore dan malam hari.'
      },
      {
        coords: [-7.637981198840965, 110.59853130814577],
        title: 'Umbul Jolotundo',
        image: 'https://www.nativeindonesia.com/foto/2023/05/umbul-jolotundo.jpg',
        description: 'Umbul Jolotundo terletak di Jalan Klaten - Jatinom No.7, Dusun I, Gedaren, Kec. Jatinom, Kabupaten Klaten, Jawa Tengah12345. Tempat ini berjarak sekitar 10 km dari pusat kota Klaten dan dapat ditempuh dalam waktu 20-30 menit.'
      },
      {
        coords: [-7.741176658323621, 110.50457367195744],
        title: 'Candi Plaosan',
        image: 'https://i1.wp.com/www.itrip.id/wp-content/uploads/2020/12/Candi-Plaosan.jpg',
        description: 'Candi Plaosan terletak di Desa Bugisan, Kecamatan Prambanan, Kabupaten Klaten, Jawa Tengah. Candi ini merupakan salah satu kompleks candi peninggalan abad ke-9 yang dibangun pada masa Kerajaan Mataram Kuno. Kompleks Candi Plaosan terdiri dari dua bagian utama, yaitu Candi Plaosan Lor dan Candi Plaosan Kidul, yang dikenal dengan arsitekturnya yang unik dan artistik. Pengunjung dapat menikmati keindahan candi yang dikelilingi oleh suasana pedesaan yang asri. Biaya masuk ke Candi Plaosan adalah Rp10.000 untuk wisatawan lokal dan Rp30.000 untuk wisatawan mancanegara.'
      },
      {
        coords: [-7.758543665823617, 110.63359835656648],
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



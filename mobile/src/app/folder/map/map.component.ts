import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import { useGeographic } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import proj4 from 'proj4';
import {
  Circle as CircleStyle,
  Fill,
  RegularShape,
  Stroke,
  Style,
  Text,
  Icon,
} from 'ol/style';
import Cluster from 'ol/source/Cluster';
import { BikesService } from 'src/app/service/bikes.service';
import { defaults as defaultInteractions, Select } from 'ol/interaction';
import { ActivatedRoute, Router } from '@angular/router';
import TileJSON from 'ol/source/TileJSON';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
  map: any;
  view: any;
  initialCoordinates = [3.876716, 43.610769];
  selectedFeature = null;
  bikesPriority = true; // Bikes priority or Slots priority
  informations = null;
  locationPoint = new Point([0, 0]); // Location point (hidden by default)

  earthquakeFill = new Fill({
    color: 'rgba(255, 153, 0, 0.8)',
  });
  earthquakeStroke = new Stroke({
    color: 'rgba(255, 204, 0, 0.2)',
    width: 1,
  });
  textFill = new Fill({
    color: '#fff',
  });
  textStroke = new Stroke({
    color: 'rgba(0, 0, 0, 0.6)',
    width: 3,
  });
  invisibleFill = new Fill({
    color: 'rgba(255, 255, 255, 0.01)',
  });

  constructor(
    private bikesService: BikesService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private geolocation: Geolocation,
    public toastController: ToastController
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.initialCoordinates = JSON.parse(this.router.getCurrentNavigation().extras.state.coords);
      }
    });
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.bikesService.updateBikes().then((_) => {
      this.olMap();
    });
  }

  // method that convert EPSG:4326 to EPSG:3857
  convertTo3857(coordinates: number[]) {
    return proj4('EPSG:4326', 'EPSG:3857', coordinates);
  }

  // method that convert EPSG:3857 to EPSG:4326
  convertTo4326(coordinates: number[]) {
    return proj4('EPSG:3857', 'EPSG:4326', coordinates);
  }

  olMap() {
    useGeographic();
    this.view = new View({
      center: this.initialCoordinates,
      zoom: 16,
    });
    const backgroundSource = new TileJSON({
      url: 'https://api.maptiler.com/maps/basic/tiles.json?key=GMtn25OfudDkVwONlKeE',
      tileSize: 512,
      crossOrigin: 'anonymous'
    });
    this.map = new Map({
      layers: [
        new TileLayer({
          source: backgroundSource,
        })
      ],
      target: 'map',
      view: this.view,
      controls: [],
      interactions: defaultInteractions({
        doubleClickZoom: false,
        altShiftDragRotate: false,
        pinchRotate: false,
      }),
    });
    this.bikesService.getStationsJSON().then((informations) => {
      this.informations = informations;
      this.setMarkers(informations);
    });
  }

  selectStyle(feature) {
    const isFavorite = feature.get('features')[0]?.get('favorite');
    const name = feature.get('features')[0]?.get('name');
    const style = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        scale: [0.05, 0.05],
        src: isFavorite ? 'assets/marker-favorite.png' : 'assets/marker.png',
      }),
      text: new Text({
        text: name,
        fill: new Fill({
          color: '#000',
        }),
        stroke: new Stroke({
          color: '#fff',
          width: 2,
        }),
        scale: 2.5,
        offsetY: 15,
      }),
    });
    return style;
  }

  setMarkers(informations) {
    // set markers with icons
    // https://viglino.github.io/ol-ext/examples/style/map.style.font.html
    const stations = informations.data.stations;
    const bikes = this.bikesService.getBikes().data.stations;
    const source = new VectorSource();
    stations.forEach((station: any) => {
      const coordinates = [station.lon, station.lat];
      const feature = new Feature(new Point(coordinates));
      feature.set('name', station.name);
      feature.set('station_id', station.station_id);
      feature.set('favorite', station.favorite);
      feature.set('coords', { lat: station.lat, lon: station.lon });
      const bikeStation = bikes.find((bike) => bike.station_id === station.station_id);
      if (bikeStation) {
        feature.set('data', {
          bikes: bikeStation.num_bikes_available,
          slots: bikeStation.num_docks_available,
          capacity: station.capacity,
        });
        source.addFeatures([feature]);
      }
    });

    // select interaction working on "singleclick"
    const selectSingleClick = new Select({
      style: this.selectStyle,
      hitTolerance: 20,
    });
    this.map.addInteraction(selectSingleClick);
    selectSingleClick.on('select', (e) => {
      const elem = document.getElementById('info-station');
      this.selectedFeature = null;
      if (!elem.classList.contains('info-station-hide')) {
        elem.classList.add('info-station-hide');
        this.selectedFeature = null;
      } else {
      }
      if (e.target.getFeatures().getArray()[0]) {
        if (elem.classList.contains('info-station-hide')) {
          elem.classList.remove('info-station-hide');
        }
        this.selectedFeature = e.target
          .getFeatures()
          .getArray()[0]
          .get('features')[0];
        // Force detect changes
        this.changeDetectorRef.detectChanges();
        console.log(this.selectedFeature);
        const coords = e.target
          .getFeatures()
          .getArray()[0]
          .getGeometry()
          .getCoordinates();
        coords[1] = coords[1] - 0.002;
        this.view.animate({ zoom: 16 }, { center: coords });
      }
    });

    const clusterSource = new Cluster({
      distance: 40,
      minDistance: 26,
      source,
    });
    const clusters = new VectorLayer({
      source: clusterSource,
      style: (feature) => {
        const size = feature.get('features').length;
        let style = null;
        if (size > 1) {
          style = new Style({
            image: new CircleStyle({
              radius: 10,
              stroke: new Stroke({
                color: '#fff',
              }),
              fill: new Fill({
                color: '#000',
              }),
            }),
            text: new Text({
              text: size.toString(),
              fill: new Fill({
                color: '#fff',
              }),
            }),
          });
        } else {
          const isFavorite = feature.get('features')[0].get('favorite');
          const name = feature.get('features')[0].get('name');
          const data = feature.get('features')[0].get('data');
          style = new Style({
            image: new Icon({
              anchor: [0.5, 1],
              scale: [0.035, 0.035],
              src: this.getIconName(isFavorite, data.bikes, data.slots, data.capacity),
            }),
            text: new Text({
              text: this.troncateName(name, 13),
              fill: new Fill({
                color: '#000',
              }),
              stroke: new Stroke({
                color: '#fff',
                width: 2,
              }),
              scale: 1.6,
              offsetY: 15,
            }),
          });
        }
        return style;
      },
    });
    this.map.addLayer(clusters);
    setTimeout(() => {
      this.map.updateSize();
    }, 500);
  }

  troncateName(name: string, maxLength: number) {
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + '...';
    } else {
      return name;
    }
  }

  getIdSelectedStation() {
    if (this.selectedFeature) {
      return this.selectedFeature.get('station_id');
    } else {
      return -1;
    }
  }

  getNameSelectedStation() {
    if (this.selectedFeature) {
      return this.selectedFeature.get('name');
    } else {
      return 'Unknown';
    }
  }

  getCoordsSelectedStation() {
    if (this.selectedFeature) {
      return this.selectedFeature.get('coords');
    } else {
      return { lat: 0, lon: 0 };
    }
  }

  getIconName(isFavorite: boolean, bikes: number, slots: number, capacity: number): string {
    let res = 'assets/marker';
    if (isFavorite) {
      res += '-favorite';
    }
    if (this.bikesPriority) {
      if (bikes > capacity / 2) {
        res += '-green';
      } else if (bikes > capacity / 6) {
        res += '-orange';
      } else {
        res += '-red';
      }
    } else {
      if (slots > capacity / 2) {
        res += '-green';
      } else if (slots > capacity / 6) {
        res += '-orange';
      } else {
        res += '-red';
      }
    }
    res += '.png';
    return res;
  }

  toggleBikePriority() {
    this.bikesPriority = !this.bikesPriority;
    this.setMarkers(this.informations);
  }

  getCurrentPosition() {
    this.geolocation.getCurrentPosition().then((resp: any) => {
      this.locationPoint = new Point([resp.coords.longitude, resp.coords.latitude]);
      const pointFeature = new Feature(this.locationPoint);
      const layer = new VectorLayer({
        className: 'geolocation',
        source: new VectorSource({features: [pointFeature]}),
      });
      this.map.addLayer(layer);
      this.view.animate({ zoom: 17 }, { center: [resp.coords.longitude, resp.coords.latitude] });
      const watch = this.geolocation.watchPosition();
      watch.subscribe({
        next: (data: any) => {
          pointFeature.setGeometry(new Point([data.coords.longitude, data.coords.latitude]));
        }, error: (error) => {
          console.log('Error getting location', error);
        }});
    }, async (error) => {
      console.log('Error getting location', error);
      const toast = await this.toastController.create({
        message: 'Please enable your GPS',
        duration: 2000
      });
      toast.present();
    });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Bikes } from 'src/app/interface/bikes.interface';
import { Station, Stations } from 'src/app/interface/stations.interface';
import { BikesService } from 'src/app/service/bikes.service';
import { StorageService } from 'src/app/service/storage.service';
import { Chart, registerables } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';
Chart.register(...registerables);

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit {

  bars = null;

  public stations = [];
  loaded = false;

  constructor(
    private bikesService: BikesService,
    private storage: StorageService,
    private navCtrl: NavController,
    private translate: TranslateService) { }

  ngOnInit() {
    this.storage.isReady().then(() => {
      this.bikesService.updateBikes().then((allBikes: Bikes) => {
        this.bikesService.updateStations().then((stations: Stations) => {
          this.storage.get('favoriteStations').then(favoriteStations => {
            if (favoriteStations === null) {
              this.storage.set('favoriteStations', []);
              favoriteStations = [];
            }
            this.stations = [];
            stations.data.stations.forEach((station: Station) => {
              const stationBikes = allBikes.data.stations.find(
                (bike: any) => bike.station_id === station.station_id
              );
              // Get all favorite + check if favorite
              const isFavorite = favoriteStations.indexOf(station.station_id) !== -1 ? 1 : 0;
              if (isFavorite) {
                this.stations.push({
                  name: station.name,
                  bikes: stationBikes.num_bikes_available,
                  slots: stationBikes.num_docks_available,
                  capacity: station.capacity,
                  id: station.station_id,
                  coords: { lat: station.lat, lon: station.lon },
                  favorite: isFavorite,
                  dataShowing: false,
                  dataLoaded: true
                });
              }
            });
            this.loaded = true;
          });
        });
      });
    });
  }

  getColor(nb: number, total: number) {
    if (nb > total / 2) {
      return 'success';
    } else if (nb > total / 6) {
      return 'warning';
    } else {
      return 'danger';
    }
  }

  toggleFavorite(id: number) {
    this.storage.get('favoriteStations').then(favoriteStations => {
      let selectedStation = null;
      this.stations.forEach((station: any) => {
        if (station.id === id) {
          const isFavorite = favoriteStations.indexOf(id) !== -1;
          if (isFavorite) {
            favoriteStations.splice(favoriteStations.indexOf(id), 1);
          } else {
            favoriteStations.push(id);
          }
          station.favorite = station.favorite === 0 ? 1 : 0;
          selectedStation = station;
        }
      });
      this.stations.splice(this.stations.indexOf(selectedStation), 1);
      this.storage.set('favoriteStations', favoriteStations);
    });
  }

  getStationName(stationName: string) {
    // lowercase and remove spaces and remove accents
    return 'station_' + stationName.toLowerCase().replace(/ /g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  redirectToStation(coords: { lat: number; lon: number }) {
    const navigationExtras: NavigationExtras = {
      state: {
        coords: JSON.stringify([coords.lon, coords.lat]),
      }
    };
    this.navCtrl.navigateRoot(['folder/Map'], navigationExtras);
  }

  toggleData(id: number, stationName: string) {
    // Reset all dataShowing
    this.bars?.destroy();
    this.stations.forEach((station: any) => {
      if (station.id === id) {
        station.dataShowing = !station.dataShowing;
        if (station.dataShowing) {
          station.dataLoaded = false;
          this.bikesService.getCollectDataFromStationName(stationName)
            .then((stationCollectData: any) => {
              const barChart = document.getElementById('barChart' + id) as HTMLCanvasElement | null;
              const ctx = barChart?.getContext('2d');
              let labels = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
              const bikesData = [];
              const slotsData = [];
              for (let i = 0; i < labels.length; i++) {
                bikesData.push(stationCollectData[labels[i]].bikes);
                slotsData.push(stationCollectData[labels[i]].slots);
                labels[i] += 'h';
              }
              this.bars = new Chart(ctx, {
                type: 'line',
                data: {
                  labels,
                  datasets: [
                    {
                      label: this.translate.instant('Number of bikes'),
                      data: bikesData,
                      backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
                      borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
                      borderWidth: 0.2
                    }, {
                      label: this.translate.instant('Number of slots'),
                      data: slotsData,
                      backgroundColor: 'rgb(255, 0, 0)', // array should have same number of elements as number of dataset
                      borderColor: 'rgb(255, 0, 0)',// array should have same number of elements as number of dataset
                      borderWidth: 0.2
                    }
                  ]
                },
                options: {
                  scales: {}
                }
              });
              station.dataLoaded = true;
            });
        } else {
          this.bars.destroy();
        }
      } else {
        station.dataShowing = false;
      }
    });
  }

}

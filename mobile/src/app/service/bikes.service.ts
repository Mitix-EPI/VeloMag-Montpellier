import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from './storage.service';
import { Bikes } from '../interface/bikes.interface';
import { Stations } from '../interface/stations.interface';
import * as informations from 'src/api-test/station_information.json';
import * as status from 'src/api-test/station_status.json';
import { Http, HttpResponse } from '@capacitor-community/http';
import { isPlatform } from '@ionic/angular';
import { CollectData } from '../interface/collectdata.interface';

@Injectable({
  providedIn: 'root',
})
export class BikesService {
  public bikes: Bikes = null;
  public stations: Stations = null;
  public collectData: CollectData = null;

  private apiUrl = 'https://api.velomag-mtp.com';
  private informationsBikesUrl =
    'https://montpellier-fr-smoove.klervi.net/gbfs/en/station_status.json';
  private informationsStationUrl =
    'https://montpellier-fr-smoove.klervi.net/gbfs/en/station_information.json';

  constructor(
    private storage: StorageService,
    private httpClient: HttpClient
  ) { }

  public getBikes(): Bikes {
    return this.bikes;
  }

  public getStations(): Stations {
    return this.stations;
  }

  async updateBikes() {
    return new Promise((resolve, reject) => {
      if (isPlatform('capacitor')) {
        const options = {
          url: this.informationsBikesUrl,
        };
        Http.get(options).then((response: HttpResponse) => {
          this.bikes = response.data;
          resolve(this.bikes);
        });
      } else {
        this.bikes = status;
        resolve(status);
      }
    });
  }

  async updateStations() {
    return new Promise((resolve, reject) => {
      if (isPlatform('capacitor')) {
        const options = {
          url: this.informationsStationUrl,
        };
        Http.get(options).then((response: HttpResponse) => {
          this.stations = response.data;
          resolve(this.stations);
        });
      } else {
        this.stations = informations;
        resolve(this.stations);
      }
    });
  }

  async getFavoriteStations() {
    return this.storage.get('favoriteStations');
  }

  async setFavoriteStations(favoriteStations: any) {
    this.storage.set('favoriteStations', favoriteStations);
  }

  async getStationsJSON(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .get('assets/station_information.json')
        .subscribe((datas: any) => {
          this.storage.isReady().then(() => {
            this.getFavoriteStations().then((favoriteStations: any) => {
              if (favoriteStations) {
                datas.data.stations.forEach((station: any) => {
                  if (favoriteStations.includes(station.station_id)) {
                    // Set station favorite
                    station.favorite = true;
                  } else {
                    station.favorite = false;
                  }
                });
              }
              resolve(datas);
            });
          });
        });
    });
  }

  async sendReport(body) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
      this.httpClient
        .post(this.apiUrl + '/add_broken_bike', body, { headers })
        .subscribe((datas: any) => {
          if (datas.code === 200) {
            resolve(datas);
          } else {
            reject(datas);
          }
        }, (error) => {
          reject(error);
        });
    });
  }

  async getCollectData() {
    return new Promise((resolve, reject) => {
      this.httpClient
        .get(this.apiUrl + '/collect_data')
        .subscribe((datas: any) => {
          if (datas.code === 200) {
            this.collectData = datas.data;
            resolve(this.collectData);
          } else {
            reject(datas);
          }
        }
          , (error) => {
            reject(error);
          });
    });
  }

  async getCollectDataFromStationName(stationName: string) {
    return new Promise((resolve, reject) => {
      if (this.collectData) {
        const stationData = this.collectData[stationName];
        if (stationData) {
          resolve(stationData);
        } else {
          reject(stationData);
        }
      } else {
        this.getCollectData().then((collectData: any) => {
          const stationData = this.collectData[stationName];
          if (stationData) {
            resolve(stationData);
          } else {
            reject(stationData);
          }
        }, (error) => {
          reject(error);
        });
      }
    });
  }
}

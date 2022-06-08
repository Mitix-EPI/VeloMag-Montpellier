import { Component, Input, OnInit } from '@angular/core';
import { BikesService } from 'src/app/service/bikes.service';
import { ActionSheetController } from '@ionic/angular';
import { isPlatform } from '@ionic/angular';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  @Input() stationId = 0;
  @Input() stationName = 'Unknown';
  @Input() coords = { lat: 0, lon: 0 };

  isLoaded = false;
  stationBikes = 0;
  stationSlots = 0;
  stationCapacity = 0;

  constructor(
    private bikesService: BikesService,
    public actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    this.initialize();
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

  initialize() {
    this.bikesService.getBikes().data.stations.forEach((station: any) => {
      if (station.station_id === this.stationId) {
        this.stationBikes = station.num_bikes_available;
        this.stationSlots = station.num_docks_available;
        this.stationCapacity = this.stationBikes + this.stationSlots;
        this.isLoaded = true;
      }
    });
  }

  getStationName(stationName: string) {
    // lowercase and remove spaces and remove accents
    return (
      'station_' +
      stationName
        .toLowerCase()
        .replace(/ /g, '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    );
  }

  async presentActionSheet() {
    const toLat = this.coords.lat.toString();
    const toLong = this.coords.lon.toString();

    const destination = toLat + ',' + toLong;
    const travelMode = '&travelmode=bicycling';

    const actionLinks = [];
    if (isPlatform('ios')) {
      actionLinks.push({
        text: 'Map',
        icon: 'map-outline',
        handler: () => {
          window.open(
            'maps://?q=' + destination,
          );
        },
      });
    }
    actionLinks.push({
      text: 'Google Maps',
      icon: 'map-outline',
      handler: () => {
        window.open(
          'https://www.google.com/maps/dir/?api=1&destination=' + destination + travelMode,
        );
      },
    });
    actionLinks.push({
      text: 'Waze',
      icon: 'navigate-outline',
      handler: () => {
        window.open(
          'https://waze.com/ul?ll=' + destination + '&navigate=yes&z=10'
        );
      },
    });
    actionLinks.push({
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {},
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'Navigate',
      buttons: actionLinks,
    });
    await actionSheet.present();
  }
}

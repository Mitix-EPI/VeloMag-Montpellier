import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { BikesService } from './service/bikes.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Favorites', url: '/folder/Favorites', icon: 'star' },
    { title: 'Map', url: '/folder/Map', icon: 'map' },
    { title: 'List of all bikes', url: '/folder/All Bikes', icon: 'bicycle' },
    {
      title: 'Report bikes problem',
      url: '/folder/Bike Report',
      icon: 'alert-circle',
    },
    { title: 'Contact', url: '/folder/Contact', icon: 'mail' },
  ];
  currentRoute: string;

  constructor(
    private router: Router,
    private platform: Platform,
    public translate: TranslateService,
    private bikeService: BikesService,
    public toastController: ToastController
  ) {
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentRoute = event.url;
        } else {
          console.error('Unknown event type: ' + event);
        }
      });
    this.checkUpdate();
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('fr');
  }

  getMaxEdgeStart(): number {
    if (this.currentRoute === '/folder/Map') {
      return 0;
    } else {
      return 10000;
    }
  }

  async checkUpdate() {
    /*if (this.platform.is('cordova')) {
      this.bikeService.getVersion().then(async (remoteVersion) => {
        const remoteUrl = 'https://github.com/Mitix-EPI/VeloMag-Montpellier/releases/latest/download/';
        const apkUrl = remoteUrl + 'VeloMag.apk';
        const installedVersion = (await ApkUpdater.getInstalledVersion()).version.code;
        if (remoteVersion > installedVersion) {
          const toast = await this.toastController.create({
            message: 'A new version of VeloMag is available. Update in progress...',
            duration: 5000,
          });
          toast.present();
          await ApkUpdater.download(apkUrl);
          await ApkUpdater.install();
        }
      }, (error) => {
        console.error(error);
      });
    } else {
      alert('You are not on a mobile device');
    }*/
  }
}

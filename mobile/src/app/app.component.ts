import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AppUpdate } from '@ionic-native/app-update/ngx';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

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
    private appUpdate: AppUpdate,
    private platform: Platform,
    public translate: TranslateService
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

  checkUpdate() {
    this.platform.ready().then(() => {
      const updateUrl = 'https://github.com/Mitix-EPI/VeloMag-Montpellier/releases/latest/download/update.xml';
      this.appUpdate
        .checkAppUpdate(updateUrl)
        .then((update) => {})
        .catch((error) => {
          alert('Error: ' + error.msg);
        });
    });
  }
}

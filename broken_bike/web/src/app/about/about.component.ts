import { Component } from '@angular/core';
import { VelomagService } from '../services/velomag.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  constructor() { }

  downloadPlayStore() {
    window.open('https://play.google.com/store/apps/details?id=io.ionic.velomag', '_blank');
  }

  downloadAppStore() {
    window.open('https://apps.apple.com/us/app/velomag/id1628297884', '_blank');
  }

}

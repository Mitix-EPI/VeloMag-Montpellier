import { Component } from '@angular/core';
import { VelomagService } from '../services/velomag.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  constructor() { }

  downloadApp() {
    window.open('https://github.com/Mitix-EPI/VeloMag-Montpellier/releases/latest/download/VeloMag.apk', '_blank');
  }

}

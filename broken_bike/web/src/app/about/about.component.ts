import { Component } from '@angular/core';
import { VelomagService } from '../services/velomag.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  isAdmin = false;

  constructor(private bikesService: VelomagService) {
    this.isAdmin = this.bikesService.isAdmin
  }

}

import { Component } from '@angular/core';
import { VelomagService } from '../services/velomag.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  isAdmin = false;

  constructor(private bikesService: VelomagService) {
    this.isAdmin = this.bikesService.isAdmin
  }

}

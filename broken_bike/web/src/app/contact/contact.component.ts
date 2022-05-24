import { Component } from '@angular/core';
import { VelomagService } from '../services/velomag.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {

  isAdmin = false;

  constructor(private bikesService: VelomagService) {
    this.isAdmin = this.bikesService.isAdmin
  }

}

import { Component, Input } from '@angular/core';
import { Bike } from 'src/app/interfaces/bikes.interfaces';
import { DatePipe } from '@angular/common';
import { VelomagService } from 'src/app/services/velomag.service';

@Component({
  selector: 'app-list-bikes',
  templateUrl: './list-bikes.component.html',
  styleUrls: ['./list-bikes.component.scss']
})
export class ListBikesComponent {

  @Input() isAdmin = false;

  title = 'report-bike';
  search = '';
  isAllChecked = false;
  isLoading = false;
  isError = false;
  errorMsg = '';

  bikes: Bike[] = [];

  constructor(public datePipe: DatePipe, private bikesService: VelomagService) {
    this.isLoading = true;
    this.bikesService.getBikes()
      .then((bikes: any) => {
        this.bikes = bikes['data'];
        this.isLoading = false;
        this.isError = false;
      })
      .catch(error => {
        console.error(error);
        this.isError = true;
        this.isLoading = false;
        this.errorMsg = error['message'] || 'Internal error';
      });
  }

  checkAll() {
    this.bikes.forEach(bike => bike.checked = this.isAllChecked);
  }

  deleteBike(bike: any) {
    this.bikesService.removeBike(bike.id)
  }
}

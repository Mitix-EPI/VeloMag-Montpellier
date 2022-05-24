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

  bikes: Bike[] = [
    {
      id: 1,
      id_bike: 1,
      priority: 'Low',
      reason: 'Brake problem',
      date: new Date(),
      description: 'Brake is not working',
      checked: false
    },
    {
      id: 2,
      id_bike: 2,
      priority: 'Important',
      reason: 'Gear problem',
      date: new Date('2020-01-01'),
      description: 'Gear is not working',
      checked: false
    },
    {
      id: 3,
      id_bike: 3,
      priority: 'Urgent',
      reason: 'Seat problem',
      date: new Date('2021-01-01'),
      description: 'Seat is not working',
      checked: false
    },
    {
      id: 4,
      id_bike: 4,
      priority: 'Low',
      reason: 'Touch panel not working',
      date: new Date('2022-01-01'),
      description: 'Touch panel is not working',
      checked: false
    },
    {
      id: 5,
      id_bike: 5,
      priority: 'Low',
      reason: 'Other',
      date: new Date('2023-01-01'),
      description: 'Blop Blop',
      checked: false
    },
    {
      id: 6,
      id_bike: 6,
      priority: 'Low',
      reason: 'Other',
      date: new Date('2024-01-01'),
      description: 'Blop Blop',
      checked: false
    },
    {
      id: 7,
      id_bike: 7,
      priority: 'Important',
      reason: 'Other',
      date: new Date('2025-01-01'),
      description: 'Blop Blop',
      checked: false
    },
    {
      id: 8,
      id_bike: 8,
      priority: 'Urgent',
      reason: 'Other',
      date: new Date('2026-01-01'),
      description: 'Blop Blop',
      checked: false
    },
    {
      id: 9,
      id_bike: 9,
      priority: 'Low',
      reason: 'Other',
      date: new Date('2027-01-01'),
      description: 'Blop Blop',
      checked: false
    },
    {
      id: 10,
      id_bike: 10,
      priority: 'Urgent',
      reason: 'Seat problem',
      date: new Date('2028-01-01'),
      description: 'Seat is not working',
      checked: false
    },
    {
      id: 11,
      id_bike: 11,
      priority: 'Urgent',
      reason: 'Seat problem',
      date: new Date('2029-01-01'),
      description: 'Seat is not working',
      checked: false
    },
    {
      id: 12,
      id_bike: 12,
      priority: 'Urgent',
      reason: 'Seat problem',
      date: new Date('2030-01-01'),
      description: 'Seat is not working',
      checked: false
    },
    {
      id: 13,
      id_bike: 13,
      priority: 'Important',
      reason: 'Gear problem',
      date: new Date('2031-01-01'),
      description: 'Gear is not working',
      checked: false
    },
    {
      id: 14,
      id_bike: 14,
      priority: 'Urgent',
      reason: 'Seat problem',
      date: new Date('2032-01-01'),
      description: 'Seat is not working',
      checked: false
    },
    {
      id: 15,
      id_bike: 15,
      priority: 'Low',
      reason: 'Touch panel not working',
      date: new Date('2033-01-01'),
      description: 'Touch panel is not working',
      checked: false
    },
  ];

  constructor(public datePipe: DatePipe, private bikesService: VelomagService) {
    this.bikesService.getBikes()
    .then((bikes: any) => {
      this.bikes = bikes['data'];
    })
    .catch(error => console.log(error));
  }

  checkAll() {
    this.bikes.forEach(bike => bike.checked = this.isAllChecked);
  }

  deleteBike(bike: any) {
    this.bikesService.removeBike(bike.id)
  }
}

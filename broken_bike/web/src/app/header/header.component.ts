import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VelomagService } from '../services/velomag.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() isAdmin = false;
  currentPageRoot = 'home';
  collapser: any;

  constructor(private bikesService: VelomagService, private router: Router) {
    this.currentPageRoot = window.location.pathname.split('/')[1];
  }

  ngOnInit(): void {
  }

  handleConnection(isAdmin: boolean) {
    if (isAdmin) {
      this.bikesService.clearLogin();
      isAdmin = false;
      // Reload the page
      window.location.reload();
    } else {
      this.router.navigate(['/login']);
    }
  }

}

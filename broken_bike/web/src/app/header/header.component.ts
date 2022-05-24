import { Component, Input, OnInit } from '@angular/core';
import { VelomagService } from '../services/velomag.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() isAdmin = false;
  currentPageRoot = 'home';

  constructor(private bikesService: VelomagService) {
    this.currentPageRoot = window.location.pathname.split('/')[1];
  }

  ngOnInit(): void {
  }

  goToHome() {
    window.location.href='/';
  }

  handleConnection(isAdmin: boolean) {
    if (isAdmin) {
      this.bikesService.clearLogin();
      isAdmin = false;
      // Reload the page
      window.location.reload();
    } else {
      window.location.href='/login';
    }
  }

}

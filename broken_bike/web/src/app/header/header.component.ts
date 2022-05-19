import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() isAdmin = false;
  currentPageRoot = 'home';

  constructor() {
    this.currentPageRoot = window.location.pathname.split('/')[1];
  }

  ngOnInit(): void {
  }

  goToHome() {
    window.location.href='/';
  }

  openModel(isAdmin: boolean) {
    console.log('model');
  }

}

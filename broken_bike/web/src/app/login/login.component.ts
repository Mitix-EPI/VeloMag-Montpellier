import { Component, OnInit } from '@angular/core';
import { VelomagService } from '../services/velomag.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email = "";
  password = "";
  error = false;
  isLoading = false;

  constructor(private bikesService: VelomagService) { }

  ngOnInit(): void {
  }

  login() {
    console.log(this.email, this.password);
    if (this.email !== "" && this.password !== "") {
      this.isLoading = true;
      this.bikesService.login(this.email, this.password).subscribe(
        (data: any) => {
          this.isLoading = false;
          if (data.code === 200) {
            this.bikesService.saveLogin(this.email, this.password);
            this.error = false;
            window.location.href = '/home';
          } else {
            this.error = true;
          }
        },
        (error) => {
          console.log(error);
          this.error = true;
          this.isLoading = false;
        }
      );
    } else {
      this.error = true;
    }
  }

}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { BikesService } from 'src/app/service/bikes.service';

@Component({
  selector: 'app-reportbikes',
  templateUrl: './reportbikes.component.html',
  styleUrls: ['./reportbikes.component.scss'],
})
export class ReportbikesComponent {
  reportBikes: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    private bikeService: BikesService
  ) {
    this.reportBikes = this.formBuilder.group({
      bike_id: ['', Validators.required],
      priority: ['', Validators.required],
      reason: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  async submitForm() {
    console.log(this.reportBikes.value);
    this.bikeService.sendReport(this.reportBikes.value)
    .then(async () => {
      this.reportBikes.reset();
      const toast = await this.toastController.create({
        message: 'Your report has been sent. Thank you!',
        duration: 2000,
      });
      toast.present();
    }, async (error) => {
      console.log(error);
      const toast = await this.toastController.create({
        message: 'Error while sending your report. If the problem persists, please contact us. ' + error['message'] || '',
        duration: 5000,
      });
      toast.present();
    });
  }
}

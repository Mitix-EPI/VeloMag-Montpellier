import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { ToastController } from '@ionic/angular';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { isPlatform } from '@ionic/angular';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {

  copyInputText = 'juandev-pro@protonmail.com';
  githubLink = 'https://github.com/Mitix-EPI';
  linkedInLink = 'https://www.linkedin.com/in/juan-alexandre';
  instagramLink = 'https://www.linkedin.com/in/juan-alexandre';

  constructor(private clipboard: Clipboard, public toastController: ToastController,
    private appAvailability: AppAvailability, private inAppBrowser: InAppBrowser) { }

  ngOnInit() {}

  async copyString(){
    this.clipboard.copy(this.copyInputText);
    const toast = await this.toastController.create({
      color: 'dark',
      duration: 2000,
      message: 'Mail copied !',
    });
    toast.present();
  }

  goToGithubPage() {
    window.open(this.githubLink, '_system');
  }

  goToLinkedInPage() {
    window.open(this.linkedInLink, '_system');
  }

  async goToInstagram(): Promise<void> {

    const instagram = 'wheel_back_';
    let app: string;

    if (isPlatform('ios')) {
      app = 'instagram://';

    } else if (isPlatform('android')) {
      app = 'com.instagram.android';
    }

    this.appAvailability.check(app)
    .then((yes: boolean) => {
      this.inAppBrowser.create(`instagram://user?username=${instagram}`, '_system');
    }, (no: boolean) => {
      this.inAppBrowser.create(`https://www.instagram.com/${instagram}`, '_system');
    });
  }

}

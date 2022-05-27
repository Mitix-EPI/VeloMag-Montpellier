import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { FolderPageRoutingModule } from './folder-routing.module';

import { FolderPage } from './folder.page';
import { AllbikesComponent } from './allbikes/allbikes.component';
import { ContactComponent } from './contact/contact.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { MapComponent } from './map/map.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ReportbikesComponent } from './reportbikes/reportbikes.component';
import { InfoComponent } from './map/info/info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FolderPageRoutingModule,
    Ng2SearchPipeModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [
    FolderPage,
    AllbikesComponent,
    ContactComponent,
    FavoritesComponent,
    MapComponent,
    ReportbikesComponent,
    InfoComponent
  ],
})
export class FolderPageModule {}

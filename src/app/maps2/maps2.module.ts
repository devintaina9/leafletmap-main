import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Maps2PageRoutingModule } from './maps2-routing.module';

import { Maps2Page } from './maps2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Maps2PageRoutingModule
  ],
  declarations: [Maps2Page]
})
export class Maps2PageModule {}

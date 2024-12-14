import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Maps2Page } from './maps2.page';

const routes: Routes = [
  {
    path: '',
    component: Maps2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Maps2PageRoutingModule {}

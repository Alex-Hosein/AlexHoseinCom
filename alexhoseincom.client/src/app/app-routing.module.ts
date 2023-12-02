import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillEstimatorComponent } from './bill-estimator/bill-estimator.component';
import { MinerComponent } from './miner/miner.component';

const routes: Routes = [{ path: 'bill-estimator', component: BillEstimatorComponent },
{ path: 'miner', component: MinerComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

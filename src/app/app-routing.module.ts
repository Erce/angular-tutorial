import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoAddComponent } from './video-add/video-add.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'videos/add', component: VideoAddComponent },
  { path: 'videos/edit/:id', component: VideoAddComponent },
  // TODO: Video delete functionality will be implemented
  // { path: 'videos/delete/:id', component: VideoDeleteComponent },
  { path: 'videos', component: HomeComponent },
  { path: '**', redirectTo: 'videos'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

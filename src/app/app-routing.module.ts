import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoAddComponent } from './video-add/video-add.component';
import { VideoDeleteComponent } from './video-delete/video-delete.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'videos/add', component: VideoAddComponent },
  { path: 'videos/edit/:id', component: VideoAddComponent },
  { path: 'videos', component: HomeComponent },
  { path: '**', redirectTo: 'videos'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

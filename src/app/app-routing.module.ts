import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoAddEditComponent } from './video-add-edit/video-add-edit.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'videos/add', component: VideoAddEditComponent },
  { path: 'videos/edit/:id', component: VideoAddEditComponent },
  { path: 'videos', component: HomeComponent },
  { path: '**', redirectTo: 'videos'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

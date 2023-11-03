import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoTableComponent } from '../video-table/video-table.component';
import { DataService } from '../shared/data/data.service';
import { ProcessedVideo } from '../shared/data/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'mi-home',
  standalone: true,
  imports: [CommonModule, VideoTableComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  dataService = inject(DataService);
  videos: ProcessedVideo[] = [];
  subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.subscriptions.push(this.dataService.getVideos().subscribe((videos) => this.videos = videos));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}

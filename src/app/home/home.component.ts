import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideosTableComponent } from '../videos-table/videos-table.component';
import { DataService } from '../data.service';
import { Category, ProcessedVideo } from '../interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'mi-home',
  standalone: true,
  imports: [CommonModule, VideosTableComponent],
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

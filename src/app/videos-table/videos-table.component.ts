import { Component, Input } from '@angular/core';
import { ProcessedVideo } from '../interfaces';

@Component({
  selector: 'mi-videos-table',
  templateUrl: './videos-table.component.html',
  styleUrls: ['./videos-table.component.css'],
})
export class VideosTableComponent {
  @Input() videos: ProcessedVideo[] = [];
}

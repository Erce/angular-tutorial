import { Component } from '@angular/core';

import { ProcessedVideo } from './interfaces';

@Component({
  selector: 'mi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  videos: ProcessedVideo[] = [];
  constructor() {}
}

import { Component, Input, inject } from '@angular/core';
import { ProcessedVideo } from '../interfaces';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonType } from '../button/button-type';

@Component({
  selector: 'mi-videos-table',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './videos-table.component.html',
  styleUrls: ['./videos-table.component.css'],
})
export class VideosTableComponent {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  protected readonly buttonType = ButtonType;
  @Input() videos: ProcessedVideo[] = [];

  edit(id: number) {
    this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
  }

  delete(id: number) {
    this.router.navigate(['delete', id], { relativeTo: this.activatedRoute });
  }
}

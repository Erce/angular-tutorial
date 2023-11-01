import { Component, Input, inject } from '@angular/core';
import { ProcessedVideo } from '../shared/data/interfaces';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonType } from '../shared/types/button-type';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VideoDeleteComponent } from '../video-delete/video-delete.component';

@Component({
  selector: 'mi-videos-table',
  standalone: true,
  imports: [CommonModule, ButtonComponent, MatDialogModule],
  templateUrl: './videos-table.component.html',
  styleUrls: ['./videos-table.component.css'],
})
export class VideosTableComponent {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  dialog = inject(MatDialog);
  @Input() videos: ProcessedVideo[] = [];
  protected readonly buttonType = ButtonType;

  onEdit(video: ProcessedVideo) {
    this.router.navigate(['edit', video.id], { relativeTo: this.activatedRoute });
  }

  onDelete(video: ProcessedVideo) {
    this.openDeleteDialog(video);
  }

  openDeleteDialog(video: ProcessedVideo) {
    const dialogRef = this.dialog.open(VideoDeleteComponent, {
      data: {name: video.name},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.videos.splice(video.id, 1);
    });
  }
}

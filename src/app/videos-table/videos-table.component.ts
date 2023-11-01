import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  inject 
} from '@angular/core';
import { ProcessedVideo } from '../shared/data/interfaces';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonType } from '../shared/types/button-type';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VideoDeleteComponent } from '../video-delete/video-delete.component';
import { DataService } from '../shared/data/data.service';

@Component({
  selector: 'mi-videos-table',
  standalone: true,
  imports: [CommonModule, ButtonComponent, MatDialogModule],
  templateUrl: './videos-table.component.html',
  styleUrls: ['./videos-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideosTableComponent {
  changeDetRef = inject(ChangeDetectorRef);
  activatedRoute = inject(ActivatedRoute);
  dataService = inject(DataService);
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
      data: video,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.dataService.deleteVideo(video.authorId, video.id).subscribe(
        (result) => { 
          if(result) {
            const index = this.videos.findIndex((videoEl) => videoEl.id === video.id);
            this.videos.splice(index, 1);
            this.changeDetRef.detectChanges();
          }
        }
      );
    });
  }
}

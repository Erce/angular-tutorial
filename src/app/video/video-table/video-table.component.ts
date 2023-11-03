import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  inject 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

import {
  ButtonType,
  ButtonComponent,
  DataService,
  ProcessedVideo,
  SearchPipe
} from '@mi/shared';
import { VideoDeleteComponent } from '../video-delete/video-delete.component';

@Component({
  selector: 'mi-videos-table',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    MatDialogModule,
    FormsModule,
    SearchPipe
  ],
  templateUrl: './video-table.component.html',
  styleUrls: ['./video-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoTableComponent {
  changeDetRef = inject(ChangeDetectorRef);
  activatedRoute = inject(ActivatedRoute);
  dataService = inject(DataService);
  router = inject(Router);
  dialog = inject(MatDialog);
  @Input() videos: ProcessedVideo[] = [];
  protected readonly buttonType = ButtonType;
  searchArg = '';

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

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.dataService.deleteVideo(video.authorId, video.id).subscribe(
          (result) => { 
            if(result) {
              this.videos = this.videos.filter((item) => item.id !== video.id);
              this.changeDetRef.detectChanges();
            }
          }
        );
      }
    });
  }
}

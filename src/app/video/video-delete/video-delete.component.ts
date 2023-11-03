import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import {
  ButtonComponent,
  ButtonType,
  ProcessedVideo
} from '@mi/shared';

@Component({
  selector: 'mi-video-delete',
  templateUrl: './video-delete.component.html',
  styleUrls: ['./video-delete.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ButtonComponent
  ],
})
export class VideoDeleteComponent {
  dialogRef = inject(MatDialogRef<VideoDeleteComponent>);
  data: ProcessedVideo = inject(MAT_DIALOG_DATA);
  buttonType = ButtonType;
}

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProcessedVideo } from '../shared/data/interfaces';
import { ButtonType } from '../shared/types/button-type';
import { ButtonComponent } from '../button/button.component';

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

  onNoClick(): void {
    this.dialogRef.close();
  }
}

import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'mi-video-delete',
  templateUrl: './video-delete.component.html',
  styleUrls: ['./video-delete.component.css'],
  standalone: true,
  imports: [CommonModule, MatDialogModule],
})
export class VideoDeleteComponent {
  dialogRef = inject(MatDialogRef<VideoDeleteComponent>);
  @Inject(MAT_DIALOG_DATA) data: any;

  onNoClick(): void {
    this.dialogRef.close();
  }
}

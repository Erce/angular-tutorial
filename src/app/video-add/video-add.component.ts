import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { DataService } from '../shared/data/data.service';
import { Subject, takeUntil } from 'rxjs';
import { Author, Category } from '../shared/data/interfaces';
import { VideoForm } from '../shared/video-add/video-add-interfaces';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ButtonComponent } from '../button/button.component';
import { ButtonType } from '../shared/types/button-type';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'mi-video-add',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ButtonComponent,
    ReactiveFormsModule
  ],
  templateUrl: './video-add.component.html',
  styleUrls: ['./video-add.component.css']
})
export class VideoAddComponent implements OnInit, OnDestroy {
  dataService = inject(DataService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  protected readonly buttonType = ButtonType;
  categories: Category[] = [];
  authors: Author[] = [];
  title: 'Add Video' | 'Edit Video' = 'Add Video';
  videoFormGroup = new FormGroup<VideoForm>({
    name: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    author: new FormControl<Author>(this.authors[0], {nonNullable: true, validators: [Validators.required]}),
    categories: new FormControl([], {nonNullable: true, validators: [Validators.required]})
  });

  ngOnInit() {
    this.dataService.getCategories().pipe(takeUntil(this.destroy$)).subscribe((categories) => this.categories = categories);
    this.dataService.authors$.pipe(takeUntil(this.destroy$)).subscribe((authors) => {
      this.authors = authors;
    });
  }

  onSubmit() {
    this.dataService.addVideoToSelectedAuthor(this.videoFormGroup.controls)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
    this.onCancel();
  }

  onCancel() {
    this.router.navigate([''], { relativeTo: this.activatedRoute });
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.unsubscribe();
  }
}

import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { DataService } from '../shared/data/data.service';
import { Subject, combineLatest, map, takeUntil } from 'rxjs';
import { Author, Category } from '../shared/data/interfaces';
import { VideoForm } from '../shared/video-add-edit/video-add-edit-interfaces';
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
    ReactiveFormsModule,
  ],
  templateUrl: './video-add-edit.component.html',
  styleUrls: ['./video-add-edit.component.css']
})
export class VideoAddEditComponent implements OnInit, OnDestroy {
  dataService = inject(DataService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  protected readonly buttonType = ButtonType;
  isAdd = true;
  categories: Category[] = [];
  authors: Author[] = [];
  videoId?: number;
  videoFormGroup!: FormGroup<VideoForm>;
  
  constructor() {
    this.createVideoForm();
  }

  ngOnInit() {
    this.videoId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if (this.videoId) this.isAdd = false;
    combineLatest([this.dataService.getCategories(), this.dataService.authors$]).pipe(
      takeUntil(this.destroy$),
      map(([categories, authors]) => {
        this.categories = categories;
        this.authors = authors;
        this.buildVideoForm();
    })).subscribe();
  }

  buildVideoForm() {
    if (this.videoId) {
      const video = this.dataService.getProcessedVideoById(this.videoId);
      const author = this.authors.find((author) => author.id === video?.authorId);
      const categories = video?.categories.map(selectedCategory => this.categories.find((category) => category.name === selectedCategory)!.id);
      this.createVideoForm(video?.name, author, categories);
    } else {
      this.createVideoForm();
    }
  }

  createVideoForm(name?: string, author?: Author, categories?: number[]) {
    this.videoFormGroup = new FormGroup<VideoForm>({
      name: new FormControl<string>( name ?? '', {nonNullable: true, validators: [Validators.required]}),
      author: new FormControl<Author>(author ?? this.authors[0], {nonNullable: true, validators: [Validators.required]}),
      categories: new FormControl(categories ?? [], {nonNullable: true, validators: [Validators.required]})
    });
  }

  onSubmit() {
    if (this.videoId) {
      this.dataService.editSelectedVideo(this.videoFormGroup.controls, this.videoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.redirectToHome());
    } else {
      this.dataService.addVideoToSelectedAuthor(this.videoFormGroup.controls)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.redirectToHome());
    }
  }

  onCancel() {
    this.redirectToHome();
  }

  private redirectToHome() {
    this.router.navigate([''], { relativeTo: this.activatedRoute });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
}
}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { VideoAddEditComponent } from './video-add-edit.component';
import { DataService } from '../shared/data/data.service';
import { of } from 'rxjs';
import { Author, Category } from '../shared/data/interfaces';

describe('VideoAddEditComponent', () => {
  let component: VideoAddEditComponent;
  let fixture: ComponentFixture<VideoAddEditComponent>;
  let dataService: jasmine.SpyObj<DataService>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let router: Router;

  beforeEach(() => {
    const dataServiceSpy = jasmine.createSpyObj('DataService', 
    ['getCategories', 'getAuthors', 'getVideos', 'getProcessedVideoById', 'editSelectedVideo', 'addVideoToSelectedAuthor']);
    const activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: () => '1',
        },
      },
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: DataService, useValue: dataServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    });

    dataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    activatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(VideoAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize videoId correctly and call editSelectedVideo', () => {
    dataService.editSelectedVideo.and.returnValue(of({id: 1, name: 'Test', videos: []}));
    component.onSubmit();

    expect(component.videoId).toBe(1);
    expect(component.isAdd).toBeFalsy();
    expect(dataService.editSelectedVideo).toHaveBeenCalled();
  });

  it('should call addVideoToSelectedAuthor if videoId is not set', () => {
    component.videoId = undefined;
    dataService.addVideoToSelectedAuthor.and.returnValue(of({id: 1, name: 'Test', videos: []}));
    component.onSubmit();
  
    expect(dataService.addVideoToSelectedAuthor).toHaveBeenCalled();
  });

  it('should cancel and navigate back', () => {
    dataService.getCategories.and.returnValue(of([] as Category[]));
    dataService.getAuthors.and.returnValue(of([] as Author[]));
    const navigateSpy = spyOn(router, 'navigate');

    component.onCancel();
    expect(navigateSpy).toHaveBeenCalledWith([''], { relativeTo: activatedRoute });
  });

  it('should load categories and authors on initialization', () => {
    const categories = [{ id: 1, name: 'Category 1' }];
    const authors = [{ id: 1, name: 'Author 1', videos: [] }];
    dataService.getCategories.and.returnValue(of(categories));
    dataService.getAuthors.and.returnValue(of(authors));

    component.authors = authors;
    component.categories = categories;

    expect(component.categories).toEqual(categories);
    expect(component.authors).toEqual(authors);
  });

  it('should build the video form when videoId is not set', () => {
    component.videoId = undefined;
    const video = {
      id: 1,
      name: 'Video 1',
      author: 'Author 1',
      authorId: 1,
      categories: ['Category 1'],
      releaseDate: '2023-10-01',
      highestQuality: { format_name: 'one', res: '1080p', size: 1000 }
    };
    const author = { id: 1, name: 'Author 1', videos: [] };
    const categoriesResponse = [{ id: 1, name: 'Category 1' }, { id: 2, name: 'Category 2' }];
    dataService.getProcessedVideoById.and.returnValue(video);
    dataService.getVideos.and.returnValue(of([video]));
    dataService.getCategories.and.returnValue(of([{ id: 1, name: 'Category 1' }, { id: 2, name: 'Category 2' }]));

    component.authors = [author];
    component.categories = categoriesResponse;
    component.buildVideoForm();

    expect(component.videoFormGroup.value.name).toBe('');
    expect(component.videoFormGroup.value.author).toBe(author);
    expect(component.videoFormGroup.value.categories).toEqual([]);
  });

  it('should build the video form when videoId is set', () => {
    const video = {
      id: 1,
      name: 'Video 1',
      author: 'Author 1',
      authorId: 1,
      categories: ['Category 1'],
      releaseDate: '2023-10-01',
      highestQuality: { format_name: 'one', res: '1080p', size: 1000 }
    };
    const author = { id: 1, name: 'Author 1', videos: [] };
    const categoriesResponse = [{ id: 1, name: 'Category 1' }, { id: 2, name: 'Category 2' }];
    dataService.getProcessedVideoById.and.returnValue(video);
    dataService.getVideos.and.returnValue(of([video]));
    dataService.getCategories.and.returnValue(of([{ id: 1, name: 'Category 1' }, { id: 2, name: 'Category 2' }]));

    component.authors = [author];
    component.categories = categoriesResponse;
    component.buildVideoForm();

    expect(component.videoFormGroup.value.name).toBe('Video 1');
    expect(component.videoFormGroup.value.author).toBe(author);
    expect(component.videoFormGroup.value.categories).toEqual([1]);
  });
});

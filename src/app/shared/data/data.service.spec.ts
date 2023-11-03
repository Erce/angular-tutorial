import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { DataService } from './data.service';
import { API } from 'src/app/constants';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { VideoForm } from '../video-add-edit/video-add-edit-interfaces';


describe('DataService', () => {
  let httpTestingController: HttpTestingController;
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, 
        ReactiveFormsModule,
      ],
      providers: [DataService],
    });

    service = TestBed.inject(DataService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get categories', () => {
    const categoriesResponse = [
      { id: 1, name: 'Thriller' },
      { id: 2, name: 'Crime' },
    ];

    service.getCategories().subscribe((categories) => {
      expect(categories).toEqual(categoriesResponse);
    });

    const req = httpTestingController.expectOne(request => request.method === 'GET' && request.url === `${API}/categories`);
    req.flush(categoriesResponse);
  });

  it('should get authors', () => {
    const authorsResponse = [
      {
        id: 1,
        name: 'David Munch',
        videos: [
          { id: 7, catIds: [2], name: 'test', formats: { one: { res: '1080p', size: 1000 } }, releaseDate: '2023-11-02' },
        ],
      },
    ];

    service.getAuthors().subscribe((authors) => {
      expect(authors).toEqual(authorsResponse);
      expect(service.maxId.getValue()).toBe(7);
    });

    const req = httpTestingController.expectOne(request => request.method === 'GET' && request.url === `${API}/authors`);
    req.flush(authorsResponse);
  });

  it('should delete a video', () => {
    const authorId = 1;
    const videoId = 7;
    const mockResponse = {id: 1, name: 'Author 1', videos: []};

    service.deleteVideo(authorId, videoId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(request => request.method === 'PATCH' && request.url === `${API}/authors/${authorId}`);
    req.flush(mockResponse);
  });

  it('should add a video to a selected author', () => {
    const video = {
      id: 1,
      catIds: [1, 2],
      name: 'Video 1',
      releaseDate: '2018-08-20',
      formats: { one: { res: '1080p', size: 1000 } },
    }

    const mockResponse = {
      id: 1,
      name: "David Munch",
      videos: [
        {
          id: 1,
          catIds: [1, 2],
          name: 'Video 1',
          releaseDate: '2018-08-20',
          formats: { one: { res: '1080p', size: 1000 } },
        }
      ]
    };

    const videoFormGroup = new FormGroup<VideoForm>({
      name: new FormControl('New Video', {nonNullable: true,}),
      author: new FormControl({ id: 1, name: 'Author 1', videos: [video] }, {nonNullable: true,}),
      categories: new FormControl([1, 2], {nonNullable: true,})
    });

    service.addVideoToSelectedAuthor(videoFormGroup.controls).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${API}/authors/${videoFormGroup.value.author?.id}`);
    expect(req.request.method).toEqual('PATCH');
    expect(req.request.body).toEqual({ ...videoFormGroup.value.author, videos: videoFormGroup.value.author?.videos });
    req.flush(mockResponse);

    httpTestingController.verify();
  });

  it('should return the highest quality format', () => {
    const formats = {
      format1: { res: '480p', size: 500 },
      format2: { res: '720p', size: 800 },
      format3: { res: '1080p', size: 1000 },
    };

    const highestQuality = service.getTheHighestQuality(formats);

    const expectedHighestQuality = {
      id: 2,
      format_name: 'format3',
      res: '1080p',
      size: 1000,
    };

    expect(highestQuality).toEqual(expectedHighestQuality);
  });
});

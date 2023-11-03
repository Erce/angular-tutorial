import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { VideoTableComponent } from '../video-table/video-table.component';
import { DataService } from '../shared/data/data.service';
import { ProcessedVideo } from '../shared/data/interfaces';
import { ActivatedRoute } from '@angular/router';
import { Subscription, of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let dataService: jasmine.SpyObj<DataService>;

  beforeEach(() => {
    const dataServiceSpy = jasmine.createSpyObj('DataService', ['getVideos']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { paramMap: { get: () => null } },
    });

    TestBed.configureTestingModule({
      imports: [VideoTableComponent],
      providers: [
        { provide: DataService, useValue: dataServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    });

    dataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch videos from DataService and assign them to the component', () => {
    const videos: ProcessedVideo[] = [
      {
        id: 1,
        name: 'Video 1',
        author: 'Author 1',
        authorId: 1,
        categories: ['Category 1', 'Category 2'],
        highestQuality: { format_name: 'one', res: '1080p', size: 1000 },
      },
      {
        id: 2,
        name: 'Video 2',
        author: 'Author 2',
        authorId: 1,
        categories: ['Category 2', 'Category 3'],
        highestQuality: { format_name: 'one', res: '1080p', size: 1000 },
      },
    ];

    dataService.getVideos.and.returnValue(of(videos));

    component.ngOnInit();

    expect(dataService.getVideos).toHaveBeenCalled();
    expect(component.videos).toEqual(videos);
  });

  it('should unsubscribe from subscriptions on ngOnDestroy', () => {
    component.subscriptions = [new Subscription(), new Subscription()];
    spyOn(component.subscriptions[0], 'unsubscribe');
    spyOn(component.subscriptions[1], 'unsubscribe');

    component.ngOnDestroy();

    expect(component.subscriptions[0].unsubscribe).toHaveBeenCalled();
    expect(component.subscriptions[1].unsubscribe).toHaveBeenCalled();
  });
});

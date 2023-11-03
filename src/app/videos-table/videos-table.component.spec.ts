import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideosTableComponent } from './videos-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../shared/data/data.service';

describe('VideosTableComponent', () => {
  let component: VideosTableComponent;
  let fixture: ComponentFixture<VideosTableComponent>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { paramMap: { get: (param: string) => null } },
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const dataServiceSpy = jasmine.createSpyObj('DataService', ['deleteVideo']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: Router, useValue: routerSpy },
        { provide: DataService, useValue: dataServiceSpy },
      ],
    });

    activatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(VideosTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call onEdit correctly', () => {
    const video = {
      id: 1,
      name: 'Video 1',
      author: 'Author 1',
      authorId: 1,
      categories: ['Category 1'],
      releaseDate: '2023-10-01',
      highestQuality: { format_name: 'one', res: '1080p', size: 1000 }
    };
    component.onEdit(video);
    expect(router.navigate).toHaveBeenCalledWith(['edit', 1], { relativeTo: activatedRoute });
  });
});

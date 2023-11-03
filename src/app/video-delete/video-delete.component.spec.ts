import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoDeleteComponent } from './video-delete.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ProcessedVideo } from '../shared/data/interfaces';
import { ButtonComponent } from '../button/button.component';

describe('VideoDeleteComponent', () => {
  let component: VideoDeleteComponent;
  let fixture: ComponentFixture<VideoDeleteComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<VideoDeleteComponent>>;
  let dialogData: ProcessedVideo;

  beforeEach(() => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    const dialogDataStub: ProcessedVideo = {
      id: 1,
      name: 'Test',
      author: 'Test Author',
      authorId: 1,
      categories: ['Comedy'],
      highestQuality: { format_name: 'one', res: '1080p', size: 1000 }
    };

    TestBed.configureTestingModule({
      imports: [MatDialogModule, ButtonComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: dialogDataStub },
      ],
    });

    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<VideoDeleteComponent>>;
    dialogData = TestBed.inject(MAT_DIALOG_DATA);
    
    fixture = TestBed.createComponent(VideoDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize dialogRef and data', () => {
    expect(component.dialogRef).toBe(dialogRef);
    expect(component.data).toEqual(dialogData);
  });
});

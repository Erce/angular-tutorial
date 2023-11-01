import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoAddComponent } from './video-add.component';

describe('VideoAddComponent', () => {
  let component: VideoAddComponent;
  let fixture: ComponentFixture<VideoAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VideoAddComponent]
    });
    fixture = TestBed.createComponent(VideoAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

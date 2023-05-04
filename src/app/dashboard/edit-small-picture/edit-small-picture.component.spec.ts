import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSmallPictureComponent } from './edit-small-picture.component';

describe('EditSmallPictureComponent', () => {
  let component: EditSmallPictureComponent;
  let fixture: ComponentFixture<EditSmallPictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSmallPictureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSmallPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

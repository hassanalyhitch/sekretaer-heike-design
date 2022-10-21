import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubFolderCardComponent } from './sub-folder-card.component';

describe('SubFolderCardComponent', () => {
  let component: SubFolderCardComponent;
  let fixture: ComponentFixture<SubFolderCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubFolderCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubFolderCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

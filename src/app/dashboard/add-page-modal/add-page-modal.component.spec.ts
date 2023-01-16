import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPageModalComponent } from './add-page-modal.component';

describe('AddPageModalComponent', () => {
  let component: AddPageModalComponent;
  let fixture: ComponentFixture<AddPageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPageModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

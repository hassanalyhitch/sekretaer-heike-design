import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopFabsComponent } from './desktop-fabs.component';

describe('DesktopFabsComponent', () => {
  let component: DesktopFabsComponent;
  let fixture: ComponentFixture<DesktopFabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopFabsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesktopFabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

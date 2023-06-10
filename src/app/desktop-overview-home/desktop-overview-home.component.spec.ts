import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopOverviewHomeComponent } from './desktop-overview-home.component';

describe('DesktopOverviewHomeComponent', () => {
  let component: DesktopOverviewHomeComponent;
  let fixture: ComponentFixture<DesktopOverviewHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopOverviewHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesktopOverviewHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

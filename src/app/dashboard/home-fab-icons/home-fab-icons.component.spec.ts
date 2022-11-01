import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeFabIconsComponent } from './home-fab-icons.component';

describe('HomeFabIconsComponent', () => {
  let component: HomeFabIconsComponent;
  let fixture: ComponentFixture<HomeFabIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeFabIconsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeFabIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
